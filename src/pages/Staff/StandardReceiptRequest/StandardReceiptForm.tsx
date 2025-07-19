import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { authenApi } from "@/lib/instance";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/authen/AuthContext";
import { toast } from "react-toastify";

interface StandardReceiptProps {
  onCick: () => void;
}
const formSchema = z.object({
  fullName: z.string().min(1, "Không được để trống"),
  address: z.string().min(1, "Không được để trống"),
  bloodVolume: z.string().min(1, "Vui lòng chọn lượng máu"),
  maxOfDonor: z.coerce
    .number({
      required_error: "Không được để trống",
      invalid_type_error: "Tổng người hiến không phù hợp",
    })
    .min(10, { message: "Tổng người hiến không phù hợp" }),
  donationDate: z.date({
    required_error: "Vui lòng chọn ngày hiến máu",
  }),
  staffName: z.string().min(1, "Không được để trống"),
});

type FormData = z.infer<typeof formSchema>;

const StandardReceiptForm = ({ onCick }: StandardReceiptProps) => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "Hiến máu nhân đạo",
      address: "387 Đ. Lê Văn Việt, Tăng Nhơn Phú A, Thủ Đức, Hồ Chí Minh",
      bloodVolume: "",
      maxOfDonor: 0,
      donationDate: undefined,
      staffName: user?.unique_name,
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form data: ", data);
    try {
      setIsSubmitting(true);
      const payload = {
        title: data.fullName,
        maxOfDonor: data.maxOfDonor,
        estimatedVolume: data.bloodVolume,
        eventTime: data.donationDate.toLocaleDateString("en-CA"),
      };
      console.log(payload);
      const response = await authenApi.post("/api/events", payload);
      if (response.status === 200) {
        console.log("Create event successfully");
        form.reset();
        setDate(undefined);
        toast.success("Tạo sự kiện hiến máu thành công!");
      }
    } catch (error) {
      toast.error("Tạo sự kiện hiến máu thất bại!");
      const err = error as AxiosError;
      if (err.message) console.log("Error message: ", err.message);
      else console.log("Failed to post event ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[800px] mx-auto mt-10 px-8 py-6 bg-white rounded-lg shadow-md border">
      <div className="flex justify-between">
        <h2 className="text-[27px] font-normal mb-6 ">Đơn yêu cầu nhận máu</h2>
        <svg
          onClick={onCick}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5 mt-4 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </div>

      <div className="h-[1px] bg-gray-200 mb-6"></div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[40px]">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="flex justify-between">
                <FormLabel className="text-gray-500 font-normal text-nowrap">
                  Thông tin cơ sở <span className="text-red-600">*</span>
                </FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <FormControl>
                    <Input
                      className="w-[550px] h-[50px]"
                      placeholder="Nhập tên cơ sở y tế"
                      {...field}
                    />
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
              <FormItem className="flex justify-between">
                <FormLabel className="text-gray-500 font-normal text-nowrap">
                  Địa chỉ <span className="text-red55">*</span>
                </FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <FormControl>
                    <Input
                      className="w-[550px] h-[50px]"
                      placeholder="Nhập địa chỉ"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Blood Volume */}
          <div className="flex gap-5">
            <FormField
              control={form.control}
              name="maxOfDonor"
              render={({ field }) => (
                <FormItem className="flex justify-between flex-1">
                  <FormLabel className="text-gray-500 font-normal w-[330px]">
                    Tổng người hiến
                  </FormLabel>
                  <div className="flex flex-col items-start gap-2 w-full">
                    <Input
                      type="number"
                      placeholder="Nhập tổng người hiến"
                      {...field}
                    ></Input>
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
                  <FormLabel className="text-gray-500 font-normal w-[150px]">
                    Lượng máu cần
                  </FormLabel>
                  <div className="flex flex-col items-start gap-2 w-full">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className="h-[50px] w-full">
                        <SelectTrigger>
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

          {/* Donation Date */}
          <FormField
            control={form.control}
            name="donationDate"
            render={({ field }) => (
              <FormItem className="flex justify-between">
                <FormLabel className="text-gray-500 font-normal">
                  Ngày hiến
                </FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[550px] h-[50px] pl-3 text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          {date ? (
                            date.toLocaleDateString()
                          ) : (
                            <span>dd/MM/yyyy</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                          setDate(d ?? undefined);
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

          {/* Staff */}
          <FormField
            control={form.control}
            name="staffName"
            render={({ field }) => (
              <FormItem className="flex justify-between">
                <FormLabel className="text-gray-500 font-normal">
                  Tên / ID nhân viên y tế
                </FormLabel>
                <div className="flex flex-col items-start gap-2">
                  <FormControl>
                    <Input
                      className="w-[550px] h-[50px]"
                      placeholder="Tên hoặc ID của nhân viên y tế thực hiện yêu cầu"
                      {...field}
                    />
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
              className="w-[160px] text-[16px] h-[40px] bg-red-600 text-white hover:bg-red-800 rounded-full cursor-pointer"
            >
              Gửi
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StandardReceiptForm;
