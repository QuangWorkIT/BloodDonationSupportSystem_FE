import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import api from "@/lib/instance";

interface FormData {
  phone: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ResetPasswordForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    phone: "",
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

    if (!formData.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại đã đăng ký";
    }

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await api.put("/api/auth/reset-password", {
        phone: formData.phone,
        newPassword: formData.newPassword,
      });

      if (response.data?.isSuccess) {
        toast.success("Mật khẩu đã được đặt lại thành công!");
        navigate("/login", { replace: true });
      } else {
        toast.error(response.data?.message || "Không thể đặt lại mật khẩu.");
      }
    } catch (e) {
      console.error("Error resetting password:", e);
      toast.error("Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="relative h-screen flex items-center bg-[#F0EFF4] max-sm:bg-white overflow-hidden">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: -20, y: 100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -20, y: 10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="hidden md:block  w-[430px] h-[393px] bg-[#d94545] absolute top-[-150px] left-[-150px]"
          style={{ borderRadius: "38% 62% 50% 50% / 58% 61% 39% 42%" }}
        ></motion.div>
      </AnimatePresence>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: -20, y: -100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -20, y: 10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="hidden md:block w-[430px] h-[393px] bg-[#d94545] absolute bottom-[-120px] right-[-150px]"
          style={{ borderRadius: "38% 62% 50% 50% / 58% 61% 39% 42%" }}
        ></motion.div>
      </AnimatePresence>

      {true && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: -20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: -10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full"
          >
            <div className="w-full max-w-md p-8 mx-auto border rounded-lg shadow-lg bg-white ">
              <h1 className="text-2xl font-semibold text-red-600 text-center mb-6">
                Tạo lại mật khẩu
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base">
                    Số điện thoại<span className="text-red-500"> *</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Nhập số điện thoại đã đăng ký"
                    className="py-2 text-base"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-base">
                    Xác nhận mật khẩu mới
                    <span className="text-red-500"> *</span>
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
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="text-center text-base pt-2">
                  Bạn đã có tài khoản?{" "}
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Đăng nhập
                  </Link>
                </div>

                <div className="border-t pt-2">
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
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
