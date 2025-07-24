import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "../ui/datepicker";
import { useAuth } from "@/hooks/authen/AuthContext";
import { authenApi } from "@/lib/instance";
import { FaUser, FaVenusMars, FaBirthdayCake, FaPhone, FaEnvelope, FaTint, FaHome, FaBuilding } from "react-icons/fa";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { getUserByToken } from "@/utils/permisson";
import LoadingSpinner from "./Spinner";
import { extractAddress, getLongLat } from "@/utils/gecoding";
import { getTypeId } from "@/types/BloodCompatibility";
import { Button } from "../ui/button";


type FormData = {
  name: string;
  gender: boolean; // Use boolean
  birthDate: Date | null;
  phone: string;
  gmail: string;
  bloodType: string;
  province: string,
  district: string,
  address: string
};

type FormErrors = {
  name: string;
  gender: string;
  birthDate: string;
  phone: string;
  gmail: string;
  bloodType: string;
  province: string;
  district: string;
  address: string
};

interface UpdateBody {
  firstName: string,
  lastName: string,
  phone: string,
  gmail: string,
  longitude: number,
  latitude: number,
  bloodTypeId: number,
  dob: string,
  gender: boolean,
  password: string
}
type FormField = keyof FormData;

const AccountEdit = () => {
  const { user, setUser } = useAuth()
  const [hasNotChanged, setHasNotChanged] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const extracted = extractAddress(user?.address || "")
  // --- useEffect for initial form data from user ---
  useEffect(() => {

    setFormData({
      name: user?.unique_name || "",
      gender: user?.gender || false,
      birthDate: user?.dob || null,
      phone: user?.phone || "",
      gmail: user?.gmail || "",
      bloodType: user?.bloodType || "",
      address: extracted?.address || "",
      district: extracted?.district || "",
      province: extracted?.province || "",
    });

    setDefautlFormData(formData);
  }, [user]);

  // default form data to compare changes
  const [defaultFormData, setDefautlFormData] = useState<FormData | null>(null)

  const [formData, setFormData] = useState<FormData>({
    name: user?.unique_name || "",
    gender: user?.gender || false,
    birthDate: user?.dob || null,
    phone: user?.phone || "",
    gmail: user?.gmail || "",
    bloodType: user?.bloodType || "",
    address: extracted?.address || "",
    district: extracted?.district || "",
    province: extracted?.province || "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    gender: "",
    birthDate: "",
    phone: "",
    gmail: "",
    bloodType: "",
    address: "",
    district: "",
    province: "",
  });

  // compare form data 
  useEffect(() => {
    if (!defaultFormData) return

    const isEqual = formData.name === defaultFormData.name &&
      formData.gender === defaultFormData.gender &&
      String(formData.birthDate) === String(defaultFormData.birthDate) &&
      formData.phone === defaultFormData.phone &&
      formData.bloodType === defaultFormData.bloodType &&
      formData.gmail === defaultFormData.gmail &&
      formData.address === defaultFormData.address &&
      formData.district === formData.district &&
      formData.province === defaultFormData.province

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
                  className={`px-6 py-2 ${type === "error"
                    ? "bg-red-500"
                    : type === "success"
                      ? "bg-green-500"
                      : type === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    } text-white rounded-md hover:opacity-90`}
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
        if (typeof value !== "boolean") {
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
      case "province":
        if (typeof value !== "string") {
          error = "Tỉnh, thành phố là chuỗi";
        } else if (!value.trim()) {
          error = "Thông tin bắt buộc";
        }
        break;
      case "district":
        if (typeof value !== "string") {
          error = "Quận, huyện phải là chuỗi";
        } else if (!value.trim()) {
          error = "Thông tin bắt buộc";
        }
        break;
      case "address":
        if (typeof value !== "string") {
          error = "Địa chỉ phải là chuỗi";
        } else if (!value.trim()) {
          error = "Thông tin bắt buộc";
        }
        break;
    }

    return error;
  };


  const handleChange = (name: FormField, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Validate on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const updateGoogleProfile = async (body: UpdateBody) => {
    try {
      setIsLoading(true)
      console.log('Submitting form google with data:', body);
      const endpoint = '/api/google-update-login';
      const response = await authenApi.put(
        endpoint,
        body,
      );
      if (response.data.token) {
        const token = localStorage.getItem('token')
        if (!token) {
          console.log('Error token')
          toast.error('Phiên đã hết hạn')
          return
        }
        const refetchUser = await getUserByToken(token)
        if (refetchUser) {
          setShowSuccessModal(true);
          setUser(refetchUser)
        } else {
          toast.error('Lỗi tải thông tin')
        }
      } else {
        toast.error(response.data.message || 'Cập nhật thông tin thất bại!')
      }
    } catch (error) {
      toast.error('Cập nhật thông tin thất bại!');
      const err = error as AxiosError
      if (err) console.log('Error updating profile:', err);
      else console.log('Error updating profile:', error);
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (body: UpdateBody) => {
    try {
      setIsLoading(true)
      console.log('Submitting form with data:', body);
      const endpoint = '/api/users/profile';
      const response = await authenApi.put(
        endpoint,
        body,
      );
      if (response.data.isSuccess) {
        const token = localStorage.getItem('token')
        if (!token) {
          console.log('Error token')
          toast.error('Phiên đã hết hạn')
          return
        }
        const refetchUser = await getUserByToken(token)
        if (refetchUser) {
          setShowSuccessModal(true);
          setUser(refetchUser)
        } else {
          toast.error('Lỗi tải thông tin')
        }
      } else {
        toast.error(response.data.message || 'Cập nhật thông tin thất bại!')
      }
    } catch (error) {
      toast.error('Cập nhật thông tin thất bại!');
      const err = error as AxiosError
      if (err) console.log('Error updating profile:', err);
      else console.log('Error updating profile:', error);
    } finally {
      setIsLoading(false)
    }
  }

  const extractName = (fullName: string) => {
    return {
      firtName: fullName.trim().split(' ').slice(1).join(' ') || "",
      lastName: fullName.trim().split(' ')[0] || ""
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
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
      setIsLoading(true)
      const getLonLat = await getLongLat(formData.address + " " + formData.district + " " + formData.province + " Việt Nam")
      const body = {
        firstName: extractName(formData.name).firtName,
        lastName: extractName(formData.name).lastName,
        phone: formData.phone,
        gmail: formData.gmail,
        longitude: getLonLat?.longitude || 0,
        latitude: getLonLat?.latitude || 0,
        bloodTypeId: getTypeId(formData.bloodType),
        dob: formData.birthDate ? formData.birthDate.toISOString().split('T')[0] : '',
        gender: formData.gender,
        password: ""
      };
      user?.phone === null ? updateGoogleProfile(body) : updateProfile(body);
    }
  };

  return (
    isLoading ? (<LoadingSpinner />) : (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-0 overflow-hidden mt-8 max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-3 bg-[#C14B53] py-6 px-6 rounded-t-2xl">
          <FaUser className="text-white text-2xl" />
          <h2 className="text-xl font-bold text-white">Chỉnh sửa thông tin</h2>
        </div>
        <div className="border-b border-gray-200 my-0" />
        {
          user?.phone === null && (
            <div
              className="flex gap-2 items-center rounded-[10px] bg-[#332701] border-2 border-[#FFDA4B] text-[#FFDA4B] p-4 mx-2 mt-2 text-sm sm:text-base">
              <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.0002 0.669922C11.9552 0.669922 12.8452 1.13692 13.3902 1.91692L13.4952 2.07692L21.6092 15.6249C21.8558 16.052 21.9899 16.5347 21.9991 17.0277C22.0083 17.5208 21.8922 18.0081 21.6617 18.4441C21.4311 18.8801 21.0938 19.2504 20.6811 19.5204C20.2684 19.7904 19.794 19.9513 19.3022 19.9879L19.1072 19.9959H2.88219C2.38989 19.9904 1.90702 19.8602 1.47866 19.6175C1.05029 19.3749 0.690393 19.0276 0.432555 18.6082C0.174717 18.1888 0.0273465 17.7109 0.00419944 17.2191C-0.0189476 16.7273 0.0828832 16.2377 0.300187 15.7959L0.399187 15.6109L8.50919 2.07292C8.76856 1.64447 9.13412 1.29021 9.57051 1.04443C10.0069 0.79864 10.4993 0.669645 11.0002 0.669922ZM11.0102 13.9999L10.8832 14.0069C10.6401 14.0358 10.4161 14.1529 10.2536 14.3359C10.0911 14.5189 10.0013 14.7552 10.0013 14.9999C10.0013 15.2447 10.0911 15.4809 10.2536 15.664C10.4161 15.847 10.6401 15.964 10.8832 15.9929L11.0002 15.9999L11.1272 15.9929C11.3702 15.964 11.5942 15.847 11.7568 15.664C11.9193 15.4809 12.0091 15.2447 12.0091 14.9999C12.0091 14.7552 11.9193 14.5189 11.7568 14.3359C11.5942 14.1529 11.3702 14.0358 11.1272 14.0069L11.0102 13.9999ZM11.0002 6.99992C10.7553 6.99995 10.5188 7.08988 10.3358 7.25264C10.1528 7.4154 10.0358 7.63967 10.0072 7.88292L10.0002 7.99992V11.9999L10.0072 12.1169C10.0361 12.36 10.1531 12.584 10.3362 12.7465C10.5192 12.909 10.7554 12.9988 11.0002 12.9988C11.2449 12.9988 11.4812 12.909 11.6642 12.7465C11.8472 12.584 11.9643 12.36 11.9932 12.1169L12.0002 11.9999V7.99992L11.9932 7.88292C11.9645 7.63967 11.8476 7.4154 11.6646 7.25264C11.4815 7.08988 11.2451 6.99995 11.0002 6.99992Z" fill="#FFDA4B" />
              </svg>

              <p>Bạn cần cập nhật thông tin cá nhân để sử dụng các tính năng của hệ thống.</p>
            </div>
          )
        }
        <form onSubmit={handleSubmit} className="space-y-6 p-8 md:p-10">
          {/* Name */}
          <div className="mb-10">
            <label className="block text-gray-800 font-semibold mb-2" htmlFor="name">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#C14B53] transition-shadow shadow-sm hover:shadow-md">
              <FaUser className="text-[#C14B53] text-[22px] mr-4" />
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={e => handleChange("name", e.target.value as string)}
                placeholder="Họ và tên người dùng"
                className="w-full bg-transparent outline-none border-none p-0 m-0 focus:ring-0 text-base"
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="flex gap-10 flex-col md:flex-row">
            {/* Birth Date */}
            <div className="w-full">
              <label className="block text-gray-800 font-semibold mb-2" htmlFor="birthDate">
                Ngày tháng năm sinh <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-[#C14B53] transition-shadow shadow-sm hover:shadow-md">
                <FaBirthdayCake className="text-[#C14B53] text-[22px] mr-4" />
                <DatePicker
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={(date: Date) => handleChange("birthDate", date.toISOString())}
                  placeholderText="dd/MM/yyyy"
                  className="w-full bg-transparent outline-none border-none p-0 m-0 focus:ring-0"
                  hideCalendarIcon={true}
                  maxDate={new Date()}
                />
              </div>
              {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
            </div>

            {/* Gender */}
            <div className="w-full">
              <div className="flex items-center mb-3">
                <span className="flex items-center text-[#C14B53] text-[22px] mr-3"><FaVenusMars /></span>
                <label className="block text-gray-800 font-semibold">
                  Giới tính <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="flex items-center gap-10 pl-2">
                <label className="inline-flex items-center text-base">
                  <input
                    type="radio"
                    name="gender"
                    checked={formData.gender === true}
                    onChange={() => handleChange("gender", true)}
                    className="text-[#C14B53] focus:ring-[#C14B53] w-5 h-5"
                  />
                  <span className="ml-2">Nam</span>
                </label>
                <label className="inline-flex items-center text-base">
                  <input
                    type="radio"
                    name="gender"
                    checked={formData.gender === false}
                    onChange={() => handleChange("gender", false)}
                    className="text-[#C14B53] focus:ring-[#C14B53] w-5 h-5"
                  />
                  <span className="ml-2">Nữ</span>
                </label>
              </div>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>


          </div>

          <div className="flex gap-10 flex-col md:flex-row">
            {/* Phone */}
            <div className="w-full">
              <label className="block text-gray-800 font-semibold mb-2" htmlFor="phone">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#C14B53] transition-shadow shadow-sm hover:shadow-md">
                <FaPhone className="text-[#C14B53] text-[22px] mr-4" />
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={e => handleChange("phone", e.target.value as string)}
                  placeholder="Số điện thoại người dùng"
                  className="w-full bg-transparent outline-none border-none p-0 m-0 focus:ring-0 text-base"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Blood Type */}
            <div className="w-full">
              <label className="block text-gray-800 font-semibold mb-2" htmlFor="bloodType">
                Nhóm máu <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-1.5 focus-within:ring-2 focus-within:ring-[#C14B53] transition-shadow shadow-sm hover:shadow-md">
                <FaTint className="text-[#C14B53] text-[22px] mr-4" />
                <Select
                  value={formData.bloodType}
                  onValueChange={value => handleChange("bloodType", value as string)}
                >
                  <SelectTrigger className="w-full bg-transparent outline-none border-none p-0 m-0 focus:ring-0">
                    <SelectValue placeholder="Chọn nhóm máu" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.bloodType && <p className="text-red-500 text-sm mt-1">{errors.bloodType}</p>}
            </div>
          </div>

          {/* Gmail */}
          <div className="mb-10">
            <label className="block text-gray-800 font-semibold mb-2" htmlFor="gmail">Email</label>
            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#C14B53] transition-shadow shadow-sm hover:shadow-md">
              <FaEnvelope className="text-[#C14B53] text-[22px] mr-4" />
              <input
                id="gmail"
                type="gmail"
                name="gmail"
                value={formData.gmail}
                onChange={e => handleChange("gmail", e.target.value as string)}
                placeholder="Vd: aboxyz69@gmail.com"
                className="w-full bg-transparent outline-none border-none p-0 m-0 focus:ring-0 text-base"
              />
            </div>
            {errors.gmail && <p className="text-red-500 text-sm mt-1">{errors.gmail}</p>}
          </div>

          {/* address */}
          <div className="flex flex-col md:flex-row gap-10 mb-10">
            <div className=" w-full">
              <label className="block text-gray-800 font-semibold mb-2" htmlFor="province">
                Tỉnh, thành phố <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#C14B53] transition-shadow shadow-sm hover:shadow-md">
                <FaBuilding className="text-[#C14B53] text-[22px] mr-4" />
                <input
                  id="province"
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={e => handleChange("province", e.target.value as string)}
                  placeholder="Nhập tỉnh, thành phố"
                  className="w-full bg-transparent outline-none border-none p-0 m-0 focus:ring-0 text-base"
                />
              </div>
              {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
            </div>

            <div className="w-full">
              <label className="block text-gray-800 font-semibold mb-2" htmlFor="district">
                Quận, huyện <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#C14B53] transition-shadow shadow-sm hover:shadow-md">
                <FaBuilding className="text-[#C14B53] text-[22px] mr-4" />
                <input
                  id="district"
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={e => handleChange("district", e.target.value as string)}
                  placeholder="Nhập quận, huyện"
                  className="w-full bg-transparent outline-none border-none p-0 m-0 focus:ring-0 text-base"
                />
              </div>
              {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
            </div>
          </div>


          <div className="mb-10">
            <label className="block text-gray-800 font-semibold mb-2" htmlFor="address">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#C14B53] transition-shadow shadow-sm hover:shadow-md">
              <FaHome className="text-[#C14B53] text-[22px] mr-4" />
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={e => handleChange("address", e.target.value as string)}
                placeholder="Địa chỉ người dùng"
                className="w-full bg-transparent outline-none border-none p-0 m-0 focus:ring-0 text-base"
              />
            </div>
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div className="pt-4">
            <Button
              className="w-full bg-[#C14B53] hover:bg-[#a83a42] hover:scale-105"
              disabled={hasNotChanged || isLoading}
            >
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
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
    )
  );
};

export default AccountEdit;