import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AccountEdit from "./AccountEdit";
import DonationHistory from "./DonationHistory";
import RegistrationComponent from "./RegistrationComponent";

// Feedback Modal component
const FeedbackModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = "info"}: { 
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