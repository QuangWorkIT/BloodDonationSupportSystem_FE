"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import BloodTypeSelect, { BloodComponentSelect, BloodTypeSelectRh } from "@/components/layout/BloodTypeSelect"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"
import type { Donor } from "@/pages/Staff/BloodAnalysis/BloodAnalysisEventList"
import { getComponentId, getTypeId } from "@/types/BloodCompatibility"
import { authenApi } from "@/lib/instance"
import { toast } from "react-toastify"
import { useState, useEffect } from "react"

interface BloodAnalysisProps {
    donor: Donor,
    setIsAnalysisFormOpen: () => void,
    fetchEvents: () => Promise<void>
}

const formSchema = z.object({
    // normal information
    donorName: z.string().min(1, { message: "Tên người hiến không được để trống" }),
    bloodType: z.string({ required_error: "Hãy chọn nhóm máu" }),
    rhFactor: z.string({ required_error: "Hãy chọn nhóm máu" }),
    donationDate: z
        .date({
            required_error: "Cần điền thơi gian",
            invalid_type_error: "Thời gian không hợp lệ"
        }),
    bloodComponent: z.string({ required_error: "Hãy chọn thành phần máu" }),
    volume: z.coerce.number({
        invalid_type_error: "Thông số không phù hợp"
    })
        .min(10, { message: "Thể tích không hợp lệ" })
        .max(2000, { message: "Thể tích không hợp lệ" }),

    // qualified result
    hiv: z.enum(["true", "false"], {
        required_error: "Thông tin bắt buộc"
    }),
    hepatitisC: z.enum(["true", "false"], {
        required_error: "Thông tin bắt buộc"
    }),
    syphilis: z.enum(["true", "false"], {
        required_error: "Thông tin bắt buộc"
    }),
    hematocrit: z.coerce.number({
        required_error: "Thông tin bắt buộc"
    })
        .min(1, { message: "Thông số không phù hợp" })
        .max(200, { message: "Thông số không phù hợp" }),
    isQualified: z.enum(["true", "false"], {
        required_error: "Thông tin bắt buộc"
    }),
    // Add confirmation checkbox
    confirmSubmission: z.boolean().refine(val => val === true, {
        message: "Bạn phải xác nhận thông tin trước khi gửi"
    }),
})

type formType = z.infer<typeof formSchema>
type formTypeName = keyof formType
function BloodAnalysisForm({ setIsAnalysisFormOpen, donor, fetchEvents }: BloodAnalysisProps) {
    const[isSubmitting, setIsSubmitting] = useState(false)
    const[qualificationStatus, setQualificationStatus] = useState<"true" | "false">("true")
    const[qualificationReasons, setQualificationReasons] = useState<string[]>([])
    
    const criterias: { label: string, name: formTypeName }[] = [
        { label: "HIV", name: "hiv" },
        { label: "Viêm gan C", name: "hepatitisC" },
        { label: "Giang mai", name: "syphilis" },
    ]
    const form = useForm<formType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            donorName: donor.fullName,
            bloodType: donor.bloodTypeName?.substring(0, 1),
            rhFactor: donor.bloodTypeName?.substring(1),
            donationDate: new Date(donor.performedAt),
            bloodComponent: undefined,
            volume: donor.volume,
            hematocrit: 0,
            confirmSubmission: false, // Add default value for confirmation
        }
    })

    // Add useEffect to calculate qualification status whenever form values change
    useEffect(() => {
        const formValues = form.getValues();
        let isQualified = true;
        const reasons: string[] = [];
        
        // Check hematocrit range (37%-52%)
        const hematocrit = formValues.hematocrit;
        if (hematocrit < 37 || hematocrit > 52) {
            isQualified = false;
            reasons.push(`Hàm lượng hematocrit (${hematocrit}%) nằm ngoài phạm vi cho phép (37%-52%)`)
        }
        
        // Check for diseases
        if (formValues.hiv === "true") {
            isQualified = false;
            reasons.push("Phát hiện HIV")
        }
        
        if (formValues.hepatitisC === "true") {
            isQualified = false;
            reasons.push("Phát hiện Viêm gan C")
        }
        
        if (formValues.syphilis === "true") {
            isQualified = false;
            reasons.push("Phát hiện Giang mai")
        }
        
        // Update the qualification status and reasons
        setQualificationStatus(isQualified ? "true" : "false");
        setQualificationReasons(reasons);
        form.setValue("isQualified", isQualified ? "true" : "false");
    }, [form.watch("hematocrit"), form.watch("hiv"), form.watch("hepatitisC"), form.watch("syphilis")]);

    const onSubmit = async (values: formType) => {
        const bloodTypeId = getTypeId(values.bloodType + values.rhFactor) > 0 ? getTypeId(values.bloodType + values.rhFactor) : 1
        const componentId = getComponentId(values.bloodComponent) >= 0 ? getComponentId(values.bloodComponent) : 0
        const payload = {
            isQualified: values.isQualified,
            bloodTypeId: bloodTypeId,
            bloodComponent: componentId,
        }

        console.log("payload ", payload)
        try {
            setIsSubmitting(true)
            const response = await authenApi.post(`/api/blood-registrations/${donor.donationRegisId}/blood-procedures/qualify`,
                payload
            )
            const data = response.data

            console.log(data.message)
            toast.success('Gửi đơn phân tích máu thành công!')
            await fetchEvents()
            setIsAnalysisFormOpen()
        } catch (error) {
            console.log('Error submitting blood analysis form ', error)
            toast.error('Gửi đơn phân tích máu thất bại!')
        }finally{
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full">
            <div className="w-full max-w-3xl mx-auto px-6 py-8 bg-white rounded-2xl shadow-lg mt-10 mb-10">
                {/* form header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center px-2">
                        <h1 className="text-2xl md:text-3xl font-bold">Đơn phân tích và kiểm định mẫu máu</h1>
                        <svg
                            onClick={setIsAnalysisFormOpen}
                            className="hover:cursor-pointer" width="20" height="20" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L11 11M11 1L1 11" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <hr className="w-full bg-[#E6E9EC] mt-4" />
                </div>

                {/* form content */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Basic Info */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Thông tin cơ bản</h2>
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="donorName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium">Họ tên người hiến</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="Nhập tên người hiến" 
                                                        {...field} 
                                                        className="bg-white" 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex gap-3">
                                        <FormField
                                            control={form.control}
                                            name="bloodType"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className="font-medium">Nhóm máu</FormLabel>
                                                    <FormControl>
                                                        <BloodTypeSelect onValueChange={field.onChange} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="rhFactor"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className="font-medium invisible">Rh</FormLabel>
                                                    <FormControl>
                                                        <BloodTypeSelectRh onValueChange={field.onChange} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="bloodComponent"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium">Loại máu hiến</FormLabel>
                                                <FormControl>
                                                    <BloodComponentSelect onValueChange={field.onChange} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="donationDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium">Ngày hiến</FormLabel>
                                                <FormControl>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="outline" className="w-full shadow-sm flex justify-between items-center">
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>mm/dd/yyyy</span>
                                                                )}
                                                                <CalendarIcon className="ml-2 h-4 w-4 opacity-75" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                disabled={(date: Date) => {
                                                                    return date >= new Date() || date < new Date("2000-01-01")
                                                                }}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="volume"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium">Thể tích (ml)</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="number" 
                                                        placeholder="Vd: 250,300,350..." 
                                                        {...field} 
                                                        className="bg-white" 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Clinical Results */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Kết quả kiểm định lâm sàn</h2>
                                <div className="space-y-11"> {/* Changed from space-y-4 to space-y-6 */}
                                    {criterias.map((criteria, index) => (
                                        <FormField
                                            key={index}
                                            control={form.control}
                                            name={criteria.name}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-medium">{criteria.label}</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            className="flex gap-20 mt-2" // Changed from gap-8 to justify-between w-full
                                                            defaultValue={field.value === undefined || field.value === null ? '' : String(field.value)}
                                                        >
                                                            <FormItem className="flex items-center gap-2">
                                                                <FormControl>
                                                                    <RadioGroupItem value="true" className="border-2 border-gray-500" />
                                                                </FormControl>
                                                                <FormLabel className="text-[16px] font-semibold">Có</FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center gap-2">
                                                                <FormControl>
                                                                    <RadioGroupItem value="false" className="border-2 border-gray-500" />
                                                                </FormControl>
                                                                <FormLabel className="text-[16px] font-semibold">Không</FormLabel>
                                                            </FormItem>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                    <FormField
                                        control={form.control}
                                        name="hematocrit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium">Hàm lượng hematocrit (%)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Vd: 41,43,..."
                                                        value={field.value === undefined || field.value === null ? '' : String(field.value)}
                                                        onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                                        className="bg-white"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* form footer */}
                        <div className="flex flex-col items-center mt-8">
                            <FormField
                                control={form.control}
                                name="isQualified"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col mb-5 gap-3 items-center justify-center">
                                        <FormLabel className="w-auto text-[18px] font-semibold">Kết luận tổng thể</FormLabel>
                                        <div className="flex flex-col gap-2 w-full">
                                            {qualificationStatus === "true" ? (
                                                <div className="text-[16px] italic bg-green-100 px-3 py-2 rounded-md text-center">
                                                    Đạt chuẩn
                                                </div>
                                            ) : (
                                                <div className="text-[16px] italic text-red-600 bg-red-100 px-3 py-2 rounded-md text-center">
                                                    Không đạt chuẩn
                                                </div>
                                            )}
                                            
                                            {qualificationReasons.length > 0 && (
                                                <div className="bg-red-50 p-3 rounded-md">
                                                    <p className="font-medium mb-1">Lý do không đạt chuẩn:</p>
                                                    <ul className="list-disc pl-5 text-sm text-red-600">
                                                        {qualificationReasons.map((reason, index) => (
                                                            <li key={index}>{reason}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            {/* Add confirmation checkbox */}
                            <FormField
                                control={form.control}
                                name="confirmSubmission"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2 mb-4">
                                        <FormControl>
                                            <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={field.onChange}
                                                className="h-4 w-4 border-gray-300 rounded text-red-600 focus:ring-red-500"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            Xác nhận hoàn tất quy trình phân tích mẫu máu
                                        </FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <Button
                                disabled={isSubmitting || !form.getValues().confirmSubmission}
                                type="submit"
                                className="text-[15px] font-bold bg-[#BA1B1D] rounded-[7px] w-[200px] h-[40px] mb-[20px] hover:cursor-pointer hover:bg-[#9F1214] mt-2"
                            >
                                Gửi kết quả
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default BloodAnalysisForm
