import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "../ui/datepicker";
import { useAuth } from "@/hooks/authen/AuthContext";
import { authenApi } from "@/lib/instance";


type FormData = {
  name: string;
  gender: string;
  birthDate: Date | null;
  phone: string;
  gmail: string;
  bloodType: string;
};

type FormErrors = {
  name: string;
  gender: string;
  birthDate: string;
  phone: string;
  gmail: string;
  bloodType: string;
};

type FormField = keyof FormData;

const AccountEdit = () => {
  const { user, setUser} = useAuth()
  const [hasNotChanged, setHasNotChanged] = useState(true)

  //fetch user 
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await authenApi.get('/api/users/profile')
        const data = response.data

        if (!user)
          return

        if (data.isSuccess) {
          const updatedUser = {
            ...user,
            name: data.data.name,
            phone: data.data.phone,
            gmail: data.data.gmail,
            bloodType: data.data.bloodType,
            dob: new Date(data.data.dob),
            gender: data.data.gender
          };

          setUser(updatedUser);
        } else {
          console.log('Data status is wrong')
        }
      } catch (error) {
        console.log('Failed to fetch user profile ', error)
      }
    }

    getUser()
  }, [user])

  // sync form data
  useEffect(() => {
    setFormData({
      name: user?.name || "",
      gender: user?.gender ? "male" : "female",
      birthDate: user?.dob || null,
      phone: user?.phone || "",
      gmail: user?.gmail || "",
      bloodType: user?.bloodType || ""
    })
    setDefautlFormData(formData)
  }, [user])

  // default form data to compare changes
  const [defaultFormData, setDefautlFormData] = useState<FormData | null>(null)


  const [formData, setFormData] = useState<FormData>({
    name: "",
    gender: "",
    birthDate: null,
    phone: "",
    gmail: "",
    bloodType: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    gender: "",
    birthDate: "",
    phone: "",
    gmail: "",
    bloodType: "",
  });

  // compare form data 
  useEffect(() => {
    if (!defaultFormData) return

    const isEqual = formData.name === defaultFormData.name &&
      formData.gender === defaultFormData.gender &&
      String(formData.birthDate) === String(defaultFormData.birthDate) &&
      formData.phone === defaultFormData.phone &&
      formData.bloodType === defaultFormData.bloodType &&
      formData.gmail === defaultFormData.gmail

    setHasNotChanged(isEqual)
  }, [formData, defaultFormData])

  const FeedbackModal = ({
    isOpen,
    onClose,
    title,
    message,
    type = "info" }: {
      isOpen: boolean;
      onClose: () => void;
      title: string;
      message: string;
      type?: "info" | "success" | "error" | "warning";
      children?: React.ReactNode;
    }) => {
    const typeColors = {
      info: "bg-blue-500",
      success: "bg-green-500",
      error: "bg-red-500",
      warning: "bg-yellow-500",
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`w-16 h-16 rounded-full ${typeColors[type]} flex items-center justify-center mx-auto mb-4`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {type === "success" ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : type === "error" ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
              </div>
              <h3 className="text-lg font-bold text-center mb-2">{title}</h3>
              <p className="text-gray-600 text-center mb-6">{message}</p>
              <div className="flex justify-center">
                <button
                  onClick={onClose}
                  className={`px-6 py-2 ${type === "error" ? "bg-red-500" : type === "success" ? "bg-green-500" : type === "warning" ? "bg-yellow-500" : "bg-blue-500"} text-white rounded-md hover:opacity-90`}
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const bloodTypeOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const validateField = (name: FormField, value: unknown): string => {
    let error = "";

    switch (name) {
      case "name":
        if (typeof value !== "string") {
          error = "Họ và tên phải là chuỗi";
        } else if (!value.trim()) {
          error = "Họ và tên là bắt buộc";
        } else if (value.length < 5) {
          error = "Họ và tên quá ngắn";
        }
        break;
      case "gender":
        if (value !== "male" && value !== "female") {
          error = "Vui lòng chọn giới tính";
        }
        break;
      case "birthDate":
        if (!(value instanceof Date)) {
          error = "Vui lòng chọn ngày sinh";
        } else {
          const today = new Date();
          const birthDate = value;
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 18) error = "Bạn phải từ 18 tuổi trở lên";
        }
        break;
      case "phone":
        if (typeof value !== "string") {
          error = "Số điện thoại phải là chuỗi";
        } else if (!value.trim()) {
          error = "Số điện thoại là bắt buộc";
        } else if (!/^\d{10,11}$/.test(value)) {
          error = "Số điện thoại không hợp lệ";
        }
        break;
      case "gmail":
        if (value && typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "gmail không hợp lệ";
        }
        break;
      case "bloodType":
        if (typeof value !== "string") {
          error = "Nhóm máu phải là chuỗi";
        } else if (!value.trim()) {
          error = "Nhóm máu là bắt buộc";
        }
        break;
      default: {
        const _exhaustiveCheck: never = name;
        return _exhaustiveCheck;
      }
    }

    return error;
  };


  const handleChange = (name: FormField, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Validate on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {} as FormErrors;
    (Object.keys(formData) as FormField[]).forEach((key) => {
      newErrors[key] = validateField(key, formData[key]);
    });

    setErrors(newErrors);

    // Check if there are any errors
    const isValid = Object.values(newErrors).every((error) => !error);

    if (isValid) {
      // Submit form
      console.log("Form submitted:", formData);
      setShowSuccessModal(true);
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
            name="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Họ và tên người dùng"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-[#C14B53]"
              }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
            onChange={(date: Date) => handleChange("birthDate", date)}
            placeholderText="dd/MM/yyyy"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.birthDate ? "border-red-500 focus:ring-red-500" : "focus:ring-[#C14B53]"
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
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.phone ? "border-red-500 focus:ring-red-500" : "focus:ring-[#C14B53]"
              }`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Thêm địa chỉ Gmail</label>
          <input
            type="gmail"
            name="gmail"
            value={formData.gmail}
            onChange={(e) => handleChange("gmail", e.target.value)}
            placeholder="Vd: aboxyz69@gmail.com"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.gmail ? "border-red-500 focus:ring-red-500" : "focus:ring-[#C14B53]"
              }`}
          />
          {errors.gmail && <p className="text-red-500 text-sm mt-1">{errors.gmail}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">
            Nhóm máu <span className="text-red-500">*</span>
          </label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={(e) => handleChange("bloodType", e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.bloodType ? "border-red-500 focus:ring-red-500" : "focus:ring-[#C14B53]"
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
            whileHover={!hasNotChanged ? { scale: 1.02 } : undefined}
            whileTap={!hasNotChanged ? { scale: 0.98 } : undefined}
            className={`px-6 py-2 rounded-md transition cursor-pointer ${hasNotChanged
              ? 'bg-gray-300 text-white cursor-not-allowed'
              : 'bg-[#C14B53] text-white hover:bg-[#a83a42]'
              }`}
            disabled={hasNotChanged}
          >
            Lưu thay đổi
          </motion.button>
        </div>
      </form>

      <FeedbackModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Thành công"
        message="Thông tin đã được cập nhật thành công!"
        type="success"
      />
    </motion.div>
  );
};

export default AccountEdit;