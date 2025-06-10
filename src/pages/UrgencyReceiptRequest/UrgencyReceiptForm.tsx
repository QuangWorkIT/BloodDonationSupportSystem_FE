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

const UrgencyReceiptForm = () => {
  const form = useForm({
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

  const [date, setDate] = useState<Date>();

  const onSubmit = (data: any) => {
    console.log(data);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Medical institude */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="flex justify-between text-nowrap">
                <FormLabel className="text-gray-500 font-normal gap-0.5">
                  Thông tin cơ sở <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input className="w-[600px] h-[50px]" placeholder="Nhập tên cơ sở y tế" {...field} />
                </FormControl>
                <FormMessage />
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
                <FormControl>
                  <Input className="w-[600px] h-[50px]" placeholder="Nhập địa chỉ" {...field} />
                </FormControl>
                <FormMessage />
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
                <FormMessage />
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
                  <FormControl>
                    <Input className="h-[50px]" type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem className="flex gap-[71px]">
                  <FormLabel className="text-gray-500 font-normal">đến</FormLabel>
                  <FormControl>
                    <Input className="h-[50px]" type="time" {...field} />
                  </FormControl>
                  <FormMessage />
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
                <FormControl>
                  <Input className="w-[600px] h-[50px]" placeholder="Tên hoặc ID của nhân viên y tế thực hiện yêu cầu" {...field} />
                </FormControl>
                <FormMessage />
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
