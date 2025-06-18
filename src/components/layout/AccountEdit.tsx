import React, { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "./DatePicker";
import Modal from "./Modal";

type FormData = {
  fullName: string;
  gender: string;
  birthDate: Date | null;
  phone: string;
  email: string;
  bloodType: string;
};

type FormErrors = {
  fullName: string;
  gender: string;
  birthDate: string;
  phone: string;
  email: string;
  bloodType: string;
};

type FormField = keyof FormData;

const AccountEdit = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    gender: "",
    birthDate: null,
    phone: "",
    email: "",
    bloodType: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    fullName: "",
    gender: "",
    birthDate: "",
    phone: "",
    email: "",
    bloodType: "",
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const bloodTypeOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const validateField = (name: FormField, value: any): string => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) error = "Họ và tên là bắt buộc";
        else if (value.length < 5) error = "Họ và tên quá ngắn";
        break;
      case "gender":
        if (!value) error = "Vui lòng chọn giới tính";
        break;
      case "birthDate":
        if (!value) error = "Vui lòng chọn ngày sinh";
        else {
          const today = new Date();
          const birthDate = new Date(value);
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 18) error = "Bạn phải từ 18 tuổi trở lên";
        }
        break;
      case "phone":
        if (!value.trim()) error = "Số điện thoại là bắt buộc";
        else if (!/^\d{10,11}$/.test(value)) error = "Số điện thoại không hợp lệ";
        break;
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Email không hợp lệ";
        }
        break;
      case "bloodType":
        if (!value.trim()) error = "Nhóm máu là bắt buộc";
        break;
      default: {
        const _exhaustiveCheck: never = name;
        return _exhaustiveCheck;
      }
    }

    return error;
  };

  const handleChange = (name: FormField, value: string | Date | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {} as FormErrors;
    (Object.keys(formData) as FormField[]).forEach((key) => {
      newErrors[key] = validateField(key, formData[key]);
    });

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => !error);

    if (isValid) {
      console.log("Form submitted:", formData);
      setIsSuccessModalOpen(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-md shadow-md p-6"
    >
      <h2 className="text-xl font-bold mb-6 text-[#C14B53]">Chỉnh sửa thông tin</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Họ và tên người dùng"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.fullName ? "border-red-500 focus:ring-red-500" : "focus:ring-[#C14B53]"
            }`}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">
            Giới tính <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                checked={formData.gender === "male"}
                onChange={() => handleChange("gender", "male")}
                className="text-[#C14B53] focus:ring-[#C14B53]"
              />
              <span className="ml-2">Nam</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                checked={formData.gender === "female"}
                onChange={() => handleChange("gender", "female")}
                className="text-[#C14B53] focus:ring-[#C14B53]"
              />
              <span className="ml-2">Nữ</span>
            </label>
          </div>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">
            Ngày tháng năm sinh <span className="text-red-500">*</span>
          </label>
          <DatePicker
            value={formData.birthDate}
            onChange={(date: Date | null) => handleChange("birthDate", date)}
            placeholderText="dd/MM/yyyy"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.birthDate ? "border-red-500 focus:ring-red-500" : "focus:ring-[#C14B53]"
            }`}
            maxDate={new Date()}
          />
          {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Số điện thoại người dùng"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.phone ? "border-red-500 focus:ring-red-500" : "focus:ring-[#C14B53]"
            }`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Thêm địa chỉ Gmail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Vd: aboxyz69@gmail.com"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-[#C14B53]"
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">
            Nhóm máu <span className="text-red-500">*</span>
          </label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={(e) => handleChange("bloodType", e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.bloodType ? "border-red-500 focus:ring-red-500" : "focus:ring-[#C14B53]"
            }`}
          >
            <option value="">Chọn nhóm máu</option>
            {bloodTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.bloodType && <p className="text-red-500 text-sm mt-1">{errors.bloodType}</p>}
        </div>

        <div className="pt-4">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#C14B53] text-white px-6 py-2 rounded-md hover:bg-[#a83a42] transition cursor-pointer"
          >
            Lưu thay đổi
          </motion.button>
        </div>
      </form>

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Thành công"
        confirmText="Đóng"
        onConfirm={() => setIsSuccessModalOpen(false)}
      >
        <p>Thông tin đã được cập nhật thành công!</p>
      </Modal>
    </motion.div>
  );
};

export default AccountEdit;