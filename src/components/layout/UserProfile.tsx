import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "../ui/datepicker";

// AccountEdit component with validation
const AccountEdit = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    birthDate: null,
    phone: "",
    email: "",
    bloodType: ""
  });

  const [errors, setErrors] = useState({
    fullName: "",
    gender: "",
    birthDate: "",
    phone: "",
    email: "",
    bloodType: ""
  });

  const bloodTypeOptions = [
    "A+", "A-", 
    "B+", "B-", 
    "AB+", "AB-", 
    "O+", "O-"
  ];

  const validateField = (name, value) => {
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
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validateField(key, formData[key]);
    });
    
    setErrors(newErrors);
    
    // Check if there are any errors
    const isValid = Object.values(newErrors).every(error => !error);
    
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
          <label className="block text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
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
          <label className="block text-gray-700 mb-1">Giới tính <span className="text-red-500">*</span></label>
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
          <label className="block text-gray-700 mb-1">Ngày tháng năm sinh <span className="text-red-500">*</span></label>
          <DatePicker
            selected={formData.birthDate}
            onChange={(date) => handleChange("birthDate", date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/MM/yyyy"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.birthDate ? "border-red-500 focus:ring-red-500" : "focus:ring-[#C14B53]"
            }`}
            showYearDropdown
            dropdownMode="select"
            maxDate={new Date()}
          />
          {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
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
          <label className="block text-gray-700 mb-1">Nhóm máu <span className="text-red-500">*</span></label>
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
              <option key={type} value={type}>{type}</option>
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

// DonationHistory component with added facility and address fields
const DonationHistory = () => {
  const donations = [
    { 
      date: "01 / 01 / 2024", 
      type: "Toàn phần",
      facility: "Viện Huyết học - Truyền máu Trung ương",
      address: "14 Trần Thái Tông, Cầu Giấy, Hà Nội"
    },
    { 
      date: "13 / 05 / 2024", 
      type: "Huyết tương",
      facility: "Bệnh viện Bạch Mai",
      address: "78 Giải Phóng, Đống Đa, Hà Nội"
    },
    { 
      date: "18 / 08 / 2024", 
      type: "Toàn phần",
      facility: "Bệnh viện Hữu nghị Việt Đức",
      address: "40 Tràng Thi, Hoàn Kiếm, Hà Nội"
    },
    { 
      date: "12 / 03 / 2025", 
      type: "Tiểu cầu",
      facility: "Bệnh viện Đa khoa Xanh Pôn",
      address: "12 Chu Văn An, Ba Đình, Hà Nội"
    }
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại máu hiến</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cơ sở</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
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
        >
          Xem chi tiết
        </motion.button>
      </div>
    </motion.div>
  );
};

// SettingsSidebar component (unchanged)
const SettingsSidebar = () => {
  return (
    <div className="bg-white rounded-md shadow-md p-6 sticky top-8">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-[#C14B53] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
          NVA
        </div>
        <h1 className="text-xl font-bold">Nguyễn Văn A</h1>
      </div>
      
      <div className="mb-6">
        <button className="w-full text-[#C14B53] hover:bg-gray-100 py-2 rounded-md text-left px-4">
          Đăng xuất
        </button>
      </div>
      
      <h3 className="font-medium text-lg mb-4">Cài đặt</h3>
      <div className="space-y-3 mb-6">
        <label className="flex items-center">
          <input type="checkbox" className="text-[#C14B53] focus:ring-[#C14B53] rounded" />
          <span className="ml-2">Nhận thông báo (SMS) hiến máu gần đây</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="text-[#C14B53] focus:ring-[#C14B53] rounded" />
          <span className="ml-2">Hiển thị trạng thái sẵn sàng hiến máu</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="text-[#C14B53] focus:ring-[#C14B53] rounded" />
          <span className="ml-2">Tự động cập nhật hệ thống (nếu có)</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="text-[#C14B53] focus:ring-[#C14B53] rounded" />
          <span className="ml-2">Đăng xuất khỏi các thiết bị khác</span>
        </label>
      </div>
      
      <div className="pt-4 border-t">
        <button className="text-red-500 hover:underline">Xóa tài khoản</button>
      </div>
    </div>
  );
};

// Main UserProfile component (unchanged)
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
                className={`flex-1 px-6 py-2 text-sm font-medium cursor-pointer relative ${
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
                <span className="relative z-10">Chỉnh sửa tài khoản</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("donation-history")}
                className={`flex-1 px-6 py-2 text-sm font-medium cursor-pointer relative ${
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
                <span className="relative z-10">Lịch sử hiến máu</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Conditional Rendering */}
          <AnimatePresence mode="wait">
            {activeTab === "account-edit" ? (
              <AccountEdit />
            ) : (
              <DonationHistory />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;