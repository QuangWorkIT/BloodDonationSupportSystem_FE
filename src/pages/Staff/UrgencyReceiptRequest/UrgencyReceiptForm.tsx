import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { VolunteerProps } from "../DonorLookup/DonorLookup";
import { getComponentId, getTypeId } from "@/types/BloodCompatibility";
import { authenApi } from "@/lib/instance";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { useAuth } from "@/hooks/authen/AuthContext";
import { useNavigate } from "react-router-dom";


interface UrgentFormProps {
  setIsUrgentReceiptFormOpen: () => void,
  volunteerIds: VolunteerProps[]
}
const formSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập tên cơ sở y tế."),
  address: z.string().min(1, "Vui lòng nhập địa chỉ."),
  bloodType: z.string().min(1, "Vui lòng chọn nhóm máu."),
  bloodTypeRh: z.string().min(1, "Vui lòng chọn nhóm máu."),
  bloodComponent: z.string().min(1, "Vui lòng chọn loại máu."),
  bloodVolume: z.string().min(1, "Vui lòng chọn lượng máu."),
  donationDate: z.date({
    required_error: "Vui lòng chọn ngày hiến.",
    invalid_type_error: "Ngày không hợp lệ.",
  }),
  maxOfDonor: z.coerce.number({
    required_error: "Không được để trống",
    invalid_type_error: "Tổng người hiến không phù hợp"
  }),
  staffName: z.string().min(1, "Vui lòng nhập tên/ID nhân viên."),
});

type FormData = z.infer<typeof formSchema>;

const UrgencyReceiptForm = ({ volunteerIds, setIsUrgentReceiptFormOpen }: UrgentFormProps) => {
  const { user } = useAuth()
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "Hiến máu nhân đạo",
      address: "387 Đ. Lê Văn Việt, Tăng Nhơn Phú A, Thủ Đức, Hồ Chí Minh",
      bloodType: volunteerIds[0].bloodTypeName.substring(0,1),
      bloodTypeRh: volunteerIds[0].bloodTypeName.substring(1),
      bloodComponent: "",
      bloodVolume: "",
      donationDate: undefined,
      maxOfDonor: 0,
      staffName: user?.unique_name || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const volunteerIDs: number[] = volunteerIds.map(selected => selected.id);
    console.log('id array ', volunteerIDs)

    const bloodTypeId = getTypeId(data.bloodType + data.bloodTypeRh)
    const componentId = getComponentId(data.bloodComponent)
    const payload = {
      title: data.fullName,
      maxOfDonor: data.maxOfDonor,
      estimatedVolume: data.bloodVolume,
      eventTime: data.donationDate.toISOString().split('T')[0],
      bloodTypeId: bloodTypeId !== 0 ? bloodTypeId : 1,
      bloodComponent: componentId !== -1 ? componentId : 0,
      volunteerIds: volunteerIDs
    }

    try {
      console.log('payload ', payload)
      setIsSubmitting(true)
      const response = await authenApi.post('/api/Volunteers/find-donors',
        payload
      )
      const data = response.data

      if (data.isSuccess) {
        toast.success('Tạo sự kiện khẩn cấp và liên lạc với tình nguyện viên thành công!')
        // setIsUrgentReceiptFormOpen()
        navigate('/staff/receipt', {replace: true})
      } else {
        console.log('Error urgent creation ', data.message)
        toast.error('Tạo sự kiện khẩn cấp thất bại!')
      }
    } catch (error) {
      toast.error('Tạo sự kiện khẩn cấp thất bại!')
      const err = error as AxiosError
      if (err) console.log('Error axios create urgency ', err)
      else console.log('Error create urgency ', error)
    } finally {
      setIsSubmitting(false)
    }

  };

  return (
    <div className="w-[820px] mx-auto px-8 py-6 bg-white rounded-lg shadow-md border">
      <div className="flex justify-between">
        <h2 className="text-[27px] font-normal mb-6">Đơn yêu cầu nhận máu</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4 mt-4 cursor-pointer"
          onClick={setIsUrgentReceiptFormOpen}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </div>

      <div className="h-[1px] bg-black mb-6"></div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[40px]">
          {/* Medical institude */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="flex justify-between text-nowrap">
                <FormLabel className="  font-normal gap-0.5">
                  Tên sự kiện <span className="text-red-600">*</span>
                </FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <FormControl>
                    <Input className="w-[600px] h-[50px] border-2" placeholder="Nhập tên cơ sở y tế" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="flex justify-between text-nowrap">
                <FormLabel className="  font-normal gap-0.5">
                  Địa chỉ <span className="text-red-600">*</span>
                </FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <FormControl>
                    <Input className="w-[600px] h-[50px] border-2" placeholder="Nhập địa chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Blood type */}
          <div className="flex gap-19">
            <FormLabel className="font-normal gap-0.5">
              Nhóm máu<span className="text-red-600">*</span>
            </FormLabel>
            <div className="flex flex-1 gap-5">
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem >
                    <div className="flex flex-col items-start gap-2">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="w-[300px] h-[50px]">
                          <SelectTrigger className="border-2">
                            <SelectValue placeholder="Chọn ABO" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="AB">AB</SelectItem>
                          <SelectItem value="O">O</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bloodTypeRh"
                render={({ field }) => (
                  <FormItem className="">
                    <div className="flex flex-col items-start gap-2">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="w-[280px] h-[50px]">
                          <SelectTrigger className="border-2">
                            <SelectValue placeholder="Chọn Rh" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="+">+</SelectItem>
                          <SelectItem value="-">-</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Blood component */}
          <FormField
            control={form.control}
            name="bloodComponent"
            render={({ field }) => (
              <FormItem className="flex justify-between text-nowrap">
                <FormLabel className="  font-normal gap-0.5">
                  Loại máu <span className="text-red-600">*</span>
                </FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="w-[600px] h-[50px]">
                      <SelectTrigger className="border-2">
                        <SelectValue placeholder="Chọn kiểu máu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="wholeblood">Máu toàn phần</SelectItem>
                      <SelectItem value="redbloodcell">Hồng cầu</SelectItem>
                      <SelectItem value="platelet">Tiểu cầu</SelectItem>
                      <SelectItem value="plasma">Huyết tương</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Blood volume */}
          <div className="flex gap-5">
            <FormField
              control={form.control}
              name="maxOfDonor"
              render={({ field }) => (
                <FormItem className="flex justify-between flex-1">
                  <FormLabel className="font-normal w-[230px]">Tổng người hiến</FormLabel>
                  <div className="flex flex-col items-start gap-2 w-full">
                    <Input type="number" placeholder="Nhập tổng người hiến" {...field} className="border-2"></Input>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bloodVolume"
              render={({ field }) => (
                <FormItem className="flex justify-between w-80">
                  <FormLabel className="font-normal w-[150px]">Lượng máu cần</FormLabel>
                  <div className="flex flex-col items-start gap-2 w-full">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className="h-[50px] w-full">
                        <SelectTrigger className="border-2">
                          <SelectValue placeholder="Chọn lượng máu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="3500">3500ml</SelectItem>
                        <SelectItem value="4500">4500ml</SelectItem>
                        <SelectItem value="5500">5500ml</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Donation date*/}
          <FormField
            control={form.control}
            name="donationDate"
            render={({ field }) => (
              <FormItem className="flex justify-between text-nowrap">
                <FormLabel className="  font-normal">Ngày hiến</FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("w-[600px] h-[50px] pl-3 text-left font-normal border-2", !date && "text-muted-foreground")}>
                          {date ? date.toLocaleDateString() : <span>dd/MM/yyyy</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                          setDate(d ? new Date(d) : undefined);
                          field.onChange(d);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Staff name */}
          <FormField
            control={form.control}
            name="staffName"
            render={({ field }) => (
              <FormItem className="flex justify-between">
                <FormLabel className="  font-normal">Tên / ID nhân viên y tế</FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <FormControl>
                    <Input className="w-[600px] h-[50px] border-2" placeholder="Tên hoặc ID của nhân viên y tế thực hiện yêu cầu" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex gap-[20px]">
            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-[150px] h-[35x] text-[16px] bg-red-600 text-white hover:bg-red-800 rounded-full cursor-pointer">
              {isSubmitting ? "Đang gửi..." : "Gửi"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UrgencyReceiptForm;
