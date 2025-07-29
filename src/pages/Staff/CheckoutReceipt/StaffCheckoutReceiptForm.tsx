import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Donor } from "@/pages/Staff/BloodCollection/BloodCollectEventList";
import { useAuth } from "@/hooks/authen/AuthContext";
import { authenApi } from "@/lib/instance";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { getBloodTypeRh } from "@/types/BloodCompatibility";
interface StaffCheckoutReceiptFormProps {
  donor: Donor;
  setIsBloodCollectFormOpen: () => void;
  fetchEvents: () => Promise<void>;
}

const formSchema = z.object({
  receiverName: z.string().min(1, "Vui lòng nhập tên người nhận"),
  bloodType: z.string().min(1, "Vui lòng chọn nhóm máu."),
  bloodTypeRh: z.string().min(1, "Vui lòng chọn nhóm máu."),
  volume: z
    .string()
    .refine((val) => /^\d{2,3}$/.test(val), "Lượng máu phải là số hợp lệ (vd: 250)")
    .refine((val) => Number(val) <= 450, "Lượng máu không được vượt quá 450ml."),
  note: z.string().optional(),
  staffId: z.string().min(1, "Vui lòng nhập tên hoặc ID nhân viên y tế"),
  confirm: z.boolean().refine((val) => val === true, {
    message: "Bạn cần xác nhận đã hoàn tất nhận máu",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function StaffCheckoutReceiptForm({
  donor,
  setIsBloodCollectFormOpen,
  fetchEvents,
}: StaffCheckoutReceiptFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiverName: "Bệnh viện Lê Văn Việt",
      bloodType: getBloodTypeRh(donor.bloodTypeName || "").bloodType || "",
      bloodTypeRh: getBloodTypeRh(donor.bloodTypeName || "").rh || "",
      volume: "",
      note: "",
      staffId: user?.unique_name,
      confirm: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const payload = {
      volume: Number(data.volume),
      description: data.note,
    };
    console.log("id " + donor.bloodRegisId + "payload ", payload);
    try {
      setIsSubmitting(true);
      const response = await authenApi.post(
        `/api/blood-registrations/${donor.bloodRegisId}/blood-procedures/collect`,
        payload
      );
      const data = response.data;

      if (data.isSuccess) {
        console.log("Collect blood success");
        toast.success("Hiến máu thành công!");
        await fetchEvents();
        setIsBloodCollectFormOpen();
      }
    } catch (error) {
      toast.error("Gửi đơn thất bại!");
      const err = error as AxiosError;
      if (err) console.log("Fail submit form ", err);
      else console.log("Error submitting ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isConfirmChecked = form.watch("confirm");

  return (
    <div className="bg-gray-50 min-h-screen w-full py-12">
      <div className="w-full max-w-3xl mx-auto px-8 py-8 bg-white rounded-2xl shadow-lg mt-10 mb-10">
        <div className="flex justify-between">
          <h2 className="text-[27px] font-normal mb-6">Đơn xác nhận hoàn tất nhận máu</h2>
          <svg
            onClick={setIsBloodCollectFormOpen}
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
                  <FormLabel className="text-lg text-nowrap">Tên bệnh nhân</FormLabel>
                  <div className="flex flex-col items-start gap-2">
                    <FormControl>
                      <Input placeholder="Nhập tên bệnh nhân" className="w-[550px] h-[50px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Blood type */}
            <div className="flex items-start gap-2 justify-between">
              <FormLabel className="text-lg text-nowrap flex items-center gap-2">
                Nhóm máu
                <span className="relative group">
                  <FaInfoCircle className="text-blue-500 cursor-pointer" />
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 w-64 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 break-words whitespace-normal">
                    Nhóm máu chính xác sẽ được xác nhận bởi nhân viên y tế sau quá trình xét nghiệm máu
                  </span>
                </span>
              </FormLabel>
              <div className="flex gap-25">
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col items-start gap-2">
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
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* Blood volume */}
            <FormField
              control={form.control}
              name="volume"
              render={({ field }) => (
                <FormItem className="flex justify-between text-nowrap">
                  <FormLabel className="text-lg text-nowrap">Lượng máu đã nhận (ml)</FormLabel>
                  <div className="flex flex-col items-start gap-2 w-full max-w-2xl">
                    <FormControl>
                      <Input className="w-full h-[50px] bg-gray-50" placeholder="Vd: 250, 350,..." {...field} />
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
                    <textarea
                      className="w-full h-[130px] p-3 rounded-[10px] border-2 border-gray focus:shadow-lg focus:border-gray-500 transition-all duration-300 ease-in-out"
                      placeholder="(Ghi chú thêm của nhân viên y tế cho bệnh nhân)"
                      {...field}
                    />
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
                      <Input
                        className="w-[550px] h-[50px]"
                        placeholder="(Tên hoặc ID của nhân viên y tế đã được điền)"
                        {...field}
                      />
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
                      <Input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="w-6 h-6"
                      />
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
                className="w-[160px] h-[40px] bg-red-600 text-white text-[17px] font-bold hover:bg-red-800 rounded-full cursor-pointer"
                disabled={!isConfirmChecked || isSubmitting}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi"}
              </Button>
              <Button
                disabled={isSubmitting}
                type="button"
                variant="outline"
                className="w-[160px] h-[40px] bg-red-200 text-white text-[17px] font-bold hover:bg-red-400 rounded-full cursor-pointer"
              >
                Hủy
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
