import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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

    // Validate date range (availableFrom must be before availableTo)
    if (formData.availableFrom && formData.availableTo) {
      const fromDate = new Date(formData.availableFrom);
      const toDate = new Date(formData.availableTo);
      if (fromDate > toDate) {
        newErrors.availableTo = "Ngày kết thúc phải sau ngày bắt đầu";
      }
      
      // Validate maximum 1 year difference
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
      // Submit the form or perform further actions
      console.log("Form submitted successfully:", formData);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 border rounded-lg shadow-lg p-8 space-y-6 bg-white">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-6">ĐƠN ĐĂNG KÝ HIẾN MÁU TÌNH NGUYỆN</h1>
      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="space-y-3">
          <Label htmlFor="fullName" className="text-base">
            Họ và tên
          </Label>
          <Input
            id="fullName"
            placeholder="Nhập họ và tên"
            className="py-2 text-base"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
        </div>

        {/* Height and Weight */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="height" className="text-base">
              Chiều cao (m)
            </Label>
            <Input
              id="height"
              type="number"
              step="0.01"
              placeholder="Nhập chiều cao"
              className="py-2 text-base"
              value={formData.height}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="weight" className="text-base">
              Cân nặng (kg)<span className="text-red-500"> *</span>
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder="Nhập cân nặng"
              className="py-2 text-base"
              value={formData.weight}
              onChange={handleChange}
            />
            {errors.weight && <p className="text-red-500">{errors.weight}</p>}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-3">
          <Label htmlFor="address" className="text-base">
            Địa chỉ
          </Label>
          <Input
            id="address"
            placeholder="Nhập địa chỉ"
            className="py-2 text-base"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/* Last Donation Date */}
        <div className="space-y-3">
          <Label htmlFor="lastDonation" className="text-base">
            Lần cuối hiến máu
          </Label>
          <Input
            id="lastDonation"
            type="date"
            className="py-2 text-base"
            value={formData.lastDonation}
            onChange={handleChange}
          />
        </div>

        {/* Available Dates */}
        <div className="space-y-3">
          <Label className="text-base">
            Ngày có thể hiến
          </Label>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="availableFrom" className="text-sm">
                Từ
              </Label>
              <Input
                id="availableFrom"
                type="date"
                className="py-2 text-base"
                value={formData.availableFrom}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableTo" className="text-sm">
                Đến
              </Label>
              <Input
                id="availableTo"
                type="date"
                className="py-2 text-base"
                value={formData.availableTo}
                onChange={handleChange}
              />
              {errors.availableTo && <p className="text-red-500 text-sm">{errors.availableTo}</p>}
            </div>
          </div>
          <p className="text-sm text-gray-500">*Tối đa 1 năm</p>
        </div>

        {/* Blood Type */}
        <div className="space-y-3">
          <Label htmlFor="bloodType" className="text-base">
            Nhóm máu<span className="text-red-500"> *</span>
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                id="bloodType"
                placeholder="Chọn ABO"
                list="bloodTypes"
                className="py-2 text-base w-full"
                value={formData.bloodType}
                onChange={handleChange}
              />
              <datalist id="bloodTypes">
                <option value="A" />
                <option value="B" />
                <option value="AB" />
                <option value="O" />
              </datalist>
              {errors.bloodType && <p className="text-red-500">{errors.bloodType}</p>}
            </div>

            <div>
              <Input
                id="rhFactor"
                placeholder="Chọn Rh"
                list="rhTypes"
                className="py-2 text-base w-full"
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

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="phone" className="text-base">
              Số điện thoại<span className="text-red-500"> *</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Ví dụ: 02xxxxxxxxxx"
              className="py-2 text-base"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="text-base">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Địa chỉ email"
              className="py-2 text-base"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="outline" className="px-6 py-2 text-base">
            Hủy
          </Button>
          <Button type="submit" className="px-6 py-2 text-base bg-red-600 hover:bg-red-700">
            Gửi
          </Button>
        </div>
      </form>
    </div>
  );
}