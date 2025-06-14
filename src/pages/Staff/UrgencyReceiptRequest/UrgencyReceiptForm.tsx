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

const formSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập tên cơ sở y tế."),
  address: z.string().min(1, "Vui lòng nhập địa chỉ."),
  bloodType: z.string().min(1, "Vui lòng chọn nhóm máu."),
  bloodComponent: z.string().min(1, "Vui lòng chọn loại máu."),
  bloodVolume: z.string().min(1, "Vui lòng chọn lượng máu."),
  donationDate: z.date({
    required_error: "Vui lòng chọn ngày hiến.",
    invalid_type_error: "Ngày không hợp lệ.",
  }),
  startTime: z.string().min(1, "Vui lòng nhập giờ bắt đầu."),
  endTime: z.string().min(1, "Vui lòng nhập giờ kết thúc."),
  staffName: z.string().min(1, "Vui lòng nhập tên/ID nhân viên."),
});

type FormData = z.infer<typeof formSchema>;

const UrgencyReceiptForm = () => {
  const [date, setDate] = useState<Date>();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      address: "",
      bloodType: "",
      bloodComponent: "",
      bloodVolume: "",
      donationDate: undefined,
      startTime: "",
      endTime: "",
      staffName: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="w-[866px] mx-auto px-8 py-6 bg-white rounded-lg shadow-md border">
      <div className="flex justify-between">
        <h2 className="text-[27px] font-normal mb-6 text-gray-500">Đơn yêu cầu nhận máu</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="text-gray-500 size-4 mt-4 cursor-pointer"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </div>

      <div className="h-[1px] bg-gray-200 mb-6"></div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[40px]">
          {/* Medical institude */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="flex justify-between text-nowrap">
                <FormLabel className="text-gray-500 font-normal gap-0.5">
                  Thông tin cơ sở <span className="text-red-600">*</span>
                </FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <FormControl>
                    <Input className="w-[600px] h-[50px]" placeholder="Nhập tên cơ sở y tế" {...field} />
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
                <FormLabel className="text-gray-500 font-normal gap-0.5">
                  Địa chỉ <span className="text-red-600">*</span>
                </FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <FormControl>
                    <Input className="w-[600px] h-[50px]" placeholder="Nhập địa chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Blood type */}
          <FormField
            control={form.control}
            name="bloodType"
            render={({ field }) => (
              <FormItem className="flex justify-between text-nowrap">
                <FormLabel className="text-gray-500 font-normal gap-0.5">
                  Nhóm máu cần <span className="text-red-600">*</span>
                </FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <div className="flex gap-[100px]">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="w-[250px] h-[50px]">
                        <SelectTrigger>
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

                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="w-[250px] h-[50px]">
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn Rh" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="+">+</SelectItem>
                        <SelectItem value="-">-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Blood component */}
          <FormField
            control={form.control}
            name="bloodComponent"
            render={({ field }) => (
              <FormItem className="flex justify-between text-nowrap">
                <FormLabel className="text-gray-500 font-normal gap-0.5">
                  Loại máu <span className="text-red-600">*</span>
                </FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="w-[600px] h-[50px]">
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn kiểu máu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Whole blood">Toàn phần</SelectItem>
                      <SelectItem value="Red blood cells">Hồng cầu</SelectItem>
                      <SelectItem value="Plasma">Huyết tương</SelectItem>
                      <SelectItem value="Platelets">Tiểu cầu</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Blood volume */}
          <FormField
            control={form.control}
            name="bloodVolume"
            render={({ field }) => (
              <FormItem className="flex justify-between text-nowrap">
                <FormLabel className="text-gray-500 font-normal gap-0.5">
                  Lượng máu cần <span className="text-red-600">*</span>
                </FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="w-[600px] h-[50px]">
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lượng máu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="250ml">250ml</SelectItem>
                      <SelectItem value="350ml">350ml</SelectItem>
                      <SelectItem value="450ml">450ml</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Donation date*/}
          <FormField
            control={form.control}
            name="donationDate"
            render={({ field }) => (
              <FormItem className="flex justify-between text-nowrap">
                <FormLabel className="text-gray-500 font-normal">Ngày hiến</FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("w-[600px] h-[50px] pl-3 text-left font-normal", !date && "text-muted-foreground")}>
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Donation time */}
          <div className="flex gap-[71px] w-full">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="flex gap-[142px]">
                  <FormLabel className="text-gray-500 font-normal text-nowrap">Thời gian</FormLabel>
                  <div className="flex flex-col items-start gap-2">
                    <FormControl>
                      <Input className="h-[50px]" type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem className="flex gap-[71px]">
                  <FormLabel className="text-gray-500 font-normal">đến</FormLabel>
                  <div className="flex flex-col items-start gap-2">
                    <FormControl>
                      <Input className="h-[50px]" type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Staff name */}
          <FormField
            control={form.control}
            name="staffName"
            render={({ field }) => (
              <FormItem className="flex justify-between">
                <FormLabel className="text-gray-500 font-normal">Tên / ID nhân viên y tế</FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <FormControl>
                    <Input className="w-[600px] h-[50px]" placeholder="Tên hoặc ID của nhân viên y tế thực hiện yêu cầu" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex gap-[20px]">
            <Button type="submit" className="w-[160px] h-[50px] bg-red-600 text-white hover:bg-red-800 rounded-full cursor-pointer">
              Gửi
            </Button>
            <Button type="button" variant="outline" className="w-[160px] h-[50px] bg-red-200 hover:bg-red-400 rounded-full cursor-pointer">
              Hủy
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UrgencyReceiptForm;
