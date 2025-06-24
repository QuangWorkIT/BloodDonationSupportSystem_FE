import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AccountEdit from "./AccountEdit";
import DonationHistory from "./DonationHistory";
import RegistrationComponent from "./RegistrationComponent";

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
    </AnimatePresence>
  );
};

// Types for Settings
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
  const [settings, setSettings] = useState<SettingsState>({
    smsNotifications: false,
    showDonationStatus: false,
    autoUpdate: false,
    logoutOtherDevices: false,
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const handleSettingChange = (setting: keyof SettingsState, value: boolean) => {
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
    <div className={`bg-white rounded-md shadow-md p-6 ${isMobile ? 'fixed inset-0 z-40 overflow-y-auto' : 'sticky top-8'}`}>
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

      {/* Modals */}
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

      <FeedbackModal
        isOpen={showLogoutSuccess}
        onClose={() => setShowLogoutSuccess(false)}
        title="Đăng xuất thành công"
        message="Bạn đã đăng xuất khỏi tài khoản thành công."
        type="success"
      />

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

// MobileDonationHistory component
interface DonationItem {
  id: string;
  date: string;
  location: string;
  amount: string;
  status: string;
}

const MobileDonationHistory: React.FC = () => {
  // Sample data - replace with your actual data
  const donations: DonationItem[] = [
    { id: "1", date: "15/06/2023", location: "Bệnh viện Chợ Rẫy", amount: "350ml", status: "Hoàn thành" },
    { id: "2", date: "20/03/2023", location: "Viện Huyết học", amount: "350ml", status: "Hoàn thành" },
    { id: "3", date: "10/12/2022", location: "Bệnh viện Nhân dân 115", amount: "350ml", status: "Hoàn thành" },
  ];

  return (
    <div className="space-y-4">
      {donations.map((donation) => (
        <motion.div 
          key={donation.id}
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{donation.location}</h3>
              <p className="text-sm text-gray-500">{donation.date}</p>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              donation.status === "Hoàn thành" 
                ? "bg-green-100 text-green-800" 
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {donation.status}
            </span>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-sm font-medium">Lượng máu: {donation.amount}</span>
            <button className="text-[#C14B53] text-sm font-medium hover:underline">
              Chi tiết
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Main UserProfile component
type ProfileTab = "account-edit" | "donation-history" | "registrations";

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("account-edit");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Touch event handlers for swipe gestures
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      if (activeTab === "account-edit") setActiveTab("donation-history");
      else if (activeTab === "donation-history") setActiveTab("registrations");
    } else if (touchEnd - touchStart > 50) {
      // Swipe right
      if (activeTab === "registrations") setActiveTab("donation-history");
      else if (activeTab === "donation-history") setActiveTab("account-edit");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isMobile && (
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setShowMobileSidebar(true)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Hồ sơ cá nhân</h1>
          <div className="w-6"></div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side - Settings Sidebar */}
        {!isMobile ? (
          <div className="w-full md:w-1/3 lg:w-1/4">
            <SettingsSidebar />
          </div>
        ) : (
          <AnimatePresence>
            {showMobileSidebar && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm"
              >
                <SettingsSidebar isMobile onClose={() => setShowMobileSidebar(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Right Side - Content */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          {/* Navigation Toggle - Responsive version */}
          <div className="flex justify-center mb-8">
            {isMobile ? (
              <div className="w-full bg-white rounded-full shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex">
                  {(["account-edit", "donation-history", "registrations"] as ProfileTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-4 py-2 text-sm font-medium relative ${
                        activeTab === tab ? "text-[#C14B53] font-semibold" : "text-gray-700"
                      }`}
                    >
                      {tab === "account-edit" ? "Tài khoản" : 
                       tab === "donation-history" ? "Lịch sử" : "Đăng ký"}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="mobileTabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C14B53]"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                className="flex bg-white rounded-full shadow-sm border border-gray-200 overflow-hidden"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {(["account-edit", "donation-history", "registrations"] as ProfileTab[]).map((tab) => (
                  <motion.button
                    key={tab}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-2 text-sm font-medium cursor-pointer relative ${
                      activeTab === tab ? "text-white" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#C14B53] z-0 rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">
                      {tab === "account-edit" ? "Tài khoản" : 
                       tab === "donation-history" ? "Lịch sử" : "Đăng ký"}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Conditional Rendering with swipe support */}
          <div 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ x: isMobile ? (activeTab === "account-edit" ? 50 : -50) : 0, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isMobile ? (activeTab === "account-edit" ? -50 : 50) : 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {activeTab === "account-edit" ? (
                  <AccountEdit />
                ) : activeTab === "donation-history" ? (
                  isMobile ? <MobileDonationHistory /> : <DonationHistory />
                ) : (
                  <RegistrationComponent />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;