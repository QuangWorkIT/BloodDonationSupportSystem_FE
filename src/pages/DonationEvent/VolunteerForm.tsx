import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { authenApi } from "@/lib/instance";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/authen/AuthContext";
import { FaInfoCircle } from "react-icons/fa";

interface FormData {
  fullName: string;
  height: string;
  weight: string;
  address: string;
  lastDonation: string;
  availableFrom: string;
  availableTo: string;
  bloodType: string;
  rhFactor: string;
  phone: string;
  email: string;
}

interface FormErrors {
  fullName?: string;
  weight?: string;
  bloodType?: string;
  phone?: string;
  availableTo?: string;
  [key: string]: string | undefined;
}

export default function VolunteerForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    fullName: user?.unique_name || "",
    height: "",
    weight: "",
    address: "",
    lastDonation: "",
    availableFrom: "",
    availableTo: "",
    bloodType: "",
    rhFactor: "",
    phone: user?.phone || "",
    email: user?.gmail || "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error when user types
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Đây là trường thông tin bắt buộc.";
    }

    if (!formData.weight.trim()) {
      newErrors.weight = "Đây là trường thông tin bắt buộc.";
    } else if (parseFloat(formData.weight) < 42) {
      newErrors.weight = "Cân nặng phải từ 42 kg trở lên";
    }

    if (!formData.bloodType) {
      newErrors.bloodType = "Đây là trường thông tin bắt buộc.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Đây là trường thông tin bắt buộc.";
    } else if (!/^(0|\+84)[0-9]{9,10}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (formData.availableFrom && formData.availableTo) {
      const fromDate = new Date(formData.availableFrom);
      const toDate = new Date(formData.availableTo);

      if (fromDate > toDate) {
        newErrors.availableTo = "Ngày kết thúc phải sau ngày bắt đầu";
      }

      const oneYearLater = new Date(fromDate);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      if (toDate > oneYearLater) {
        newErrors.availableTo = "Khoảng thời gian tối đa là 1 năm";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Here you would typically make an API call
      console.log("Form submitted successfully:", formData);
      // Reset form after successful submission
      setFormData({
        fullName: "",
        height: "",
        weight: "",
        address: "",
        lastDonation: "",
        availableFrom: "",
        availableTo: "",
        bloodType: "",
        rhFactor: "",
        phone: "",
        email: "",
      });
      setErrors({});
      const payload = {
        lastDonation: new Date(formData.lastDonation).toISOString(),
        startVolunteerDate: new Date(formData.availableFrom).toISOString(),
        endVolunteerDate: new Date(formData.availableTo).toISOString(),
      };
      const response = await authenApi.post("/api/Volunteers", payload);
      const data = response.data;
      if (data.isSuccess) {
        navigate("/", { replace: true });
        toast.success("Đăng ký tình nguyện viên thành công!");
      }
    } catch (error) {
      toast.error("Đăng ký tình nguyện viên thất bại. Vui lòng thử lại sau.");
      const err = error as AxiosError;
      if (err) console.log("Error volunteer form: ", err);
      else console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 md:mt-6 border rounded-lg shadow-lg p-4 md:p-8 space-y-4 md:space-y-6 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-normal text-black">Đơn đăng ký hiến máu tình nguyện</h1>
        <button className="text-gray-500 hover:text-gray-700 cursor-pointer" aria-label="Đóng form">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Full Name */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4 md:mb-[40px]">
          <Label htmlFor="fullName" className="text-sm md:text-base w-full md:w-1/4">
            Tên người hiến
          </Label>
          <div className="flex-1">
            <Input
              id="fullName"
              placeholder="Nhập họ và tên"
              className="py-2 text-sm md:text-base bg-[#F4F5F8] h-10 md:h-[40px]"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.fullName}</p>}
          </div>
        </div>

        {/* Height and Weight */}
        <div className="flex flex-col md:flex-row gap-4 mb-4 md:mb-[40px]">
          <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <Label htmlFor="height" className="text-sm md:text-base w-full md:w-1/4">
              Chiều cao (m)
            </Label>
            <div className="flex-1">
              <Input
                id="height"
                type="number"
                step="0.01"
                placeholder="Nhập chiều cao"
                className="py-2 text-sm md:text-base bg-[#F4F5F8] h-10 md:h-[40px]"
                value={formData.height}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <Label htmlFor="weight" className="text-sm md:text-base w-full md:w-1/4">
              Cân nặng (kg)<span className="text-red-500"> *</span>
            </Label>
            <div className="flex-1">
              <Input
                id="weight"
                type="number"
                placeholder="Nhập cân nặng"
                className="py-2 text-sm md:text-base bg-[#F4F5F8] h-10 md:h-[40px]"
                value={formData.weight}
                onChange={handleChange}
              />
              {errors.weight && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.weight}</p>}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4 md:mb-[40px]">
          <Label htmlFor="address" className="text-sm md:text-base w-full md:w-1/4">
            Địa chỉ
          </Label>
          <div className="flex-1">
            <Input
              id="address"
              placeholder="Nhập địa chỉ"
              className="py-2 text-sm md:text-base bg-[#F4F5F8] h-10 md:h-[40px]"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Last Donation Date */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4 md:mb-[40px]">
          <Label htmlFor="lastDonation" className="text-sm md:text-base w-full md:w-1/4">
            Lần cuối hiến máu
          </Label>
          <div className="flex-1">
            <Input
              id="lastDonation"
              type="date"
              className="py-2 text-sm md:text-base h-10 md:h-[40px]"
              value={formData.lastDonation}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Available Dates */}
        <div className="space-y-3 mb-4 md:mb-[40px]">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <Label className="text-sm md:text-base w-full md:w-1/4">
              Ngày có thể hiến
              <p className="text-red-500 text-xs md:text-sm">*Tối đa 1 năm</p>
            </Label>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <div className="flex-1">
                  <Label htmlFor="availableFrom" className="text-xs md:text-sm">
                    Từ
                  </Label>
                  <Input
                    id="availableFrom"
                    type="date"
                    className="py-2 text-sm md:text-base h-10 md:h-[40px]"
                    value={formData.availableFrom}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="availableTo" className="text-xs md:text-sm">
                    Đến
                  </Label>
                  <Input
                    id="availableTo"
                    type="date"
                    className="py-2 text-sm md:text-base h-10 md:h-[40px]"
                    value={formData.availableTo}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {errors.availableTo && <p className="text-red-500 text-xs md:text-sm">{errors.availableTo}</p>}
            </div>
          </div>
        </div>

        {/* Blood Type */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4 md:mb-[40px]">
          <Label htmlFor="bloodType" className="text-sm md:text-base w-full md:w-1/4 flex items-center gap-2">
            Nhóm máu<span className="text-red-500"> *</span>
            <span className="relative group">
              <FaInfoCircle className="text-blue-500 cursor-pointer" />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 w-64 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 break-words whitespace-normal">
                Nhóm máu chính xác sẽ được xác nhận bởi nhân viên y tế sau quá trình xét nghiệm máu
              </span>
            </span>
          </Label>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              <div>
                <Input
                  id="bloodType"
                  placeholder="Chọn ABO"
                  list="bloodTypes"
                  className="py-2 text-sm md:text-base w-full bg-[#F4F5F8] h-10 md:h-[40px]"
                  value={formData.bloodType}
                  onChange={handleChange}
                />
                <datalist id="bloodTypes">
                  <option value="A" />
                  <option value="B" />
                  <option value="AB" />
                  <option value="O" />
                </datalist>
                {errors.bloodType && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.bloodType}</p>}
              </div>

              <div>
                <Input
                  id="rhFactor"
                  placeholder="Chọn Rh"
                  list="rhTypes"
                  className="py-2 text-sm md:text-base w-full bg-[#F4F5F8] h-10 md:h-[40px]"
                  value={formData.rhFactor}
                  onChange={handleChange}
                />
                <datalist id="rhTypes">
                  <option value="+" />
                  <option value="-" />
                </datalist>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4 md:mb-[40px]">
          <Label htmlFor="phone" className="text-sm md:text-base w-full md:w-1/4">
            Số điện thoại<span className="text-red-500"> *</span>
          </Label>
          <div className="flex-1">
            <Input
              id="phone"
              type="tel"
              placeholder="Ví dụ: 02xxxxxxxxxx"
              className="py-2 text-sm md:text-base bg-[#F4F5F8] h-10 md:h-[40px]"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <Label htmlFor="email" className="text-sm md:text-base w-full md:w-1/4">
            Email
          </Label>
          <div className="flex-1">
            <Input
              id="email"
              type="email"
              placeholder="Địa chỉ email"
              className="py-2 text-sm md:text-base bg-[#F4F5F8] h-10 md:h-[40px]"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 pt-4 md:pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-4 md:px-8 py-2 text-sm md:text-base rounded-full bg-[#BA1B1D] hover:bg-[#A0181A] cursor-pointer"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="px-4 md:px-8 py-2 text-sm md:text-base rounded-full bg-[#FBA3A5] hover:bg-[#E99294] text-white border-[#FBA3A5] cursor-pointer"
          >
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
}
