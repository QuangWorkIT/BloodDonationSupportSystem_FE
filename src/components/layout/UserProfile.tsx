import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AccountEdit from "./AccountEdit";
import DonationHistory from "./DonationHistory";
import RegistrationComponent from "./RegistrationComponent";
import SettingsSidebar from "./SettingsSidebar";

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