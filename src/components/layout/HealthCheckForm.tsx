import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { scale } from "framer-motion";

interface HealthCheckData {
  fullName: string;
  birthDate: string;
  bloodType: string;
  rhFactor: string;
  height: string;
  weight: string;
  bloodPressure: string;
  temperature: string;
  hasReceivedBloodYes: boolean;
  hasReceivedBloodNo: boolean;
  additionalNotes: string;
  staffId: string;
  processCompleted: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function HealthCheckForm() {
  const [formData, setFormData] = useState<HealthCheckData>({
    fullName: "",
    birthDate: "",
    bloodType: "",
    rhFactor: "",
    height: "",
    weight: "",
    bloodPressure: "",
    temperature: "",
    hasReceivedBloodYes: false,
    hasReceivedBloodNo: false,
    additionalNotes: "",
    staffId: "",
    processCompleted: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, type, value, checked } = e.target;

    // Special handling for hasReceivedBlood checkboxes to keep them exclusive
    if (id === "hasReceivedBloodYes") {
      setFormData({
        ...formData,
        hasReceivedBloodYes: true,
        hasReceivedBloodNo: false,
      });
      return;
    }
    if (id === "hasReceivedBloodNo") {
      setFormData({
        ...formData,
        hasReceivedBloodYes: false,
        hasReceivedBloodNo: true,
      });
      return;
    }
    setFormData({ ...formData, [id]: type === "checkbox" ? checked : value });
  };
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.fullName) newErrors.fullName = "Đây là trường thông tin bắt buộc.";
    if (!formData.birthDate) newErrors.birthDate = "Đây là trường thông tin bắt buộc.";
    if (!formData.height) newErrors.height = "Đây là trường thông tin bắt buộc.";
    if (!formData.weight) newErrors.weight = "Đây là trường thông tin bắt buộc.";
    if (!formData.bloodPressure) newErrors.bloodPressure = "Đây là trường thông tin bắt buộc.";
    if (!formData.temperature) newErrors.temperature = "Đây là trường thông tin bắt buộc.";

    // At least one hasReceivedBlood checkbox should be checked
    if (!formData.hasReceivedBloodYes && !formData.hasReceivedBloodNo) {
      newErrors.hasReceivedBloodYes = "Vui lòng chọn một trong hai.";
    }
    if (!formData.processCompleted) {
      newErrors.processCompleted = "Bạn phải xác nhận hoàn tất quy trình.";
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
        <h1 className="text-2xl font-normal text-black">Đơn đánh giá tình trạng bệnh</h1>
        <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="flex items-center gap-4 mb-[40px]">
          <Label htmlFor="fullName" className="text-base w-1/4">
            Tên người nhận
          </Label>
          <div className="flex-1">
            <Input
              id="fullName"
              placeholder="Nhập tên người nhận"
              className="py-4 text-base bg-[#F4F5F8] border-none"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>
        </div>

        {/* Birth Date */}
        <div className="flex items-center gap-4 mb-[40px]">
          <Label htmlFor="birthDate" className="text-base w-1/4">
            Ngày tháng năm sinh
          </Label>
          <div className="flex-1">
            <Input
              id="birthDate"
              type="date"
              className="py-4 text-base h-[40px] border-none"
              value={formData.birthDate}
              onChange={handleChange}
            />
            {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
          </div>
        </div>

        {/* Blood Type and Rh Factor */}
        <div className="flex items-center gap-4 mb-[40px]">
          <Label htmlFor="bloodType" className="text-base w-1/4">
            Nhóm máu
          </Label>
          <div className="flex-1">
            <select
              id="bloodType"
              className="py-2 pl-4 text-base w-full bg-[#F4F5F8] border-none"
              value={formData.bloodType}
              onChange={handleChange}
            >
              <option value="" disabled>
                Chọn ABO
              </option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </div>
          <Label htmlFor="rhFactor" className="text-base w-1/4">
            Rh Factor
          </Label>
          <div className="flex-1">
            <select
              id="rhFactor"
              className="py-2 pl-4 text-base w-full bg-[#F4F5F8] border-none"
              value={formData.rhFactor}
              onChange={handleChange}
            >
              <option value="" disabled>
                Chọn Rh
              </option>
              <option value="+">+</option>
              <option value="-">-</option>
            </select>
          </div>
        </div>

        {/* Height and Weight */}
        <div className="flex items-center gap-4 mb-[40px]">
          <Label htmlFor="height" className="text-base w-1/4">
            Chiều cao (m) <span className="text-red-500">*</span>
          </Label>
          <div className="flex-1">
            <Input
              id="height"
              type="number"
              step="0.01"
              placeholder="Nhập chiều cao"
              className="py-4 text-base bg-[#F4F5F8] border-none"
              value={formData.height}
              onChange={handleChange}
            />
            {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
          </div>
          <Label htmlFor="weight" className="text-base w-1/4">
            Cân nặng (kg) <span className="text-red-500">*</span>
          </Label>
          <div className="flex-1">
            <Input
              id="weight"
              type="number"
              placeholder="Nhập cân nặng"
              className="py-4 text-base bg-[#F4F5F8] border-none"
              value={formData.weight}
              onChange={handleChange}
            />
            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
          </div>
        </div>

        {/* Blood Pressure and Temperature */}
        <div className="flex items-center gap-4 mb-[40px]">
          <Label htmlFor="bloodPressure" className="text-base w-1/4">
            Huyết áp (mmHg) <span className="text-red-500">*</span>
          </Label>
          <div className="flex-1">
            <Input
              id="bloodPressure"
              placeholder="Nhập huyết áp"
              className="py-4 text-base bg-[#F4F5F8] border-none"
              value={formData.bloodPressure}
              onChange={handleChange}
            />
            {errors.bloodPressure && <p className="text-red-500 text-sm mt-1">{errors.bloodPressure}</p>}
          </div>
          <Label htmlFor="temperature" className="text-base w-1/4">
            Nhiệt độ cơ thể (°C) <span className="text-red-500">*</span>
          </Label>
          <div className="flex-1">
            <Input
              id="temperature"
              type="number"
              step="0.1"
              placeholder="Nhập nhiệt độ"
              className="py-4 text-base bg-[#F4F5F8] border-none"
              value={formData.temperature}
              onChange={handleChange}
            />
            {errors.temperature && <p className="text-red-500 text-sm mt-1">{errors.temperature}</p>}
          </div>
        </div>

        {/* Blood Donation History (radio buttons flex row) */}
        <div className="flex items-center gap-6 mb-[40px]">
          <Label className="text-base w-1/4">
            Được phép truyền máu<span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-row gap-10 flex-1">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="hasReceivedBloodYes"
                name="hasReceivedBlood"
                value="yes"
                checked={formData.hasReceivedBloodYes}
                onChange={handleChange}
                className="w-5 h-5"
                required
              />
              <Label htmlFor="hasReceivedBloodYes" className="text-base">
                Có
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="hasReceivedBloodNo"
                name="hasReceivedBlood"
                value="no"
                checked={formData.hasReceivedBloodNo}
                onChange={handleChange}
                className="w-5 h-5"
                required
              />
              <Label htmlFor="hasReceivedBloodNo" className="text-base">
                Không
              </Label>
            </div>
          </div>
          {errors.hasReceivedBloodYes && (
            <p className="text-red-500 text-sm mt-1 w-full pl-[25%]">{errors.hasReceivedBloodYes}</p>
          )}
        </div>

        {/* Additional Notes - flex column with full width textarea */}
        <div className="flex flex-col gap-2 mb-[40px]">
          <Label htmlFor="additionalNotes" className="text-base w-full">
            Ghi chú
          </Label>
          <textarea
            id="additionalNotes"
            placeholder="(Ghi chú thêm của nhân viên y tế cho bệnh nhân)"
            className="py-2 px-3 text-base bg-[#F4F5F8] w-full h-24 resize-none border-none rounded-md"
            value={formData.additionalNotes}
            onChange={handleChange}
          />
        </div>

        {/* Staff ID */}
        <div className="flex items-center gap-4 mb-[40px]">
          <Label htmlFor="staffId" className="text-base w-1/4">
            Tên / ID nhân viên
          </Label>
          <div className="flex-1">
            <Input
              id="staffId"
              placeholder="Nhập ID nhân viên"
              className="py-4 text-base bg-[#F4F5F8] border-none"
              value={formData.staffId}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Process Completion Confirmation */}
        <div className="space-y-3">
          <label htmlFor="processCompleted" className="flex items-center gap-2 cursor-pointer select-none">
            <input
              id="processCompleted"
              type="checkbox"
              checked={formData.processCompleted}
              onChange={handleChange}
              className="w-5 h-5 "
              required
            />
            <span className="text-base">
              Xác nhận hoàn tất quy trình khám đối với bệnh nhân này<span className="text-red-500">*</span>
            </span>
          </label>
          {errors.processCompleted && <p className="text-red-500 text-sm mt-1">{errors.processCompleted}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            className="px-12 py-2 text-base rounded-full bg-[#BA1B1D] hover:bg-[#A0181A] cursor-pointer"
          >
            Gửi
          </Button>
          <Button
            type="button"
            variant="outline"
            className="px-12 py-2 text-base rounded-full bg-[#FBA3A5] hover:bg-[#E99294] text-white border-[#FBA3A5] cursor-pointer"
          >
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
}
