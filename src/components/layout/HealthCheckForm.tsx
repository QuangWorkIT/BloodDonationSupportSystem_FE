import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

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
    
    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Đây là trường thông tin bắt buộc.";
    } else if (formData.fullName.length > 100) {
      newErrors.fullName = "Tên không được vượt quá 100 ký tự.";
    }

    // Birth Date validation
    if (!formData.birthDate) {
      newErrors.birthDate = "Đây là trường thông tin bắt buộc.";
    } else {
      const birthDate = new Date(formData.birthDate);
      const currentDate = new Date();
      
      if (birthDate > currentDate) {
        newErrors.birthDate = "Ngày sinh không thể ở tương lai.";
      } else if (currentDate.getFullYear() - birthDate.getFullYear() > 60) {
        newErrors.birthDate = "Người hiến máu phải dưới 60 tuổi.";
      }
    }

    // Height validation
    if (!formData.height) {
      newErrors.height = "Đây là trường thông tin bắt buộc.";
    } else {
      const height = parseFloat(formData.height);
      if (isNaN(height)) {
        newErrors.height = "Chiều cao phải là số.";
      } else if (height <= 0) {
        newErrors.height = "Chiều cao phải lớn hơn 0.";
      } else if (height > 3) {
        newErrors.height = "Chiều cao không thể vượt quá 3m.";
      } else if (height < 0.5) {
        newErrors.height = "Chiều cao không thể nhỏ hơn 0.5m.";
      }
    }

    // Weight validation
    if (!formData.weight) {
      newErrors.weight = "Đây là trường thông tin bắt buộc.";
    } else {
      const weight = parseFloat(formData.weight);
      if (isNaN(weight)) {
        newErrors.weight = "Cân nặng phải là số.";
      } else if (weight <= 0) {
        newErrors.weight = "Cân nặng phải lớn hơn 0.";
      } else if (weight > 200) {
        newErrors.weight = "Cân nặng không thể vượt quá 200kg.";
      } else if (weight < 2) {
        newErrors.weight = "Cân nặng không thể nhỏ hơn 2kg.";
      }
    }

    // Blood Pressure validation
    if (!formData.bloodPressure) {
      newErrors.bloodPressure = "Đây là trường thông tin bắt buộc.";
    } else {
      // Check for format like "120/80"
      const bpRegex = /^\d{2,3}\/\d{2,3}$/;
      if (!bpRegex.test(formData.bloodPressure)) {
        newErrors.bloodPressure = "Huyết áp phải có định dạng như 120/80.";
      } else {
        const [systolic, diastolic] = formData.bloodPressure.split('/').map(Number);
        if (systolic <= 0 || diastolic <= 0) {
          newErrors.bloodPressure = "Giá trị huyết áp phải dương.";
        } else if (systolic > 300 || diastolic > 200) {
          newErrors.bloodPressure = "Giá trị huyết áp quá cao.";
        } else if (systolic < diastolic) {
          newErrors.bloodPressure = "Huyết áp tâm thu phải cao hơn tâm trương.";
        }
      }
    }

    // Temperature validation
    if (!formData.temperature) {
      newErrors.temperature = "Đây là trường thông tin bắt buộc.";
    } else {
      const temp = parseFloat(formData.temperature);
      if (isNaN(temp)) {
        newErrors.temperature = "Nhiệt độ phải là số.";
      } else if (temp < 25) {
        newErrors.temperature = "Nhiệt độ quá thấp.";
      } else if (temp > 35) {
        newErrors.temperature = "Nhiệt độ quá cao.";
      }
    }

    // Blood donation history validation
    if (!formData.hasReceivedBloodYes && !formData.hasReceivedBloodNo) {
      newErrors.hasReceivedBloodYes = "Vui lòng chọn một trong hai.";
    }

    // Process completion validation
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
      // Here you would typically send the data to your backend
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
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
            />
            {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
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
              min="0.5"
              max="3"
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
              min="2"
              max="300"
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
              placeholder="VD: 120/80"
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
              min="25"
              max="45"
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
            maxLength={500}
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
              className="w-5 h-5"
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