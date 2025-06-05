import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState<FormData>({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
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
      console.log("Password reset successfully:", formData);
      // Here you would typically call an API to reset the password
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
    <div className="w-full max-w-md p-8 mx-auto border rounded-lg shadow-lg bg-white ">
      <h1 className="text-2xl font-bold text-center mb-6">Tạo lại mật khẩu</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password */}
        <div className="space-y-3">
          <Label htmlFor="newPassword" className="text-base">
            Mật khẩu mới<span className="text-red-500"> *</span>
          </Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Nhập mật khẩu mới"
            className="py-2 text-base"
            value={formData.newPassword}
            onChange={handleChange}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-3">
          <Label htmlFor="confirmPassword" className="text-base">
            Xác nhận mật khẩu mới<span className="text-red-500"> *</span>
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            className="py-2 text-base"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="border-t pt-6">
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full py-6 text-lg bg-red-700 hover:bg-red-800 hover:cursor-pointer"
          >
            Xác nhận
          </Button>
        </div>
      </form>
    </div>
    </div>
  );
}