import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// Simple DatePicker component
const DatePicker = ({ value, onChange, className, minDate, maxDate, placeholderText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const [inputValue, setInputValue] = useState("");

  // Update input value when value prop changes
  React.useEffect(() => {
    if (value) {
      const formatted = formatDate(value);
      setInputValue(formatted);
    } else {
      setInputValue("");
    }
  }, [value]);

  const formatDate = (date: { getDate: () => { (): unknown; new(): unknown; toString: { (): string; new(): unknown; }; }; getMonth: () => number; getFullYear: () => unknown; }) => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateString: unknown) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const getDaysInMonth = (date: { getFullYear: () => unknown; getMonth: () => unknown; }) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateDisabled = (date: number | Date | null) => {
    if (!date) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    onChange(date);
    setIsOpen(false);
  };

  const handleInputChange = (e: { target: { value: unknown; }; }) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Try to parse the date if it matches the format
    if (value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const parsedDate = parseDate(value);
      if (parsedDate && !isNaN(parsedDate.getTime())) {
        onChange(parsedDate);
      }
    }
  };

  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onClick={() => setIsOpen(!isOpen)}
          placeholder={placeholderText || "dd/MM/yyyy"}
          className={`${className} pr-10`}
          readOnly={false}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <Calendar size={16} className="text-gray-400" />
        </button>
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 p-4 min-w-80">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="font-medium">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => (
              <button
                key={index}
                type="button"
                onClick={() => date && handleDateClick(date)}
                disabled={isDateDisabled(date)}
                className={`
                  p-2 text-sm rounded hover:bg-gray-100 
                  ${!date ? "invisible" : ""}
                  ${isDateDisabled(date) ? "text-gray-300 cursor-not-allowed" : "cursor-pointer"}
                  ${value && date && date.toDateString() === value.toDateString() ? "bg-[#C14B53] text-white hover:bg-[#C14B53]" : ""}
                `}
              >
                {date ? date.getDate() : ""}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
      alert("Thông tin đã được cập nhật thành công!");
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
          onClick={() => alert("Xem chi tiết lịch sử hiến máu")}
        >
          Xem chi tiết
        </motion.button>
      </div>
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

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleLogout = () => {
    alert("Đăng xuất thành công!");
  };

  const handleDeleteAccount = () => {
    if (confirm("Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.")) {
      alert("Tài khoản đã được xóa.");
    }
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
            onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
          />
          <span className="ml-2">Nhận thông báo (SMS) hiến máu gần đây</span>
        </label>
        <label className="flex items-center">
          <input 
            type="checkbox" 
            className="text-[#C14B53] focus:ring-[#C14B53] rounded"
            checked={settings.showDonationStatus}
            onChange={(e) => handleSettingChange('showDonationStatus', e.target.checked)}
          />
          <span className="ml-2">Hiển thị trạng thái sẵn sàng hiến máu</span>
        </label>
        <label className="flex items-center">
          <input 
            type="checkbox" 
            className="text-[#C14B53] focus:ring-[#C14B53] rounded"
            checked={settings.autoUpdate}
            onChange={(e) => handleSettingChange('autoUpdate', e.target.checked)}
          />
          <span className="ml-2">Tự động cập nhật hệ thống (nếu có)</span>
        </label>
        <label className="flex items-center">
          <input 
            type="checkbox" 
            className="text-[#C14B53] focus:ring-[#C14B53] rounded"
            checked={settings.logoutOtherDevices}
            onChange={(e) => handleSettingChange('logoutOtherDevices', e.target.checked)}
          />
          <span className="ml-2">Đăng xuất khỏi các thiết bị khác</span>
        </label>
      </div>

      <div className="pt-4 border-t">
        <button 
          onClick={handleDeleteAccount}
          className="text-red-500 hover:underline"
        >
          Xóa tài khoản
        </button>
      </div>
    </div>
  );
};

// Registration component with working DatePicker// Registration component with modals for all actions
const RegistrationComponent = () => {
  const [registrations, setRegistrations] = useState([
    {
      id: 1,
      eventName: "Ngày hội hiến máu Xuân hồng 2025",
      date: "15/02/2025",
      time: "08:00 - 12:00",
      location: "Cung Văn hóa Hữu nghị Việt - Xô, 91 Trần Hưng Đạo, Hà Nội",
      type: "normal",
      registeredDate: "10/01/2025"
    },
    {
      id: 2,
      eventName: "Hiến máu nhân đạo tại Bệnh viện Bạch Mai",
      date: "20/03/2025",
      time: "07:30 - 11:30",
      location: "Bệnh viện Bạch Mai, 78 Giải Phóng, Hà Nội",
      type: "volunteer",
      registeredDate: "05/02/2025",
      volunteerDate: "20/03/2025"
    },
  ]);

  const [volunteerDates, setVolunteerDates] = useState<Record<number, Date | null>>(
    registrations.reduce((acc, reg) => {
      if (reg.type === "volunteer" && reg.volunteerDate) {
        const dateParts = reg.volunteerDate.split('/');
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
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [tempVolunteerDate, setTempVolunteerDate] = useState<Date | null>(null);
  const [registrationToCancel, setRegistrationToCancel] = useState<number | null>(null);

  const openEditModal = (reg: any) => {
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
      alert('Vui lòng chọn ngày tình nguyện');
      return;
    }
    
    setVolunteerDates(prev => ({ ...prev, [selectedRegistration.id]: tempVolunteerDate }));
    closeAllModals();
  };

  const handleConfirmCancel = () => {
    if (registrationToCancel) {
      setRegistrations(prev => prev.filter(reg => reg.id !== registrationToCancel));
      closeAllModals();
      
      // Show success feedback
      setIsCancelModalOpen(false);
      setTimeout(() => {
        alert(`Đã hủy đăng ký sự kiện thành công!`);
      }, 300);
    }
  };

  const parseDateString = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/').map(Number);
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
          {registrations.map(reg => (
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
                        <span className="font-medium">Ngày tình nguyện:</span> {volunteerDates[reg.id]?.toLocaleDateString('en-GB') || reg.date}
                        <button
                          onClick={() => openEditModal(reg)}
                          className="ml-2 text-[#C14B53] text-sm hover:underline"
                        >
                          Chỉnh sửa
                        </button>
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => openCancelModal(reg.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium ml-4"
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
              <h3 className="text-lg font-bold text-[#C14B53] mb-4">
                Chỉnh sửa ngày tình nguyện
              </h3>
              
              <p className="mb-2 font-medium">{selectedRegistration.eventName}</p>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Ngày tình nguyện
                </label>
                <DatePicker
                  value={tempVolunteerDate}
                  onChange={(date: Date | null) => setTempVolunteerDate(date)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#C14B53]"
                  minDate={parseDateString(selectedRegistration.date)}
                  placeholderText="Chọn ngày tình nguyện"
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeAllModals}
                  className="px-4 py-2 text-gray-600 rounded-md border hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveDate}
                  className="px-4 py-2 bg-[#C14B53] text-white rounded-md hover:bg-[#a83a42]"
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
              <h3 className="text-lg font-bold text-[#C14B53] mb-4">
                Xác nhận hủy đăng ký
              </h3>
              
              <p className="mb-4">
                Bạn có chắc chắn muốn hủy đăng ký tham gia sự kiện này không?
              </p>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeAllModals}
                  className="px-4 py-2 text-gray-600 rounded-md border hover:bg-gray-50"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Xác nhận hủy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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