import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { getLongLat } from "@/utils/gecoding";
import { getTypeId } from "@/types/BloodCompatibility";
import { formatPhoneOtp } from "@/utils/format";
import { AnimatePresence, motion } from "framer-motion";
export interface FormData {
  lastName: string;
  firstName: string;
  phone: string;
  gmail: string;
  password: string;
  confirmPassword: string;
  bloodType: string;
  rhFactor: string;
  dob: string;
  gender: string;
  province: string;
  district: string;
  address: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    lastName: "",
    firstName: "",
    phone: "",
    gmail: "",
    password: "",
    confirmPassword: "",
    bloodType: "",
    rhFactor: "",
    dob: "",
    gender: "",
    province: "",
    district: "",
    address: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value, name, type } = e.target;
    if (type === "radio" && name) {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.lastName) newErrors.lastName = "Đây là trường thông tin bắt buộc.";
    if (!formData.firstName) newErrors.firstName = "Đây là trường thông tin bắt buộc.";
    if (!formData.phone) newErrors.phone = "Đây là trường thông tin bắt buộc.";
    if (!formData.password) newErrors.password = "Đây là trường thông tin bắt buộc.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Mật khẩu không khớp.";
    if (!formData.bloodType) newErrors.bloodType = "Đây là trường thông tin bắt buộc.";
    if (!formData.dob) newErrors.dob = "Đây là trường thông tin bắt buộc.";
    if (!formData.gender) newErrors.gender = "Đây là trường thông tin bắt buộc.";
    if (!formData.province) newErrors.province = "Đây là trường thông tin bắt buộc.";
    if (!formData.address) newErrors.address = "Đây là trường thông tin bắt buộc.";

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      // reconstruct the form data
      const copyForm = { ...formData } as Record<string, any>;
      const bloodType = formData.bloodType + formData.rhFactor;
      copyForm.bloodType = bloodType;

      delete copyForm.rhFactor;
      delete copyForm.address;
      delete copyForm.district;
      delete copyForm.province;
      delete copyForm.confirmPassword;

      copyForm.phone = formatPhoneOtp(formData.phone)
      copyForm.bloodTypeId = getTypeId(formData.bloodType + formData.rhFactor)
      const address = formData.address + " Quận " + formData.district + " " + formData.province + " Việt Nam"
      try {
        const geoCoding = await getLongLat(address);
        if (geoCoding !== null) {
          console.log("Geocoding register success", geoCoding);
          copyForm.longitude = geoCoding.longitude;
          copyForm.latitude = geoCoding.latitude;
        } else {
          copyForm.longitude = 0;
          copyForm.latitude = 0;
          console.log("Address not found");
        }
      } catch (error) {
        copyForm.longitude = 0;
        copyForm.latitude = 0;
        console.log("Geocoding register failed ", error);
      }
      localStorage.setItem('tempUser', JSON.stringify(copyForm))
      navigate('/otp', { replace: true })
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#F0EFF4]">
      {true && (
        <AnimatePresence>
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: -20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: -10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="max-w-3xl mx-auto md:my-[50px] border rounded-lg shadow-lg p-8 space-y-6 bg-white min-h-[750px]">
              <h1 className="text-3xl font-bold text-center text-red-600 mb-6">ĐĂNG KÍ THÀNH VIÊN</h1>
              <form onSubmit={handleSubmit}>
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="lastName" className="text-base">
                      Họ<span className="text-red-500"> *</span>
                    </Label>
                    <Input id="lastName" placeholder="Nhập họ của bạn" className="py-2 text-base" required value={formData.lastName} onChange={handleChange} />
                    {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="firstName" className="text-base">
                      Tên<span className="text-red-500"> *</span>
                    </Label>
                    <Input id="firstName" placeholder="Nhập tên của bạn" className="py-2 text-base" required value={formData.firstName} onChange={handleChange} />
                    {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-6 py-5">
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-base">
                      Số điện thoại<span className="text-red-500"> *</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      className="py-2 text-base"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && <p className="text-red-500">{errors.phone}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="gmail" className="text-base">
                      Gmail
                    </Label>
                    <Input id="gmail" type="gmail" placeholder="Nhập gmail" className="py-2 text-base" value={formData.gmail} onChange={handleChange} />
                  </div>
                </div>

                {/* Password Row */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-base">
                      Mật khẩu<span className="text-red-500"> *</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Ít nhất 8 kí tự"
                      className="py-2 text-base"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                    {errors.password && <p className="text-red-500">{errors.password}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-base">
                      Xác nhận mật khẩu<span className="text-red-500"> *</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      className="py-2 text-base"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-2 gap-6 pt-5">
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
                  <div className="space-y-3">
                    <Label htmlFor="dob" className="text-base">
                      Ngày tháng năm sinh<span className="text-red-500"> *</span>
                    </Label>
                    <Input id="dob" type="date" className="py-2 text-base" required value={formData.dob} onChange={handleChange} />
                    {errors.dob && <p className="text-red-500">{errors.dob}</p>}
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-3 py-5">
                  <Label className="text-base">
                    Giới tính<span className="text-red-500"> *</span>
                  </Label>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <input
                        id="male"
                        type="radio"
                        name="gender"
                        value="true"
                        className="w-5 h-5"
                        required
                        checked={formData.gender === "true"}
                        onChange={handleChange}
                      />
                      <Label htmlFor="male" className="text-base">
                        Nam
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        id="female"
                        type="radio"
                        name="gender"
                        value="false"
                        className="w-5 h-5"
                        required
                        checked={formData.gender === "false"}
                        onChange={handleChange}
                      />
                      <Label htmlFor="female" className="text-base">
                        Nữ
                      </Label>
                    </div>
                  </div>
                  {errors.gender && <p className="text-red-500">{errors.gender}</p>}
                </div>

                {/* Address Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="province" className="text-base">
                      Tỉnh, thành phố<span className="text-red-500"> *</span>
                    </Label>
                    <Input
                      id="province"
                      placeholder="Chọn tỉnh thành"
                      list="provinces"
                      className="py-2 text-base"
                      value={formData.province}
                      onChange={handleChange}
                    />
                    <datalist id="provinces">
                      <option value="Hà Nội" />
                      <option value="Hồ Chí Minh" />
                      <option value="Đà Nẵng" />
                    </datalist>
                    {errors.province && <p className="text-red-500">{errors.province}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="district" className="text-base">
                      Quận, huyện
                    </Label>
                    <Input
                      id="district"
                      placeholder="Chọn quận huyện"
                      list="districts"
                      className="py-2 text-base"
                      value={formData.district}
                      onChange={handleChange}
                    />
                    <datalist id="districts"></datalist>
                  </div>
                </div>

                {/* Address Detail */}
                <div className="space-y-3">
                  <Label htmlFor="address" className="text-base">
                    Địa chỉ<span className="text-red-500"> *</span>
                  </Label>
                  <Input id="address" placeholder="Số nhà, thôn, xã,..." className="py-2 text-base" required value={formData.address} onChange={handleChange} />
                  {errors.address && <p className="text-red-500">{errors.address}</p>}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full py-6 text-lg bg-red-700 hover:bg-red-800 mt-8 hover: cursor-pointer">
                  Đăng kí
                </Button>
              </form>

              {/* Login Link */}
              <div className="text-center text-base pt-4">
                Bạn đã có tài khoản?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Đăng Nhập
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
