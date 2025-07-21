import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, ArrowLeft, HeartPulse, Thermometer, Ruler, Weight, Info } from "lucide-react";
import type { DonorCardProps } from "@/pages/Staff/ManageReceipt/DonorCard";
import { useAuth } from "@/hooks/authen/AuthContext";
import { authenApi } from "@/lib/instance";
import { toast } from "react-toastify";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Checkbox } from "@/components/ui/checkbox";

interface HealthCheckData {
  fullName: string;
  birthDate: string;
  height: string;
  weight: string;
  bloodPressure: string;
  temperature: string;
  hbv: 'yes' | 'no' | null;
  hb: string;
  hasReceivedBlood: 'yes' | 'no' | null;
  additionalNotes: string;
  staffId: string;
  processCompleted: boolean;
}
interface HealthCheckoutProps {
  currentDonor: DonorCardProps;
  handleCancel: () => void;
  refetchDonors: () => void;
}
interface FormErrors {
  [key: string]: string;
}

export default function HealthCheckForm({ currentDonor, handleCancel, refetchDonors }: HealthCheckoutProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<HealthCheckData>({
    fullName: currentDonor?.memberName || "",
    birthDate: currentDonor?.dob || "",
    height: "",
    weight: "",
    bloodPressure: "",
    temperature: "",
    hbv: null,
    hb: "",
    hasReceivedBlood: null,
    additionalNotes: "",
    staffId: user?.unique_name || "",
    processCompleted: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Đây là trường thông tin bắt buộc.";
    if (!formData.birthDate) newErrors.birthDate = "Đây là trường thông tin bắt buộc.";
    if (!formData.height) newErrors.height = "Đây là trường thông tin bắt buộc.";
    if (!formData.weight) newErrors.weight = "Đây là trường thông tin bắt buộc.";
    if (!formData.bloodPressure) newErrors.bloodPressure = "Đây là trường thông tin bắt buộc.";
    if (!formData.temperature) newErrors.temperature = "Đây là trường thông tin bắt buộc.";
    if (!formData.hb) newErrors.hb = "Đây là trường thông tin bắt buộc.";
    if (formData.hbv === null) newErrors.hbv = "Vui lòng chọn một tùy chọn.";
    if (formData.hasReceivedBlood === null) newErrors.hasReceivedBlood = "Vui lòng chọn một tùy chọn.";
    if (!formData.processCompleted) newErrors.processCompleted = "Bạn phải xác nhận hoàn tất quy trình.";
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
      setErrors({});
    setIsSubmitting(true);
    
      const pressure = formData.bloodPressure.split("/");
      const payload = {
        systolic: Number(pressure[0]),
        diastolic: Number(pressure[1]),
      temperature: Number(formData.temperature),
        hb: Number(formData.hb),
      hbv: formData.hbv === 'no',
        weight: Number(formData.weight),
        height: Number(formData.height),
      isHealth: formData.hasReceivedBlood === 'yes',
        description: formData.additionalNotes,
      };

      try {
      const response = await authenApi.post(`/api/blood-registrations/${currentDonor?.id}/health-procedures`, payload);
        if (response.status === 200) {
          toast.success("Đã khám sức khỏe thành công!");
        handleCancel();
          refetchDonors();
        }
      } catch (error) {
        toast.error("Gửi đơn thất bại!");
      } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
            <Button variant="ghost" onClick={handleCancel} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách
            </Button>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Phiếu khám sức khỏe</h1>
            <p className="text-gray-500 mt-1">Điền thông tin khám cho tình nguyện viên: <span className="font-semibold">{currentDonor.memberName}</span></p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Basic Info */}
                <div className="md:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Thông tin cơ bản</h2>
      </div>
                <div>
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input id="fullName" value={formData.fullName} disabled className="mt-1"/>
          </div>
                <div>
                    <Label htmlFor="birthDate">Ngày sinh</Label>
                    <Input id="birthDate" type="date" value={formData.birthDate} disabled className="mt-1"/>
        </div>

                {/* Vitals */}
                <div className="md:col-span-2 mt-4">
                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Chỉ số sức khỏe</h2>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <Label htmlFor="height">Chiều cao (m)</Label>
                        <Input id="height" type="number" step="0.01" placeholder="VD: 1.70" value={formData.height} onChange={handleChange} className="mt-1"/>
                        {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
          </div>
                     <div>
                        <Label htmlFor="weight">Cân nặng (kg)</Label>
                        <Input id="weight" type="number" placeholder="VD: 65" value={formData.weight} onChange={handleChange} className="mt-1"/>
                        {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
        </div>
                     <div>
                        <Label htmlFor="bloodPressure">Huyết áp (mmHg)</Label>
                        <Input id="bloodPressure" placeholder="VD: 120/80" value={formData.bloodPressure} onChange={handleChange} className="mt-1"/>
                        {errors.bloodPressure && <p className="text-red-500 text-sm mt-1">{errors.bloodPressure}</p>}
          </div>
                     <div>
                        <Label htmlFor="temperature">Nhiệt độ (°C)</Label>
                        <Input id="temperature" type="number" step="0.1" placeholder="VD: 37.0" value={formData.temperature} onChange={handleChange} className="mt-1"/>
                        {errors.temperature && <p className="text-red-500 text-sm mt-1">{errors.temperature}</p>}
          </div>
        </div>
                <div>
                    <Label htmlFor="hb">Hemoglobin (g/dL)</Label>
                    <Input id="hb" type="number" step="0.1" placeholder="VD: 13.5" value={formData.hb} onChange={handleChange} className="mt-1"/>
                    {errors.hb && <p className="text-red-500 text-sm mt-1">{errors.hb}</p>}
          </div>

                {/* Health Questions */}
                <div className="md:col-span-2 mt-4">
                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Câu hỏi sức khỏe</h2>
          </div>
                <div>
                    <Label>Đã từng bị viêm gan B chưa?</Label>
                    <RadioGroup onValueChange={(v) => setFormData({...formData, hbv: v as any})} className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="hbvNo" /><Label htmlFor="hbvNo">Chưa</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="hbvYes" /><Label htmlFor="hbvYes">Rồi</Label></div>
                    </RadioGroup>
                    {errors.hbv && <p className="text-red-500 text-sm mt-1">{errors.hbv}</p>}
        </div>
                <div>
                    <Label>Đủ điều kiện hiến máu không?</Label>
                    <RadioGroup onValueChange={(v) => setFormData({...formData, hasReceivedBlood: v as any})} className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="allowYes" /><Label htmlFor="allowYes">Đủ điều kiện</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="allowNo" /><Label htmlFor="allowNo">Không đủ điều kiện</Label></div>
                    </RadioGroup>
                    {errors.hasReceivedBlood && <p className="text-red-500 text-sm mt-1">{errors.hasReceivedBlood}</p>}
              </div>
                <div className="md:col-span-2">
                    <Label htmlFor="additionalNotes">Ghi chú thêm</Label>
                    <textarea id="additionalNotes" value={formData.additionalNotes} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C14B53]" placeholder="Ghi chú của nhân viên y tế (nếu có)..." rows={4} />
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
                <div className="flex items-start space-x-3">
                    <Checkbox id="processCompleted" checked={formData.processCompleted} onCheckedChange={(c) => setFormData({...formData, processCompleted: !!c})} />
                    <div className="grid gap-1.5 leading-none">
                        <label htmlFor="processCompleted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Xác nhận hoàn tất quy trình khám
                        </label>
                        <p className="text-xs text-muted-foreground">
                           Bằng việc chọn, bạn xác nhận đã hoàn thành khám cho tình nguyện viên này.
                        </p>
          </div>
        </div>
                {errors.processCompleted && <p className="text-red-500 text-sm mt-1">{errors.processCompleted}</p>}

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>Hủy</Button>
                    <Button type="submit" disabled={!formData.processCompleted || isSubmitting}>
                        {isSubmitting ? "Đang gửi..." : "Gửi kết quả"}
                    </Button>
        </div>
            </div>
        </form>
        </div>
    </div>
  );
}
