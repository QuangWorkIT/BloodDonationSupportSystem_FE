import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

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
  [key: string]: string;
}

export default function VolunteerForm() {
  const [formData, setFormData] = useState<FormData>({
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

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.fullName) newErrors.fullName = "Đây là trường thông tin bắt buộc.";
    if (!formData.weight) newErrors.weight = "Đây là trường thông tin bắt buộc.";
    if (!formData.bloodType) newErrors.bloodType = "Đây là trường thông tin bắt buộc.";
    if (!formData.phone) newErrors.phone = "Đây là trường thông tin bắt buộc.";

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      console.log("Form submitted successfully:", formData);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 border rounded-lg shadow-lg p-8 space-y-6 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-normal text-black">Đơn đăng ký hiến máu tình nguyện</h1>
        <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="flex items-center gap-4 mb-[40px]">
          <Label htmlFor="fullName" className="text-base w-1/4">
            Tên người hiến
          </Label>
          <div className="flex-1">
            <Input
              id="fullName"
              placeholder="Nhập họ và tên"
              className="py-2 text-base bg-[#F4F5F8] h-[40px]"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>
        </div>

        {/* Height and Weight */}
        <div className="flex items-center gap-4 mb-[40px]">
          <Label htmlFor="height" className="text-base w-1/4">
            Chiều cao (m)
          </Label>
          <div className="flex-1">
            <Input
              id="height"
              type="number"
              step="0.01"
              placeholder="Nhập chiều cao"
              className="py-2 text-base bg-[#F4F5F8]"
              value={formData.height}
              onChange={handleChange}
            />
          </div>
          <Label htmlFor="weight" className="text-base w-1/4">
            Cân nặng (kg)<span className="text-red-500"> *</span>
          </Label>
          <div className="flex-1">
            <Input
              id="weight"
              type="number"
              placeholder="Nhập cân nặng"
              className="py-2 text-base bg-[#F4F5F8]"
              value={formData.weight}
              onChange={handleChange}
            />
            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-4 mb-[40px]">
          <Label htmlFor="address" className="text-base w-1/4">
            Địa chỉ
          </Label>
          <div className="flex-1">
            <Input
              id="address"
              placeholder="Nhập địa chỉ"
              className="py-2 text-base bg-[#F4F5F8] h-[40px]"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Last Donation Date */}
        <div className="flex items-center gap-4 mb-[40px]">
          <Label htmlFor="lastDonation" className="text-base w-1/4 flex-col items-start justify-start">
            Lần cuối hiến máu
          </Label>
          <div className="flex-1">
            <Input
              id="lastDonation"
              type="date"
              className="py-2 text-base h-[40px]"
              value={formData.lastDonation}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Available Dates */}
        <div className="space-y-3 mb-[40px]">
          <div className="flex items-center gap-4">
            <Label className="text-base w-1/4  flex-col items-start justify-start">
              Ngày có thể hiến
              <p className="text-red-500 text-sm">*Tối đa 1 năm</p>
            </Label>
            <div className="flex-1 space-y-2">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="availableFrom" className="text-sm">
                    Từ
                  </Label>
                  <Input
                    id="availableFrom"
                    type="date"
                    className="py-2 text-base h-[40px]"
                    value={formData.availableFrom}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="availableTo" className="text-sm">
                    Đến
                  </Label>
                  <Input
                    id="availableTo"
                    type="date"
                    className="py-2 text-base h-[40px]"
                    value={formData.availableTo}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {errors.availableTo && <p className="text-red-500 text-sm">{errors.availableTo}</p>}

            </div>
          </div>
        </div>

        {/* Blood Type */}
        <div className="flex items-center gap-4 mb-[40px]">
          <Label htmlFor="bloodType" className="text-base w-1/4">
            Nhóm máu<span className="text-red-500"> *</span>
          </Label>
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  id="bloodType"
                  placeholder="Chọn ABO"
                  list="bloodTypes"
                  className="py-2 text-base w-full bg-[#F4F5F8]"
                  value={formData.bloodType}
                  onChange={handleChange}
                />
                <datalist id="bloodTypes">
                  <option value="A" />
                  <option value="B" />
                  <option value="AB" />
                  <option value="O" />
                </datalist>
                {errors.bloodType && <p className="text-red-500 text-sm mt-1">{errors.bloodType}</p>}
              </div>

              <div>
                <Input
                  id="rhFactor"
                  placeholder="Chọn Rh"
                  list="rhTypes"
                  className="py-2 text-base w-full bg-[#F4F5F8]"
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
        <div className="flex items-center gap-4 mb-[40px]">
          <Label htmlFor="phone" className="text-base w-1/4">
            Số điện thoại<span className="text-red-500"> *</span>
          </Label>
          <div className="flex-1">
            <Input
              id="phone"
              type="tel"
              placeholder="Ví dụ: 02xxxxxxxxxx"
              className="py-2 text-base bg-[#F4F5F8] h-[40px]"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Label htmlFor="email" className="text-base w-1/4">
            Email
          </Label>
          <div className="flex-1">
            <Input
              id="email"
              type="email"
              placeholder="Địa chỉ email"
              className="py-2 text-base bg-[#F4F5F8] h-[40px]"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            className="px-8 py-2 text-base rounded-full bg-[#BA1B1D] hover:bg-[#A0181A] cursor-pointer"
          >
            Gửi
          </Button>
          <Button
            type="button"
            variant="outline"
            className="px-8 py-2 text-base rounded-full bg-[#FBA3A5] hover:bg-[#E99294] text-white border-[#FBA3A5] cursor-pointer"
          >
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
}
