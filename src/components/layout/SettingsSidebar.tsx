import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useAuth } from "@/hooks/authen/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBell, FaSync, FaSignOutAlt, FaTrash, FaCog, FaUndo } from "react-icons/fa";

// Types for Feedback Modal
type FeedbackType = "info" | "success" | "error" | "warning";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: FeedbackType;
  children?: React.ReactNode;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  children
}) => {
  const typeColors: Record<FeedbackType, string> = {
    info: "bg-blue-500",
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
  };

  // Portal implementation
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
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
            {children || (
              <div className="flex justify-center">
                <button
                  onClick={onClose}
                  className={`px-6 py-2 ${typeColors[type]} text-white rounded-md hover:opacity-90`}
                >
                  Đóng
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

interface SettingsState {
  smsNotifications: boolean;
  showDonationStatus: boolean;
  autoUpdate: boolean;
  logoutOtherDevices: boolean;
}

interface SettingsSidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ isMobile = false, onClose }) => {
  const { user, setToken, setUser } = useAuth()
  const navigate = useNavigate()
  const [settings, setSettings] = useState<SettingsState>({
    smsNotifications: false,
    showDonationStatus: false,
    autoUpdate: false,
    logoutOtherDevices: false,
  });

  // Modal states
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const handleSettingChange = (setting: keyof SettingsState, value: boolean) => {
    setSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    setToken(null)
    setUser(null)
    toast.success('Đăng xuất thành công!')

    user?.role === 'Admin' || user?.role === 'Staff' ? navigate('/login', { replace: true }) : navigate('/', { replace: true });
  };

  const confirmDeleteAccount = () => {
    setIsDeleteModalOpen(false);
    setShowDeleteSuccess(true);
  };

  const closeAllModals = () => {
    setIsLogoutModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0}}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`bg-white rounded-2xl shadow-xl p-0 ${isMobile ? 'fixed inset-0 z-40 overflow-y-auto' : 'sticky top-8'}`}
    >
      {isMobile && (
        <div className="flex justify-between items-center px-4 pt-4 mb-2">
          <h2 className="text-lg font-bold">Cài đặt tài khoản</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C14B53]" aria-label="Đóng">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Profile Card */}
      <div className={`flex flex-col items-center bg-[#F8F9FA] rounded-t-2xl ${isMobile ? 'px-4 pt-6 pb-4' : 'px-8 pt-8 pb-6'} border-b border-gray-200`}>
        <div className="w-16 h-16 rounded-full bg-[#C14B53] flex items-center justify-center mb-3 shadow text-white">
          <FaUser size={32} />
        </div>
        <h1 className="text-base font-bold text-[#C14B53] mb-1">{user?.unique_name}</h1>
        {user?.gmail && <div className="text-gray-500 text-xs">{user.gmail}</div>}
        {user?.phone && <div className="text-gray-400 text-xs">{user.phone}</div>}
      </div>

      {/* Settings Card */}
      <div className={`${isMobile ? 'px-4 py-4' : 'px-8 py-6'}`}>
        <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
          <FaCog className="text-[#C14B53]" /> Cài đặt
        </h3>
        <div className="bg-white rounded-xl shadow border border-gray-100 divide-y divide-gray-100">
          {/* Setting Row: Notifications */}
          <div className="flex items-center justify-between px-4 py-3 group focus-within:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <FaBell className="text-[#C14B53]" />
              <span className="font-medium text-sm">Nhận thông báo (SMS) hiến máu gần đây</span>
            </div>
            <button
              aria-label="Bật/tắt thông báo SMS"
              className={`w-20 h-8 rounded-full relative cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transition-colors focus:outline-none ${settings.smsNotifications ? 'bg-[#C14B53]' : 'bg-gray-300'}`}
              onClick={() => handleSettingChange("smsNotifications", !settings.smsNotifications)}
              tabIndex={0}
            >
              <span className={`absolute top-1 ${settings.smsNotifications ? 'right-1' : 'left-1'} w-6 h-6 rounded-full bg-white shadow transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`}></span>
            </button>
          </div>
          {/* Setting Row: Show Donation Status */}
          <div className="flex items-center justify-between px-4 py-3 group focus-within:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <FaUser className="text-[#C14B53]" />
              <span className="font-medium text-sm">Hiển thị trạng thái sẵn sàng hiến máu</span>
            </div>
            <button
              aria-label="Bật/tắt trạng thái hiến máu"
              className={`w-20 h-8 rounded-full relative cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transition-colors focus:outline-none ${settings.showDonationStatus ? 'bg-[#C14B53]' : 'bg-gray-300'}`}
              onClick={() => handleSettingChange("showDonationStatus", !settings.showDonationStatus)}
              tabIndex={0}
            >
              <span className={`absolute top-1 ${settings.showDonationStatus ? 'right-1' : 'left-1'} w-6 h-6 rounded-full bg-white shadow transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`}></span>
            </button>
          </div>
          {/* Setting Row: Auto Update */}
          <div className="flex items-center justify-between px-4 py-3 group focus-within:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <FaSync className="text-[#C14B53]" />
              <span className="font-medium text-sm">Tự động cập nhật hệ thống (nếu có)</span>
            </div>
            <button
              aria-label="Bật/tắt tự động cập nhật"
              className={`w-20 h-8 rounded-full relative cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transition-colors focus:outline-none ${settings.autoUpdate ? 'bg-[#C14B53]' : 'bg-gray-300'}`}
              onClick={() => handleSettingChange("autoUpdate", !settings.autoUpdate)}
              tabIndex={0}
            >
              <span className={`absolute top-1 ${settings.autoUpdate ? 'right-1' : 'left-1'} w-6 h-6 rounded-full bg-white shadow transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`}></span>
            </button>
          </div>
          {/* Setting Row: Logout Other Devices */}
          <div className="flex items-center justify-between px-4 py-3 group focus-within:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <FaSignOutAlt className="text-[#C14B53]" />
              <span className="font-medium text-sm">Đăng xuất khỏi các thiết bị khác</span>
            </div>
            <button
              aria-label="Đăng xuất khỏi thiết bị khác"
              className={`w-20 h-8 rounded-full relative cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transition-colors focus:outline-none ${settings.logoutOtherDevices ? 'bg-[#C14B53]' : 'bg-gray-300'}`}
              onClick={() => handleSettingChange("logoutOtherDevices", !settings.logoutOtherDevices)}
              tabIndex={0}
            >
              <span className={`absolute top-1 ${settings.logoutOtherDevices ? 'right-1' : 'left-1'} w-6 h-6 rounded-full bg-white shadow transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`}></span>
            </button>
          </div>
        </div>
      </div>

      {/* Actions Card */}
      <div className={`${isMobile ? 'px-4 pb-4' : 'px-8 pb-8'}`}>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/home')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition cursor-pointer text-base"
            aria-label="Quay lại trang chủ"
          >
            <FaUndo /> Quay lại trang chủ
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C14B53] text-white font-semibold hover:bg-[#a83a42] focus:outline-none focus:ring-2 focus:ring-[#C14B53] transition cursor-pointer text-base"
            aria-label="Đăng xuất"
          >
            <FaSignOutAlt /> Đăng xuất
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-100 text-red-600 font-semibold hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition cursor-pointer text-base"
            aria-label="Xóa tài khoản"
          >
            <FaTrash /> Xóa tài khoản
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <FeedbackModal
        isOpen={isLogoutModalOpen}
        onClose={closeAllModals}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?"
        type="warning"
      >
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={closeAllModals}
            className="px-4 py-2 text-gray-600 rounded-md border hover:bg-gray-50 cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={confirmLogout}
            className="px-4 py-2 bg-[#C14B53] text-white rounded-md hover:bg-[#a83a42] cursor-pointer"
          >
            Xác nhận
          </button>
        </div>
      </FeedbackModal>

      {/* Delete Account Confirmation Modal */}
      <FeedbackModal
        isOpen={isDeleteModalOpen}
        onClose={closeAllModals}
        title="Xác nhận xóa tài khoản"
        message="Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn."
        type="error"
      >
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={closeAllModals}
            className="px-4 py-2 text-gray-600 rounded-md border hover:bg-gray-50 cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={confirmDeleteAccount}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
          >
            Xác nhận xóa
          </button>
        </div>
      </FeedbackModal>

      {/* Success Modals */}
      <FeedbackModal
        isOpen={showLogoutSuccess}
        onClose={() => setShowLogoutSuccess(false)}
        title="Đăng xuất thành công"
        message="Bạn đã đăng xuất khỏi tài khoản thành công."
        type="success"
      />

      <FeedbackModal
        isOpen={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
        title="Tài khoản đã bị xóa"
        message="Tài khoản của bạn đã được xóa thành công."
        type="success"
      />
    </motion.div>
  );
};

export default SettingsSidebar;