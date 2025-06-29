import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useAuth } from "@/hooks/authen/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

    setTimeout(() => {
      navigate('/', { replace: true });
    }, 0)
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
      className={`bg-white rounded-md shadow-md p-6 ${isMobile ? 'fixed inset-0 z-40 overflow-y-auto' : 'sticky top-8'}`}
    >
      {isMobile && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Cài đặt tài khoản</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-[#C14B53] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
          NVA
        </div>
        <h1 className="text-xl font-bold">{user?.name}</h1>
      </div>

      <div className="mb-6">
        <button
          onClick={handleLogout}
          className="w-full text-[#C14B53] hover:bg-gray-100 py-2 rounded-md text-left px-4 cursor-pointer transition"
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
        <button
          onClick={handleDeleteAccount}
          className="text-red-500 hover:underline cursor-pointer"
        >
          Xóa tài khoản
        </button>
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
            className="px-4 py-2 text-gray-600 rounded-md border hover:bg-gray-50"
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
            className="px-4 py-2 text-gray-600 rounded-md border hover:bg-gray-50"
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