import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "../ui/datepicker";

// Define types for our form data and errors
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

// Feedback Modal component
const FeedbackModal = ({ isOpen, onClose, title, message, type = "info" }: { isOpen: boolean; onClose: () => void; title: string; message: string; type?: "info" | "success" | "error" | "warning" }) => {
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

// AccountEdit component with validation
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

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const bloodTypeOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const validateField = (name: FormField, value: unknown): string => {
    let error = "";
  
    switch (name) {
      case "fullName":
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
      case "email":
        if (value && typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Email không hợp lệ";
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
            onChange={(date: Date) => handleChange("birthDate", date)}
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

// DonationHistory component
const DonationHistory = () => {
  const donations = [
    {
      date: "01 / 01 / 2024",
      type: "Toàn phần",
      facility: "Viện Huyết học - Truyền máu Trung ương",
      address: "14 Trần Thái Tông, Cầu Giấy, Hà Nội",
    },
    {
      date: "13 / 05 / 2024",
      type: "Huyết tương",
      facility: "Bệnh viện Bạch Mai",
      address: "78 Giải Phóng, Đống Đa, Hà Nội",
    },
    {
      date: "18 / 08 / 2024",
      type: "Toàn phần",
      facility: "Bệnh viện Hữu nghị Việt Đức",
      address: "40 Tràng Thi, Hoàn Kiếm, Hà Nội",
    },
    {
      date: "12 / 03 / 2025",
      type: "Tiểu cầu",
      facility: "Bệnh viện Đa khoa Xanh Pôn",
      address: "12 Chu Văn An, Ba Đình, Hà Nội",
    },
  ];

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-md shadow-md p-6"
    >
      <h2 className="text-xl font-bold mb-6 text-[#C14B53]">Lịch sử hiến máu</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại máu hiến
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cơ sở</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donations.map((donation, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.type}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{donation.facility}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{donation.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-[#C14B53] text-white px-6 py-2 rounded-md hover:bg-[#a83a42] transition cursor-pointer"
          onClick={() => setShowDetailsModal(true)}
        >
          Xem chi tiết
        </motion.button>
      </div>

      <FeedbackModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Chi tiết lịch sử hiến máu"
        message="Đây là chi tiết đầy đủ về lịch sử hiến máu của bạn."
        type="info"
      />
    </motion.div>
  );
};

// SettingsSidebar component
const SettingsSidebar = () => {
  const [settings, setSettings] = useState({
    smsNotifications: false,
    showDonationStatus: false,
    autoUpdate: false,
    logoutOtherDevices: false,
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    setShowLogoutSuccess(true);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    setShowDeleteModal(false);
    setShowDeleteSuccess(true);
  };

  return (
    <div className="bg-white rounded-md shadow-md p-6 sticky top-8">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-[#C14B53] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
          NVA
        </div>
        <h1 className="text-xl font-bold">Nguyễn Văn A</h1>
      </div>

      <div className="mb-6">
        <button
          onClick={handleLogout}
          className="w-full text-[#C14B53] hover:bg-gray-100 py-2 rounded-md text-left px-4"
        >
          Đăng xuất
        </button>
      </div>

      <h3 className="font-medium text-lg mb-4">Cài đặt</h3>
      <div className="space-y-3 mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="text-[#C14B53] focus:ring-[#C14B53] rounded"
            checked={settings.smsNotifications}
            onChange={(e) => handleSettingChange("smsNotifications", e.target.checked)}
          />
          <span className="ml-2">Nhận thông báo (SMS) hiến máu gần đây</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            className="text-[#C14B53] focus:ring-[#C14B53] rounded"
            checked={settings.showDonationStatus}
            onChange={(e) => handleSettingChange("showDonationStatus", e.target.checked)}
          />
          <span className="ml-2">Hiển thị trạng thái sẵn sàng hiến máu</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            className="text-[#C14B53] focus:ring-[#C14B53] rounded"
            checked={settings.autoUpdate}
            onChange={(e) => handleSettingChange("autoUpdate", e.target.checked)}
          />
          <span className="ml-2">Tự động cập nhật hệ thống (nếu có)</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            className="text-[#C14B53] focus:ring-[#C14B53] rounded"
            checked={settings.logoutOtherDevices}
            onChange={(e) => handleSettingChange("logoutOtherDevices", e.target.checked)}
          />
          <span className="ml-2">Đăng xuất khỏi các thiết bị khác</span>
        </label>
      </div>

      <div className="pt-4 border-t">
        <button onClick={handleDeleteAccount} className="text-red-500 hover:underline">
          Xóa tài khoản
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <FeedbackModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?"
        type="warning"
      >
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => setShowLogoutModal(false)}
            className="px-4 py-2 text-gray-600 rounded-md border hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={confirmLogout}
            className="px-4 py-2 bg-[#C14B53] text-white rounded-md hover:bg-[#a83a42]"
          >
            Xác nhận
          </button>
        </div>
      </FeedbackModal>

      {/* Logout Success Modal */}
      <FeedbackModal
        isOpen={showLogoutSuccess}
        onClose={() => setShowLogoutSuccess(false)}
        title="Đăng xuất thành công"
        message="Bạn đã đăng xuất khỏi tài khoản thành công."
        type="success"
      />

      {/* Delete Account Confirmation Modal */}

      <FeedbackModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xác nhận xóa tài khoản"
        message="Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn."
        type="error"
      >
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 text-gray-600 rounded-md border hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={confirmDeleteAccount}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Xác nhận xóa
          </button>
        </div>
      </FeedbackModal>

      {/* Delete Account Success Modal */}
      <FeedbackModal
        isOpen={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
        title="Tài khoản đã bị xóa"
        message="Tài khoản của bạn đã được xóa thành công."
        type="success"
      />
    </div>
  );
};

// Registration component with working DatePicker
const RegistrationComponent = () => {
  const [registrations, setRegistrations] = useState([
    {
      id: 1,
      eventName: "Ngày hội hiến máu Xuân hồng 2025",
      date: "15/02/2025",
      time: "08:00 - 12:00",
      location: "Cung Văn hóa Hữu nghị Việt - Xô, 91 Trần Hưng Đạo, Hà Nội",
      type: "normal",
      registeredDate: "10/01/2025",
    },
    {
      id: 2,
      eventName: "Hiến máu nhân đạo tại Bệnh viện Bạch Mai",
      date: "20/03/2025",
      time: "07:30 - 11:30",
      location: "Bệnh viện Bạch Mai, 78 Giải Phóng, Hà Nội",
      type: "volunteer",
      registeredDate: "05/02/2025",
      volunteerDate: "20/03/2025",
    },
  ]);

  const [volunteerDates, setVolunteerDates] = useState<Record<number, Date | null>>(
    registrations.reduce((acc, reg) => {
      if (reg.type === "volunteer" && reg.volunteerDate) {
        const dateParts = reg.volunteerDate.split("/");
        acc[reg.id] = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
      } else {
        acc[reg.id] = null;
      }
      return acc;
    }, {} as Record<number, Date | null>)
  );

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showDateError, setShowDateError] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [tempVolunteerDate, setTempVolunteerDate] = useState<Date | null>(null);
  const [registrationToCancel, setRegistrationToCancel] = useState<number | null>(null);

  const openEditModal = (reg: unknown) => {
    setSelectedRegistration(reg);
    setTempVolunteerDate(volunteerDates[reg.id] || parseDateString(reg.date));
    setIsEditModalOpen(true);
  };

  const openCancelModal = (id: number) => {
    setRegistrationToCancel(id);
    setIsCancelModalOpen(true);
  };

  const closeAllModals = () => {
    setIsEditModalOpen(false);
    setIsCancelModalOpen(false);
    setSelectedRegistration(null);
    setTempVolunteerDate(null);
    setRegistrationToCancel(null);
  };

  const handleSaveDate = () => {
    if (!tempVolunteerDate) {
      setShowDateError(true);
      return;
    }

    // Ensure we're passing a Date object
    const selectedDate = tempVolunteerDate ? new Date(tempVolunteerDate) : null;

    if (selectedDate && selectedRegistration) {
      setVolunteerDates((prev) => ({
        ...prev,
        [selectedRegistration.id]: selectedDate,
      }));
      closeAllModals();
      setShowSaveSuccess(true);
    }
  };

  const handleConfirmCancel = () => {
    if (registrationToCancel) {
      setRegistrations((prev) => prev.filter((reg) => reg.id !== registrationToCancel));
      closeAllModals();
      setShowCancelSuccess(true);
    }
  };

  const parseDateString = (dateString: string): Date => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-md shadow-md p-6"
    >
      <h2 className="text-xl font-bold mb-6 text-[#C14B53]">Lịch đăng ký hiến máu</h2>

      {registrations.length === 0 ? (
        <p className="text-gray-500">Bạn chưa đăng ký tham gia sự kiện hiến máu nào.</p>
      ) : (
        <div className="space-y-6">
          {registrations.map((reg) => (
            <div key={reg.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[#C14B53]">{reg.eventName}</h3>
                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">Ngày diễn ra:</span> {reg.date} ({reg.time})
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Địa điểm:</span> {reg.location}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Ngày đăng ký:</span> {reg.registeredDate}
                  </p>
                  {reg.type === "volunteer" && (
                    <div className="mt-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Ngày tình nguyện:</span>{" "}
                        {volunteerDates[reg.id]?.toLocaleDateString("en-GB") || reg.date}
                        <button
                          onClick={() => openEditModal(reg)}
                          className="ml-2 text-[#C14B53] text-sm hover:underline cursor-pointer"
                        >
                          Chỉnh sửa
                        </button>
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => openCancelModal(reg.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium ml-4 cursor-pointer"
                >
                  Hủy đăng ký
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Volunteer Date Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedRegistration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeAllModals}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-[#C14B53] mb-4">Chỉnh sửa ngày tình nguyện</h3>

              <p className="mb-2 font-medium">{selectedRegistration.eventName}</p>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Ngày tình nguyện</label>
                <DatePicker
                  value={tempVolunteerDate}
                  onChange={(date: Date | null) => setTempVolunteerDate(date)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#C14B53]"
                  minDate={parseDateString(selectedRegistration.date)}
                  placeholderText="Chọn ngày tình nguyện"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={closeAllModals} className="px-4 py-2 text-gray-600 rounded-md border hover:bg-gray-50">
                  Hủy
                </button>
                <button
                  onClick={handleSaveDate}
                  className="px-4 py-2 bg-[#C14B53] text-white rounded-md hover:bg-[#a83a42] cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Registration Confirmation Modal */}
      <AnimatePresence>
        {isCancelModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeAllModals}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-[#C14B53] mb-4">Xác nhận hủy đăng ký</h3>

              <p className="mb-4">Bạn có chắc chắn muốn hủy đăng ký tham gia sự kiện này không?</p>

              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={closeAllModals} className="px-4 py-2 text-gray-600 rounded-md border hover:bg-gray-50">
                  Quay lại
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
                >
                  Xác nhận hủy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success and Error Modals */}
      <FeedbackModal
        isOpen={showCancelSuccess}
        onClose={() => setShowCancelSuccess(false)}
        title="Thành công"
        message="Đã hủy đăng ký sự kiện thành công!"
        type="success"
      />

      <FeedbackModal
        isOpen={showSaveSuccess}
        onClose={() => setShowSaveSuccess(false)}
        title="Thành công"
        message="Ngày tình nguyện đã được cập nhật!"
        type="success"
      />

      <FeedbackModal
        isOpen={showDateError}
        onClose={() => setShowDateError(false)}
        title="Lỗi"
        message="Vui lòng chọn ngày tình nguyện"
        type="error"
      />
    </motion.div>
  );
};

// Main UserProfile component
const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("account-edit");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side (30%) - Settings Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <SettingsSidebar />
        </div>

        {/* Right Side (70%) - Content with Toggle */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          {/* Navigation Toggle */}
          <div className="flex justify-center mb-8">
            <motion.div
              className="flex bg-white rounded-full shadow-sm border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("account-edit")}
                className={`flex-1 px-4 py-2 text-sm font-medium cursor-pointer relative ${
                  activeTab === "account-edit" ? "text-white" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {activeTab === "account-edit" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#C14B53] z-0 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Tài khoản</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("donation-history")}
                className={`flex-1 px-4 py-2 text-sm font-medium cursor-pointer relative ${
                  activeTab === "donation-history" ? "text-white" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {activeTab === "donation-history" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#C14B53] z-0 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Lịch sử</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("registrations")}
                className={`flex-1 px-4 py-2 text-sm font-medium cursor-pointer relative ${
                  activeTab === "registrations" ? "text-white" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {activeTab === "registrations" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#C14B53] z-0 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Đăng ký</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Conditional Rendering */}
          <AnimatePresence mode="wait">
            {activeTab === "account-edit" ? (
              <AccountEdit />
            ) : activeTab === "donation-history" ? (
              <DonationHistory />
            ) : (
              <RegistrationComponent />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
