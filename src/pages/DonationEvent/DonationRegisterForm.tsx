"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
// import BloodTypeSelect, { BloodTypeSelectRh } from "../../components/layout/BloodTypeSelect";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { authenApi } from "@/lib/instance";
import { getBloodTypeRh, type bloodType } from "@/types/BloodCompatibility";
import { useAuth } from "@/hooks/authen/AuthContext";
import AlertBanner from "@/components/layout/AlerBanner";

interface DonationRegistrationProps {
  eventId: number;
  eventTime: string;
  event?: {
    id: number;
    title: string;
    address: string;
    eventTime: string;
    bloodType: string;
    bloodComponent: string;
    bloodRegisCount: number;
    maxOfDonor: number;
    isUrgent: boolean;
    estimateVolume: number;
  } | null;
  setRegistraionFormOpen: (isOpen: boolean) => void;
}

// Define form schema with strong typing
const formSchema = z.object({
  donorName: z
    .string()
    .min(1, { message: "Tên người dùng không được để trống" })
    .max(50, { message: "Tên không hợp lệ" }),

  address: z.string().min(1, { message: "Cần điền địa chỉ" }).max(200, { message: "Địa chỉ không hợp lệ" }),

  lastDonation: z.date({
    required_error: "Cần điền thời gian",
    invalid_type_error: "Thời gian không hợp lệ",
  }),

  donationDate: z.date().optional(),

  bloodType: z.string({ required_error: "Hãy chọn loại máu" }),

  bloodTypeRh: z.string({ required_error: "Hãy chọn loại máu" }),

  phone: z
    .string()
    .nonempty("Cần điền số điện thoại")
    .regex(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/, {
      message: "Số điện thoại không hợp lệ",
    }),

  email: z.string().nonempty("Cần điền email").email({ message: "Email không hợp lệ" }),
});

type FormType = z.infer<typeof formSchema>;

export function DonationRegisterForm({ eventId, eventTime, event, setRegistraionFormOpen }: DonationRegistrationProps) {
  const { user } = useAuth();
  const [currentBloodType, setCurrentBloodType] = useState<bloodType | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [isWarning, setIsWarning] = useState("");
  const navigate = useNavigate();

  // Get user data
  useEffect(() => {
    const getUser = async () => {
      if (!user) {
        setIsWarning("Hãy đăng nhập để tiếp tục!");
        return;
      }

      if (user.phone === null) {
        setIsWarning("Hãy cập nhật thông tin tài khoản để tiếp tục !");
        return;
      }

      setCurrentBloodType({
        bloodType: getBloodTypeRh(user?.bloodType || "").bloodType || "",
        rh: getBloodTypeRh(user?.bloodType || "").rh || "",
      });
      setIsWarning("");
    };

    getUser();
  }, []);

  // Create form with validation
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      donorName: user?.unique_name,
      address: user?.address,
      lastDonation: user?.lastDonation || undefined,
      donationDate: new Date(eventTime),
      bloodType: getBloodTypeRh(user?.bloodType || "").bloodType || "",
      bloodTypeRh: getBloodTypeRh(user?.bloodType || "").rh || "",
      phone: "",
      email: "",
    },
  });

  // Update form with user data when available
  const { reset } = form;
  useEffect(() => {
    if (!user) return;

    reset({
      donorName: user.unique_name,
      phone: user.phone,
      email: user.gmail,
      bloodType: currentBloodType?.bloodType ?? "",
      bloodTypeRh: currentBloodType?.rh ?? "",
      address: user.address,
    });
  }, [user, currentBloodType, reset]);

  // Check if user's blood type is compatible with urgent event
  const isBloodTypeCompatible = () => {
    if (!event?.isUrgent || !currentBloodType || !event.bloodType) {
      return true; // Not urgent or no blood type info, allow registration
    }

    const userBloodType = currentBloodType.bloodType + currentBloodType.rh;
    const eventBloodType = event.bloodType;

    // If event specifies a specific blood type, user must match
    if (eventBloodType && eventBloodType !== "A, B, AB, O") {
      return userBloodType === eventBloodType;
    }

    return true; // Event accepts all blood types
  };

  const getBloodTypeCompatibilityMessage = () => {
    if (!event?.isUrgent || !currentBloodType || !event.bloodType) {
      return null;
    }

    const userBloodType = currentBloodType.bloodType + currentBloodType.rh;
    const eventBloodType = event.bloodType;

    if (eventBloodType && eventBloodType !== "A, B, AB, O") {
      if (userBloodType === eventBloodType) {
        return `✅ Nhóm máu của bạn (${userBloodType}) phù hợp với yêu cầu (${eventBloodType})`;
      } else {
        return `❌ Nhóm máu của bạn ${userBloodType} không phù hợp với yêu cầu (${eventBloodType})`;
      }
    }

    return `✅ Sự kiện chấp nhận tất cả nhóm máu`;
  };

  const onSubmit = async (values: FormType) => {
    // Clear previous errors
    setRegistrationError(null);

    // Check blood type compatibility for urgent events
    if (!isBloodTypeCompatible()) {
      setRegistrationError("Bạn không thể đăng ký sự kiện khẩn cấp này vì nhóm máu không phù hợp.");
      return;
    }

    try {
      setIsRegister(true);
      const response = await authenApi.post(`/api/events/${eventId}/blood-registrations`, {
        lastDonation: values.lastDonation.toISOString().split("T")[0],
      });

      const data = response.data;
      if (data.isSuccess) {
        toast.success("Đăng ký hiến máu thành công!");
      } else {
        setRegistrationError(data.message || "Đăng ký hiến máu thất bại!");
      }
    } catch (error: unknown) {
      console.error("Error register ", error);

      // Extract specific error message from API response
      let errorMessage = "Đăng ký hiến máu thất bại!";

      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string }; status?: number } };
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response?.status === "number" && err.response.status === 400) {
          errorMessage = "Dữ liệu đăng ký không hợp lệ. Vui lòng kiểm tra lại thông tin.";
        } else if (typeof err.response?.status === "number" && err.response.status === 409) {
          errorMessage = "Bạn đã đăng ký sự kiện này rồi.";
        } else if (typeof err.response?.status === "number" && err.response.status === 403) {
          errorMessage = "Bạn không có quyền đăng ký sự kiện này.";
        } else if (typeof err.response?.status === "number" && err.response.status === 404) {
          errorMessage = "Sự kiện không tồn tại hoặc đã bị hủy.";
        } else if (typeof err.response?.status === "number" && err.response.status >= 500) {
          errorMessage = "Lỗi hệ thống. Vui lòng thử lại sau.";
        }
      }

      setRegistrationError(errorMessage);
    } finally {
      setIsRegister(false);
      if (!registrationError) {
        navigate("/home", { replace: true });
      }
    }
  };

  return (
    <div className="">
      {/* warning notification */}
      {isWarning.length > 0 && <AlertBanner warning={isWarning} />}

      <div className="w-full max-w-[650px] mx-auto p-4 md:p-0 border-3 rounded-[10px] bg-white">
        {/* Form header */}
        <div className="mb-6 md:mb-[25px]">
          <div className="flex justify-between items-center my-4 md:my-[25px] px-2 md:px-[20px]">
            <div className="flex gap-2 items-center">
              <h1 className="text-xl md:text-[28px] font-semibold">Đơn đăng ký hiến máu</h1>
              <Tooltip>
                <TooltipTrigger>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.0003 18.3334C14.6027 18.3334 18.3337 14.6025 18.3337 10.0001C18.3337 5.39771 14.6027 1.66675 10.0003 1.66675C5.39795 1.66675 1.66699 5.39771 1.66699 10.0001C1.66699 14.6025 5.39795 18.3334 10.0003 18.3334Z"
                      stroke="black"
                      stroke-width="1.5"
                    />
                    <path
                      d="M8.4375 7.39603C8.43754 7.1224 8.50943 6.85357 8.64599 6.61645C8.78255 6.37933 8.97899 6.18223 9.21565 6.04487C9.45231 5.90751 9.72089 5.83471 9.99452 5.83375C10.2682 5.83279 10.5372 5.90371 10.7749 6.0394C11.0125 6.1751 11.2103 6.37082 11.3485 6.60698C11.4867 6.84313 11.5605 7.11145 11.5625 7.38508C11.5644 7.6587 11.4945 7.92804 11.3596 8.16615C11.2248 8.40426 11.0298 8.60279 10.7942 8.74186C10.3983 8.97603 10 9.33186 10 9.79186V10.8335"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <path
                      d="M10.0003 14.1667C10.4606 14.1667 10.8337 13.7936 10.8337 13.3333C10.8337 12.8731 10.4606 12.5 10.0003 12.5C9.54009 12.5 9.16699 12.8731 9.16699 13.3333C9.16699 13.7936 9.54009 14.1667 10.0003 14.1667Z"
                      fill="black"
                    />
                  </svg>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-200">
                  <p className="text-black">Thông tin cá nhân sẽ được cập nhật sau khi hiến máu</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <button
              onClick={() => setRegistraionFormOpen(false)}
              className="hover:cursor-pointer text-gray-500 hover:text-gray-700"
              aria-label="Close form"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.5843 1.02432C11.6968 0.911789 11.7601 0.759169 11.7601 0.600031C11.7601 0.440893 11.6968 0.288272 11.5843 0.175745C11.4718 0.0632173 11.3192 0 11.16 0C11.0009 0 10.8483 0.0632173 10.7357 0.175745L5.88003 5.03146L1.02432 0.175745C0.911789 0.0632173 0.759169 1.15868e-08 0.600031 1.27724e-08C0.440893 1.39581e-08 0.288272 0.0632173 0.175745 0.175745C0.0632173 0.288272 1.39581e-08 0.440893 1.27724e-08 0.600031C1.15868e-08 0.759169 0.0632173 0.911789 0.175745 1.02432L5.03146 5.88003L0.175745 10.7357C0.0632173 10.8483 0 11.0009 0 11.16C0 11.3192 0.0632173 11.4718 0.175745 11.5843C0.288272 11.6968 0.440893 11.7601 0.600031 11.7601C0.759169 11.7601 0.911789 11.6968 1.02432 11.5843L5.88003 6.7286L10.7357 11.5843C10.8483 11.6968 11.0009 11.7601 11.16 11.7601C11.3192 11.7601 11.4718 11.6968 11.5843 11.5843C11.6968 11.4718 11.7601 11.3192 11.7601 11.16C11.7601 11.0009 11.6968 10.8483 11.5843 10.7357L6.7286 5.88003L11.5843 1.02432Z"
                  fill="#848385"
                />
              </svg>
            </button>
          </div>
          <hr className="w-full bg-[#E6E9EC]" />
        </div>

        {/* Form content */}
        <Form {...form}>
          <form className="px-2 md:px-[20px]" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Blood Type Compatibility Warning for Urgent Events */}
            {event?.isUrgent && currentBloodType && (
              <div className="mb-4 p-3 rounded-lg border-l-4 bg-blue-50 border-blue-400">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Sự kiện khẩn cấp - Yêu cầu nhóm máu cụ thể</h3>
                    <div className="mt-1 text-sm text-blue-700">{getBloodTypeCompatibilityMessage()}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Error Display */}
            {registrationError && (
              <div className="mb-4 p-3 rounded-lg border-l-4 bg-red-50 border-red-400">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Lỗi đăng ký</h3>
                    <div className="mt-1 text-sm text-red-700">{registrationError}</div>
                  </div>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="donorName"
              render={({ field }) => (
                <FormItem className="flex flex-col md:flex-row mb-4 md:mb-5">
                  <FormLabel className="w-full md:w-[150px] text-base md:text-[16px] mb-1 md:mb-0 whitespace-nowrap">
                    Tên người hiến
                  </FormLabel>
                  <div className="flex-1">
                    <FormControl>
                      <Input placeholder="Họ và tên" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex flex-col md:flex-row mb-4 md:mb-5">
                  <FormLabel className="w-full md:w-[150px] text-base md:text-[16px] mb-1 md:mb-0 whitespace-nowrap">
                    Địa chỉ
                  </FormLabel>
                  <div className="flex-1">
                    <FormControl>
                      <textarea
                        {...field}
                        placeholder="Nhập địa chỉ"
                        rows={2}
                        className="w-full border-2 border-gray-200 rounded-lg p-2 resize-none shadow-sm focus:shadow-lg focus:border-primary-500 transition-all duration-300 ease-in-out"
                      />
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
                <FormItem className="flex flex-col md:flex-row mb-4 md:mb-5">
                  <FormLabel className="w-full md:w-[150px] text-base md:text-[16px] mb-1 md:mb-0 whitespace-nowrap">
                    Lần cuối hiến máu
                  </FormLabel>
                  <div className="flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className="shadow-sm font-semibold w-full">
                            {field.value ? format(field.value, "PPP", { locale: vi }) : <span>mm/dd/yyyy</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-75" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date: Date) => date > new Date() || date < new Date("2000-01-01")}
                        />
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
                <FormItem className="flex flex-col md:flex-row mb-4 md:mb-5">
                  <FormLabel className="w-full md:w-[150px] text-base md:text-[16px] mb-1 md:mb-0 whitespace-nowrap">
                    Ngày hiến
                  </FormLabel>
                  <div className="flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className="w-full shadow-sm font-semibold cursor-not-allowed">
                            {format(new Date(field.value ?? ""), "PPP", { locale: vi })}
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
                            return date >= new Date() || date < new Date();
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* <div className="flex flex-col md:flex-row mb-4 md:mb-5">
              <FormLabel className="w-full md:w-[155px] text-base md:text-[16px] mb-1 md:mb-0 whitespace-nowrap">
                Nhóm máu
              </FormLabel>
              <div className="flex flex-col md:flex-row flex-1 gap-4 md:gap-5">
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <BloodTypeSelect onValueChange={field.onChange} defaultVal={field.value} disabled={true} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bloodTypeRh"
                  render={({ field }) => (
                    <FormItem className="flex-1 font-bold">
                      <FormControl>
                        <BloodTypeSelectRh onValueChange={field.onChange} defaultVal={field.value} disabled={true} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div> */}

            {/* Submit Button */}
            <div className="flex justify-end gap-4 my-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRegistraionFormOpen(false)}
                className="px-6 py-2"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isRegister || !isBloodTypeCompatible() || isWarning.length > 0}
                className={`px-6 py-2 ${
                  !isBloodTypeCompatible() ? "bg-gray-400 cursor-not-allowed" : "bg-[#C14B53] hover:bg-[#a83a42]"
                }`}
              >
                {isRegister ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Đang đăng ký...
                  </div>
                ) : !isBloodTypeCompatible() ? (
                  "Nhóm máu không phù hợp"
                ) : (
                  "Đăng ký hiến máu"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default DonationRegisterForm;
