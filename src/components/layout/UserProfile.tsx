import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaHistory, FaClipboardList, FaEye, FaTint, FaHashtag, FaCalendarAlt, FaHospital, FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import AccountEdit from "./AccountEdit";
import DonationHistory from "./DonationHistory";
import RegistrationComponent from "./RegistrationComponent";
import SettingsSidebar from "./SettingsSidebar";
import { authenApi } from "@/lib/instance";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/authen/AuthContext";

// API Response interfaces
interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

// API Donation interface matching the actual response
interface ApiDonation {
  registrationId: number;
  donateDate: string;
  facilityName: string;
  facilityAddress: string;
  longitude: number;
  latitude: number;
  status: boolean;
  volume: number | null;
  description: string;
}

// Mobile Donation interface for the UI
interface MobileDonationItem {
  registrationId: number;
  date: string;
  location: string;
  amount: string;
  status: "Hoàn thành" | "Đang diễn ra" | "Thất bại";
  description?: string;
}

// Helper function to format date from API format (YYYY-MM-DD) to display format (DD/MM/YYYY)
const formatMobileDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to transform API data to mobile display format
const transformApiDonationToMobile = (apiDonation: ApiDonation): MobileDonationItem => {
  let status: "Hoàn thành" | "Đang diễn ra" | "Thất bại";
  if (apiDonation.status) {
    if (apiDonation.volume !== null) {
      status = "Hoàn thành";
    } else {
      status = "Đang diễn ra";
    }
  } else {
    status = "Thất bại";
  }

  return {
    registrationId: apiDonation.registrationId,
    date: formatMobileDate(apiDonation.donateDate),
    location: apiDonation.facilityName,
    amount: apiDonation.volume ? `${apiDonation.volume}ml` : "N/A",
    status,
    description: apiDonation.description,
  };
};

// MobileDonationHistory component
const MobileDonationHistory: React.FC = () => {
  // State Management
  const [donations, setDonations] = useState<MobileDonationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<MobileDonationItem | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Data Fetching
  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch donation history data from the API
        const response = await authenApi.get<ApiResponse<ApiDonation[]>>(
          `/api/donation-history`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.isSuccess) {
          // Transform API data to mobile display format
          const transformedDonations = response.data.data.map(transformApiDonationToMobile);
          setDonations(transformedDonations);
        } else {
          setError(response.data.message || "Failed to fetch donation history");
        }
      } catch (err) {
        const error = err as AxiosError<ApiResponse<null>>;
        setError(error.response?.data?.message || error.message || "Error fetching donation history data");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, []);

  const handleDetailsClick = (donation: MobileDonationItem) => {
    setSelectedDonation(donation);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C14B53]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
        {error}
        <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
          <span className="text-red-700">×</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {donations.length > 0 ? (
        donations.map((donation) => (
          <motion.div 
            key={donation.registrationId}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{donation.location}</h3>
                <p className="text-sm text-gray-500">{donation.date}</p>
                <p className="text-xs text-gray-400">Mã: #{donation.registrationId}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                donation.status === "Hoàn thành"
                  ? "bg-green-100 text-green-800"
                  : donation.status === "Đang diễn ra"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {donation.status}
              </span>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm font-medium">Lượng máu: {donation.amount}</span>
              <button 
                onClick={() => handleDetailsClick(donation)}
                className="text-[#C14B53] p-2 rounded-full hover:bg-[#f8e6ea] transition cursor-pointer"
                aria-label="Xem chi tiết"
              >
                <FaEye size={18} />
              </button>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          Không có lịch sử hiến máu nào
        </div>
      )}

      {/* Mobile Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedDonation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with accent bar and icon */}
              <div className="bg-[#C14B53] flex flex-col items-center justify-center py-6 px-4">
                <FaTint className="text-white text-3xl mb-2" />
                <h3 className="text-xl font-bold text-center text-white">Chi tiết lần hiến máu</h3>
              </div>
              <div className="border-b border-gray-200 my-0" />
              {/* Details Card */}
              <div className="p-6 bg-white grid grid-cols-1 gap-y-5">
                <div className="flex items-center gap-3">
                  <FaHashtag className="text-[#C14B53] text-base" />
                  <div>
                    <p className="text-sm text-gray-500">Mã đăng ký</p>
                    <p className="font-medium">#{selectedDonation.registrationId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-[#C14B53] text-base" />
                  <div>
                    <p className="text-sm text-gray-500">Ngày hiến máu</p>
                    <p className="font-medium">{selectedDonation.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaHospital className="text-[#C14B53] text-base" />
                  <div>
                    <p className="text-sm text-gray-500">Cơ sở</p>
                    <p className="font-medium">{selectedDonation.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheckCircle className={`text-base ${selectedDonation.status === 'Hoàn thành' ? 'text-green-500' : 'hidden'}`} />
                  <FaInfoCircle className={`text-base ${selectedDonation.status === 'Đang diễn ra' ? 'text-blue-500' : 'hidden'}`} />
                  <FaTimesCircle className={`text-base ${selectedDonation.status === 'Thất bại' ? 'text-red-500' : 'hidden'}`} />
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedDonation.status === "Hoàn thành"
                        ? "bg-green-100 text-green-800"
                        : selectedDonation.status === "Đang diễn ra"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {selectedDonation.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaTint className="text-[#C14B53] text-base" />
                  <div>
                    <p className="text-sm text-gray-500">Lượng máu</p>
                    <p className="font-medium">{selectedDonation.amount}</p>
                  </div>
                </div>
                {selectedDonation.description && (
                  <div className="flex items-center gap-3">
                    <FaInfoCircle className="text-[#C14B53] text-base" />
                    <div>
                      <p className="text-sm text-gray-500">Mô tả</p>
                      <p className="font-medium">{selectedDonation.description}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-0 flex justify-center bg-white pb-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-8 py-3 bg-[#C14B53] text-white rounded-xl font-semibold text-base hover:bg-[#a83a42] transition focus:outline-none focus:ring-2 focus:ring-[#C14B53] cursor-pointer shadow-md"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main UserProfile component
type ProfileTab = "account-edit" | "donation-history" | "registrations";

const UserProfile: React.FC = () => {
  const { user } = useAuth();
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

  const tabIcons = {
    "account-edit": <FaUser className="mr-2" />, 
    "donation-history": <FaHistory className="mr-2" />, 
    "registrations": <FaClipboardList className="mr-2" />,
  };

  // Only allow account-edit tab for staff
  const isStaff = user?.role === "Staff";
  const availableTabs: ProfileTab[] = isStaff ? ["account-edit"] : ["account-edit", "donation-history", "registrations"];

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
      <div className="flex flex-col md:flex-row gap-8 md:min-w-[1000px]">
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
            {!isStaff && ( // Hide toggles for staff
              isMobile ? (
                <div className="w-full bg-white rounded-full shadow-md border border-gray-200 overflow-hidden">
                  <div className="flex">
                    {availableTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 flex items-center justify-center px-4 py-3 text-base font-medium transition-all duration-200 rounded-full relative ${
                          activeTab === tab ? "text-[#C14B53] bg-[#F8F9FA] shadow-inner" : "text-gray-700 hover:bg-gray-50"
                        }`}
                        style={{ minHeight: 44 }}
                      >
                        {tabIcons[tab]}
                        {tab === "account-edit" ? "Tài khoản" : 
                         tab === "donation-history" ? "Lịch sử" : "Đăng ký"}
                        {activeTab === tab && (
                          <motion.div
                            layoutId="mobileTabIndicator"
                            className="absolute bottom-0 left-3 right-3 h-1 rounded-full bg-[#C14B53]"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.div
                  className="flex bg-white rounded-full shadow-md border border-gray-200 overflow-hidden"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {availableTabs.map((tab) => (
                    <motion.button
                      key={tab}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 flex items-center justify-center px-6 py-4 text-base font-medium cursor-pointer transition-all duration-200 rounded-full relative ${
                        activeTab === tab ? "text-white" : "text-gray-700 hover:bg-gray-50"
                      }`}
                      style={{ minHeight: 48 }}
                    >
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-[#C14B53] z-0 rounded-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center whitespace-nowrap">
                        {tabIcons[tab]}
                        {tab === "account-edit" ? "Tài khoản" : 
                         tab === "donation-history" ? "Lịch sử" : "Đăng ký"}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )
            )}
          </div>
          {/* Conditional Rendering with swipe support */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ x: isMobile ? (activeTab === "account-edit" ? 50 : -50) : 0, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isMobile ? (activeTab === "account-edit" ? -50 : 50) : 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Only render AccountEdit for staff, otherwise render based on tab */}
                {isStaff ? (
                  <AccountEdit />
                ) : activeTab === "account-edit" ? (
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