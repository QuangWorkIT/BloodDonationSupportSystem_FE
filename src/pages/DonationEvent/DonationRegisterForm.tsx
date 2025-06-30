"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import BloodTypeSelect, { BloodTypeSelectRh } from "../../components/layout/BloodTypeSelect"
import { useEffect, useState } from "react"
import type { User } from "@/types/User"
import { authenApi } from "@/lib/instance"
import { getBloodTypeRh, type bloodType } from "@/types/BloodCompatibility"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

interface DonationRegistrationProps {
    eventId: number,
    eventTime: string,
    setRegistraionFormOpen: (isOpen: boolean) => void
}

// define form schema
const formSchema = z.object({
    donorName: z.string()
        .min(1, { message: "Tên người dùng không được để trống" })
        .max(50, { message: "Tên không hợp lệ" }),

    height: z.coerce.number({
        required_error: "Chiều cao không được để trống",
        invalid_type_error: "Chiều cao phải là số hợp lệ",
    })
        .min(1, { message: "Chiều cao không hợp lệ" })
        .max(3, { message: "Chiều cao không hợp lệ" }),

    weight: z.coerce.number({
        required_error: "Cân nặng không được để trống",
        invalid_type_error: "Cân nặng phải là số hợp lệ",
    })
        .min(42, { message: "Cân nặng phải từ 42 kg" })
        .max(150, { message: "Cân nặng không hợp lệ" }),

    address: z.string()
        .min(1, { message: "Cần điền địa chỉ" })
        .max(200, { message: "Địa chỉ không hợp lệ" }),


    lastDonation: z
        .date({
            required_error: "Cần điền thơi gian",
            invalid_type_error: "Thời gian không hợp lệ"
        }),

    donationDate: z.date().optional(),

    bloodType: z.string({ required_error: "Hãy chọn loại máu" }),

    bloodTypeRh: z.string({ required_error: "Hãy chọn loại máu" }),

    phone: z.string()
        .nonempty("Cần điền số điện thoại")
        .regex(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/, {
            message: "Số điện thoại không hợp lệ",
        }),


    email: z.string()
        .nonempty("Cần điền email")
        .email({ message: "Email không hợp lệ" })
})

type formType = z.infer<typeof formSchema>
function DonationRegisterForm({ eventId, eventTime, setRegistraionFormOpen }: DonationRegistrationProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [currentBloodType, setCurretnBloodType] = useState<bloodType | null>(null)
    const [isRegister, setIsRegister] = useState(false)
    const navigate = useNavigate()
    // get user
    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await authenApi.get('/api/users/profile')
                const data = response.data

                if (data.isSuccess) {
                    const user = {
                        name: data.data.name || "",
                        phone: data.data.phone || "",
                        gmail: data.data.gmail || "",
                        bloodType: data.data.bloodType || "",
                        dob: new Date(data.data.dob) || null,
                        gender: data.data.gender || false,
                        address: data.data.address || ""
                    }
                    const bloodType = getBloodTypeRh(user.bloodType)
                    setCurrentUser(user as User)
                    setCurretnBloodType(bloodType)
                }
            } catch (error) {
                console.log('Fetch user failed', error)
            }
        }

        getUser()
    }, [])

    // create form resolver for validation
    const form = useForm<formType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            donorName: "",
            height: 0,
            weight: 0,
            address: "",
            lastDonation: undefined,
            donationDate: new Date(eventTime),
            bloodType: "",
            bloodTypeRh: "",
            phone: "",
            email: ""
        }
    })
    
    // update default form value
    const { reset } = form
    useEffect(() => {
        if (!currentUser) return

        reset({
            donorName: currentUser.name,
            phone: currentUser.phone,
            email: currentUser.gmail,
            bloodType: currentBloodType ? currentBloodType.bloodType : "",
            bloodTypeRh: currentBloodType ? currentBloodType.rh : "",
            address: currentUser.address
        });
    }, [currentUser])


    const onSubmit = async (values: formType) => {
        try {
            setIsRegister(true)
            const response = await authenApi.post(`/api/events/${eventId}/blood-registrations`,{
                "lastDonation": values.lastDonation.toISOString().split('T')[0]
            })

            const data = response.data
            if(data.isSuccess) {
                toast.success('Đăng ký hiến máu thành công!')
            }
        } catch (error) {
            console.log('Error register ', error)
            toast.error('Đăng ký hiến máu thất bại!')
        }finally {
            setIsRegister(false)
            navigate('/home',  {replace:true})
        }
    }


    return (
        <div className="w-[700px] border-3 rounded-[10px] mx-auto">
            {/* form header */}
            <div className="mb-[25px]">
                <div className="flex justify-between items-center my-[25px] px-[20px]">
                    <h1 className="text-[28px] font-semibold">Đơn đăng ký hiến máu</h1>

                    <svg
                        onClick={() => setRegistraionFormOpen(false)}
                        className="hover:cursor-pointer" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="path-1-inside-1_665_8286" fill="white">
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.5843 1.02432C11.6968 0.911789 11.7601 0.759169 11.7601 0.600031C11.7601 0.440893 11.6968 0.288272 11.5843 0.175745C11.4718 0.0632173 11.3192 0 11.16 0C11.0009 0 10.8483 0.0632173 10.7357 0.175745L5.88003 5.03146L1.02432 0.175745C0.911789 0.0632173 0.759169 1.15868e-08 0.600031 1.27724e-08C0.440893 1.39581e-08 0.288272 0.0632173 0.175745 0.175745C0.0632173 0.288272 1.39581e-08 0.440893 1.27724e-08 0.600031C1.15868e-08 0.759169 0.0632173 0.911789 0.175745 1.02432L5.03146 5.88003L0.175745 10.7357C0.0632173 10.8483 0 11.0009 0 11.16C0 11.3192 0.0632173 11.4718 0.175745 11.5843C0.288272 11.6968 0.440893 11.7601 0.600031 11.7601C0.759169 11.7601 0.911789 11.6968 1.02432 11.5843L5.88003 6.7286L10.7357 11.5843C10.8483 11.6968 11.0009 11.7601 11.16 11.7601C11.3192 11.7601 11.4718 11.6968 11.5843 11.5843C11.6968 11.4718 11.7601 11.3192 11.7601 11.16C11.7601 11.0009 11.6968 10.8483 11.5843 10.7357L6.7286 5.88003L11.5843 1.02432Z" />
                        </mask>
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.5843 1.02432C11.6968 0.911789 11.7601 0.759169 11.7601 0.600031C11.7601 0.440893 11.6968 0.288272 11.5843 0.175745C11.4718 0.0632173 11.3192 0 11.16 0C11.0009 0 10.8483 0.0632173 10.7357 0.175745L5.88003 5.03146L1.02432 0.175745C0.911789 0.0632173 0.759169 1.15868e-08 0.600031 1.27724e-08C0.440893 1.39581e-08 0.288272 0.0632173 0.175745 0.175745C0.0632173 0.288272 1.39581e-08 0.440893 1.27724e-08 0.600031C1.15868e-08 0.759169 0.0632173 0.911789 0.175745 1.02432L5.03146 5.88003L0.175745 10.7357C0.0632173 10.8483 0 11.0009 0 11.16C0 11.3192 0.0632173 11.4718 0.175745 11.5843C0.288272 11.6968 0.440893 11.7601 0.600031 11.7601C0.759169 11.7601 0.911789 11.6968 1.02432 11.5843L5.88003 6.7286L10.7357 11.5843C10.8483 11.6968 11.0009 11.7601 11.16 11.7601C11.3192 11.7601 11.4718 11.6968 11.5843 11.5843C11.6968 11.4718 11.7601 11.3192 11.7601 11.16C11.7601 11.0009 11.6968 10.8483 11.5843 10.7357L6.7286 5.88003L11.5843 1.02432Z" fill="#838183" />
                        <path d="M10.7357 0.175745L9.32153 -1.23847L10.7357 0.175745ZM5.88003 5.03146L4.46582 6.44567L5.88003 7.85989L7.29424 6.44567L5.88003 5.03146ZM1.02432 0.175745L2.43853 -1.23847L2.43853 -1.23847L1.02432 0.175745ZM0.175745 1.02432L-1.23847 2.43853L-1.23847 2.43853L0.175745 1.02432ZM5.03146 5.88003L6.44567 7.29424L7.85989 5.88003L6.44567 4.46582L5.03146 5.88003ZM0.175745 10.7357L-1.23847 9.32153L0.175745 10.7357ZM0 11.16H-2H0ZM5.88003 6.7286L7.29424 5.31439L5.88003 3.90017L4.46582 5.31439L5.88003 6.7286ZM10.7357 11.5843L12.15 10.1701L12.15 10.1701L10.7357 11.5843ZM11.5843 10.7357L10.1701 12.15L10.1701 12.15L11.5843 10.7357ZM6.7286 5.88003L5.31439 4.46582L3.90017 5.88003L5.31439 7.29424L6.7286 5.88003ZM11.5843 1.02432L12.9985 2.43853C13.4861 1.95093 13.7601 1.2896 13.7601 0.600031H11.7601H9.76006C9.76006 0.228735 9.90756 -0.127353 10.1701 -0.389897L11.5843 1.02432ZM11.7601 0.600031H13.7601C13.7601 -0.0895414 13.4861 -0.750869 12.9985 -1.23847L11.5843 0.175745L10.1701 1.58996C9.90756 1.32741 9.76006 0.971327 9.76006 0.600031H11.7601ZM11.5843 0.175745L12.9985 -1.23847C12.5109 -1.72607 11.8496 -2 11.16 -2L11.16 0L11.16 2C10.7887 2 10.4326 1.8525 10.1701 1.58996L11.5843 0.175745ZM11.16 0V-2C10.4705 -2 9.80913 -1.72607 9.32153 -1.23847L10.7357 0.175745L12.15 1.58996C11.8874 1.8525 11.5313 2 11.16 2V0ZM10.7357 0.175745L9.32153 -1.23847L4.46582 3.61725L5.88003 5.03146L7.29424 6.44567L12.15 1.58996L10.7357 0.175745ZM5.88003 5.03146L7.29424 3.61725L2.43853 -1.23847L1.02432 0.175745L-0.389897 1.58996L4.46582 6.44567L5.88003 5.03146ZM1.02432 0.175745L2.43853 -1.23847C1.95093 -1.72607 1.2896 -2 0.600031 -2L0.600031 1.27724e-08L0.600031 2C0.228736 2 -0.127352 1.8525 -0.389897 1.58996L1.02432 0.175745ZM0.600031 1.27724e-08L0.600031 -2C-0.0895404 -2 -0.750868 -1.72607 -1.23847 -1.23847L0.175745 0.175745L1.58996 1.58996C1.32741 1.8525 0.971326 2 0.600031 2L0.600031 1.27724e-08ZM0.175745 0.175745L-1.23847 -1.23847C-1.72607 -0.750868 -2 -0.0895404 -2 0.600031L1.27724e-08 0.600031L2 0.600031C2 0.971326 1.8525 1.32741 1.58996 1.58996L0.175745 0.175745ZM1.27724e-08 0.600031L-2 0.600031C-2 1.2896 -1.72607 1.95093 -1.23847 2.43853L0.175745 1.02432L1.58996 -0.389897C1.8525 -0.127352 2 0.228736 2 0.600031L1.27724e-08 0.600031ZM0.175745 1.02432L-1.23847 2.43853L3.61725 7.29424L5.03146 5.88003L6.44567 4.46582L1.58996 -0.389897L0.175745 1.02432ZM5.03146 5.88003L3.61725 4.46582L-1.23847 9.32153L0.175745 10.7357L1.58996 12.15L6.44567 7.29424L5.03146 5.88003ZM0.175745 10.7357L-1.23847 9.32153C-1.72607 9.80913 -2 10.4705 -2 11.16L0 11.16L2 11.16C2 11.5313 1.8525 11.8874 1.58996 12.15L0.175745 10.7357ZM0 11.16H-2C-2 11.8496 -1.72607 12.5109 -1.23847 12.9985L0.175745 11.5843L1.58996 10.1701C1.8525 10.4326 2 10.7887 2 11.16H0ZM0.175745 11.5843L-1.23847 12.9985C-0.750869 13.4861 -0.0895414 13.7601 0.600031 13.7601V11.7601V9.76006C0.971327 9.76006 1.32741 9.90756 1.58996 10.1701L0.175745 11.5843ZM0.600031 11.7601V13.7601C1.2896 13.7601 1.95093 13.4861 2.43853 12.9985L1.02432 11.5843L-0.389897 10.1701C-0.127353 9.90756 0.228735 9.76006 0.600031 9.76006V11.7601ZM1.02432 11.5843L2.43853 12.9985L7.29424 8.14282L5.88003 6.7286L4.46582 5.31439L-0.389897 10.1701L1.02432 11.5843ZM5.88003 6.7286L4.46582 8.14282L9.32153 12.9985L10.7357 11.5843L12.15 10.1701L7.29424 5.31439L5.88003 6.7286ZM10.7357 11.5843L9.32153 12.9985C9.80913 13.4861 10.4705 13.7601 11.16 13.7601V11.7601V9.76006C11.5313 9.76006 11.8874 9.90756 12.15 10.1701L10.7357 11.5843ZM11.16 11.7601V13.7601C11.8496 13.7601 12.5109 13.4861 12.9985 12.9985L11.5843 11.5843L10.1701 10.1701C10.4326 9.90756 10.7887 9.76006 11.16 9.76006V11.7601ZM11.5843 11.5843L12.9985 12.9985C13.4861 12.5109 13.7601 11.8496 13.7601 11.16H11.7601H9.76006C9.76006 10.7887 9.90756 10.4326 10.1701 10.1701L11.5843 11.5843ZM11.7601 11.16H13.7601C13.7601 10.4705 13.4861 9.80913 12.9985 9.32153L11.5843 10.7357L10.1701 12.15C9.90756 11.8874 9.76006 11.5313 9.76006 11.16H11.7601ZM11.5843 10.7357L12.9985 9.32153L8.14282 4.46582L6.7286 5.88003L5.31439 7.29424L10.1701 12.15L11.5843 10.7357ZM6.7286 5.88003L8.14282 7.29424L12.9985 2.43853L11.5843 1.02432L10.1701 -0.389897L5.31439 4.46582L6.7286 5.88003Z" fill="#848385" mask="url(#path-1-inside-1_665_8286)" />
                    </svg>
                </div>

                <hr className="w-full bg-[#E6E9EC]" />
            </div>

            {/* form content */}
            <Form {...form}>
                <form className="px-[20px]" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="donorName"
                        render={({ field }) => (
                            <FormItem className="flex mb-5">
                                <FormLabel className="w-[200px] text-[18px] whitespace-nowrap">Tên người hiến</FormLabel>
                                <div className="flex-1">
                                    <FormControl>
                                        <Input placeholder="Họ và tên" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-5 w-full mb-5">
                        <FormField
                            control={form.control}
                            name="height"
                            render={({ field }) => (
                                <FormItem className="flex gap-5 flex-1">
                                    <FormLabel className="text-[18px] whitespace-nowrap">Chiều cao (m)</FormLabel>
                                    <div className="w-full">
                                        <FormControl>
                                            <Input type="number" placeholder="Nhập chiều cao" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem className="flex gap-5 flex-1">
                                    <FormLabel className="text-[18px] whitespace-nowrap">Cân nặng (kg)</FormLabel>
                                    <div className="w-full">
                                        <FormControl>
                                            <Input type="number" placeholder="Nhập cân nặng" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem className="flex mb-5">
                                <FormLabel className="w-[200px] text-[18px] whitespace-nowrap">Địa chỉ</FormLabel>
                                <div className="flex-1">
                                    <FormControl>
                                        <Input placeholder="Nhập địa chỉ" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastDonation"
                        render={({ field }) => (
                            <FormItem className="flex mb-5">
                                <FormLabel className="w-[200px] text-[18px] whitespace-nowrap">Lần cuối hiến máu</FormLabel>
                                <div className="flex-1">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className="w-full shadow-sm font-bold"
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>mm/dd/yyyy</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-75" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date: Date) => {
                                                    return date >= new Date() || date < new Date("2000-01-01")
                                                }}
                                            ></Calendar>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="donationDate"
                        render={({ field }) => (
                            <FormItem className="flex mb-5 ">
                                <FormLabel className="w-[200px] text-[18px] whitespace-nowrap">Ngày hiến</FormLabel>
                                <div className="flex-1">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    disabled
                                                    className="w-full shadow-sm font-bold"
                                                >
                                                    {format(new Date(field.value ? field.value : ""), "PPP")}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-75" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date: Date) => {
                                                    return date >= new Date() || date < new Date("2000-01-01")
                                                }}
                                            ></Calendar>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <div className="flex mb-5">
                        <FormLabel className="w-[210px] text-[18px] whitespace-nowrap">Nhóm máu</FormLabel>
                        <div className="flex flex-1 gap-5">
                            <FormField
                                control={form.control}
                                name="bloodType"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <BloodTypeSelect onValueChange={field.onChange} defaultVal={field.value}></BloodTypeSelect>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="bloodTypeRh"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <BloodTypeSelectRh onValueChange={field.onChange} defaultVal={field.value}></BloodTypeSelectRh>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>

                                )}
                            />
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="flex mb-5">
                                <FormLabel className="w-[200px] text-[18px] whitespace-nowrap">Số điện thoại</FormLabel>
                                <div className="flex-1">
                                    <FormControl>
                                        <Input placeholder="Nhập số điện thoại" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="flex mb-5">
                                <FormLabel className="w-[200px] text-[18px] whitespace-nowrap">Email</FormLabel>
                                <div className="flex-1">
                                    <FormControl>
                                        <Input placeholder="Địa chỉ email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled = {isRegister}
                        className="text-[15px] font-bold bg-[#BA1B1D] rounded-[10px] w-[120px] mb-[20px] hover:cursor-pointer hover:bg-[#9F1214]"
                    >
                        Gửi
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default DonationRegisterForm
