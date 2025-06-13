import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  receiverName: z.string().min(1, "Vui lòng nhập tên người nhận"),
  bloodType: z.string().min(1, "Vui lòng chọn nhóm máu."),
  volume: z.string().refine((val) => /^\d{2,3}$/.test(val), "Lượng máu phải là số hợp lệ (vd: 250)"),
  note: z.string().optional(),
  staffId: z.string().min(1, "Vui lòng nhập tên hoặc ID nhân viên y tế"),
  confirm: z.boolean().refine((val) => val === true, {
    message: "Bạn cần xác nhận đã hoàn tất nhận máu",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function StaffCheckoutReceiptForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiverName: "",
      bloodType: "",
      volume: "",
      note: "",
      staffId: "",
      confirm: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  const isConfirmChecked = form.watch("confirm");

  return (
    <div className="w-[866px] mx-auto px-8 py-6 bg-white rounded-lg shadow-md border">
      <div className="flex justify-between">
        <h2 className="text-[27px] font-normal mb-6">Đơn xác nhận hoàn tất nhận máu</h2>
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Receiver name */}
          <FormField
            control={form.control}
            name="receiverName"
            render={({ field }) => (
              <FormItem className="flex justify-between">
                <FormLabel className="text-lg text-nowrap">Tên cơ sở</FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <FormControl>
                    <Input placeholder="(Tên cơ sở đã được điền hoặc staff tự nhập)" className="w-[550px] h-[50px]" {...field} />
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
                <FormLabel className="text-lg gap-0.5">
                  Nhóm máu cần <span className="text-red-600">*</span>
                </FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <div className="flex gap-[100px]">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="w-[225px] h-[50px]">
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
                      <FormControl className="w-[225px] h-[50px]">
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

          {/* Blood volume */}
          <FormField
            control={form.control}
            name="volume"
            render={({ field }) => (
              <FormItem className="flex justify-between text-nowrap">
                <FormLabel className="text-lg text-nowrap">Lượng máu đã nhận (ml)</FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <FormControl>
                    <Input className="w-[550px] h-[50px]" placeholder="Vd: 250, 350,..." {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Note */}
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-nowrap">Ghi chú</FormLabel>
                <FormControl>
                  <Input className="w-full h-[130px]" placeholder="(Ghi chú thêm của nhân viên y tế cho bệnh nhân)" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Staff name / id */}
          <FormField
            control={form.control}
            name="staffId"
            render={({ field }) => (
              <FormItem className="flex justify-between text-nowrap">
                <FormLabel className="text-lg text-nowrap">Tên / ID nhân viên y tế</FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <FormControl>
                    <Input className="w-[550px] h-[50px]" placeholder="(Tên hoặc ID của nhân viên y tế đã được điền)" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Confirm */}
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-start gap-2.5">
                  <FormControl>
                    <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} className="w-6 h-6" />
                  </FormControl>
                  <FormLabel htmlFor="confirm" className="font-normal">
                    Xác nhận hoàn tất quy trình nhận máu đối với bệnh nhân này
                  </FormLabel>
                </div>
                <FormMessage className="ml-[34px] mt-2.5 font-semibold" />
              </FormItem>
            )}
          />

          <div className="flex gap-[20px]">
            <Button
              type="submit"
              className="w-[160px] h-[50px] bg-red-600 text-white text-[17px] font-normal hover:bg-red-800 rounded-full cursor-pointer"
              disabled={!isConfirmChecked}
            >
              Gửi
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-[160px] h-[50px] bg-red-200 text-white text-[17px] font-normal hover:bg-red-400 rounded-full cursor-pointer"
            >
              Hủy
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
