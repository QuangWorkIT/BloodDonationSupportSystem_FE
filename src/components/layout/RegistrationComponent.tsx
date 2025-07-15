import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "../ui/datepicker";
import { FaCalendarAlt, FaMapMarkerAlt, FaUserFriends, FaRegEdit, FaTrash, FaClipboardList, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaRegCalendarCheck } from "react-icons/fa";
import { authenApi } from "@/lib/instance";
import { AxiosError } from "axios";
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
type Registration = {
  id: number;
  eventName: string;
  date: string;
  time: string;
  location: string;
  type: "normal" | "volunteer";
  registeredDate: string;
  volunteerDate?: string;
};
// API Response interfaces
interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

interface ApiRegistration {
  id: number;
  type: "Donation" | "Volunteer";
  facilityName: string;
  eventName: string | null;
  eventDate: string | null;
  longitude: number;
  latitude: number;
  registerDate: string;
  startDate: string | null;
  endDate: string | null;
  isExpired: boolean | null;
}
const RegistrationComponent = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [volunteerDates, setVolunteerDates] = useState<Record<number, Date | null>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showDateError, setShowDateError] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [tempVolunteerDate, setTempVolunteerDate] = useState<Date | null>(null);
  const [registrationToCancel, setRegistrationToCancel] = useState<number | null>(null);

  // Helper to format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Transform API data to Registration type
  const transformApiRegistration = (apiReg: ApiRegistration): Registration => {
    const isVolunteer = apiReg.type === "Volunteer";
    return {
      id: apiReg.id,
      eventName: apiReg.eventName || (isVolunteer ? "Tình nguyện viên" : "Hiến máu"),
      date: formatDate(apiReg.eventDate || apiReg.startDate),
      time: "", // API does not provide time, leave blank or parse if available
      location: apiReg.facilityName,
      type: isVolunteer ? "volunteer" : "normal",
      registeredDate: formatDate(apiReg.registerDate),
      volunteerDate: isVolunteer ? formatDate(apiReg.eventDate || apiReg.startDate) : undefined,
    };
  };

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await authenApi.get<ApiResponse<ApiRegistration[]>>('/api/event-registration-history');
        if (response.data.isSuccess) {
          const transformed = response.data.data.map(transformApiRegistration);
          setRegistrations(transformed);
          // Set volunteerDates state for volunteer registrations
          const volunteerDatesObj: Record<number, Date | null> = {};
          transformed.forEach(reg => {
            if (reg.type === "volunteer" && reg.volunteerDate) {
              const [day, month, year] = reg.volunteerDate.split("/").map(Number);
              volunteerDatesObj[reg.id] = new Date(year, month - 1, day);
            } else {
              volunteerDatesObj[reg.id] = null;
            }
          });
          setVolunteerDates(volunteerDatesObj);
        } else {
          setError(response.data.message || "Failed to fetch registration history");
        }
      } catch (err) {
        const error = err as AxiosError<ApiResponse<null>>;
        setError(error.response?.data?.message || error.message || "Error fetching registration history");
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const openEditModal = (reg: Registration) => {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-2xl shadow-2xl p-0 overflow-hidden mt-8"
    >
      <div className="flex items-center gap-3 bg-[#C14B53] py-6 px-6">
        <FaClipboardList className="text-white text-2xl" />
        <h2 className="text-xl font-bold text-white">Lịch đăng ký hiến máu</h2>
      </div>
      <div className="border-b border-gray-200 my-0" />
      {registrations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FaRegCalendarCheck className="text-5xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Bạn chưa đăng ký tham gia sự kiện hiến máu nào.</p>
        </div>
      ) : (
        <div className="space-y-6 p-6">
          {registrations.map((reg) => (
            <motion.div
              key={reg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              layout
              className="border rounded-xl p-4 shadow-sm hover:shadow-lg transition-shadow bg-white flex flex-col gap-2 relative"
            >
              <div className="flex items-center gap-3 mb-2">
                <FaUserFriends className="text-[#C14B53] text-lg" />
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${reg.type === 'volunteer' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{reg.type === 'volunteer' ? 'Tình nguyện viên' : 'Thường'}</span>
              </div>
              <h3 className="font-bold text-lg text-[#C14B53] flex items-center gap-2 mb-2"><FaClipboardList className="text-[#C14B53]" />{reg.eventName}</h3>
              <div className="flex flex-col gap-2 mt-1 mb-2">
                <div className="flex items-center gap-2 text-gray-600 text-sm"><FaCalendarAlt /> <span><span className="font-medium">Ngày diễn ra:</span> {reg.date} ({reg.time})</span></div>
                <div className="flex items-center gap-2 text-gray-600 text-sm"><FaMapMarkerAlt /> <span><span className="font-medium">Địa điểm:</span> {reg.location}</span></div>
                <div className="flex items-center gap-2 text-gray-600 text-sm"><FaCalendarAlt /> <span><span className="font-medium">Ngày đăng ký:</span> {reg.registeredDate}</span></div>
                {reg.type === "volunteer" && (
                  <div className="flex items-center gap-2 text-blue-700 text-sm"><FaCalendarAlt /> <span><span className="font-medium">Ngày TN:</span> {volunteerDates[reg.id]?.toLocaleDateString("en-GB") || reg.date}</span></div>
                )}
              </div>
              <div className="flex gap-2 mt-2 justify-end">
                {reg.type === "volunteer" && (
                  <button
                    onClick={() => openEditModal(reg)}
                    className="p-3 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer text-lg shadow-sm active:scale-95"
                    title="Chỉnh sửa ngày tình nguyện"
                    aria-label="Chỉnh sửa ngày tình nguyện"
                  >
                    <FaRegEdit />
                  </button>
                )}
                <button
                  onClick={() => openCancelModal(reg.id)}
                  className="p-3 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer text-lg shadow-sm active:scale-95"
                  title="Hủy đăng ký"
                  aria-label="Hủy đăng ký"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
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
              className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-blue-600 flex flex-col items-center justify-center py-6 px-4">
                <FaRegEdit className="text-white text-3xl mb-2" />
                <h3 className="text-xl font-bold text-center text-white">Chỉnh sửa ngày tình nguyện</h3>
              </div>
              <div className="border-b border-gray-200 my-0" />
              <div className="p-6">
                <DatePicker
                  value={tempVolunteerDate}
                  onChange={date => setTempVolunteerDate(date as Date)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Chọn ngày tình nguyện"
                />
                {showDateError && <span className="text-red-500 text-xs flex items-center mt-2"><FaTimesCircle className="mr-1" />Vui lòng chọn ngày hợp lệ</span>}
                <div className="flex gap-4 justify-end mt-6">
                  <button
                    type="button"
                    onClick={closeAllModals}
                    className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDate}
                    className="px-8 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 flex items-center gap-2"
                  >
                    <FaCheckCircle />
                    Lưu
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Cancel Registration Modal */}
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
              className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-red-600 flex flex-col items-center justify-center py-6 px-4">
                <FaTrash className="text-white text-3xl mb-2" />
                <h3 className="text-xl font-bold text-center text-white">Xác nhận hủy đăng ký</h3>
              </div>
              <div className="border-b border-gray-200 my-0" />
              <div className="p-6">
                <p className="text-gray-700 mb-4 flex items-center gap-2"><FaInfoCircle className="text-red-500" />Bạn có chắc chắn muốn hủy đăng ký sự kiện này không?</p>
                <div className="flex gap-4 justify-end mt-6">
                  <button
                    type="button"
                    onClick={closeAllModals}
                    className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCancel}
                    className="px-8 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all duration-200 flex items-center gap-2"
                  >
                    <FaTrash />
                    Xác nhận
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Success/Feedback Modals */}
      <FeedbackModal
        isOpen={showSaveSuccess}
        onClose={() => setShowSaveSuccess(false)}
        title="Cập nhật thành công"
        message="Ngày tình nguyện đã được cập nhật."
        type="success"
      />
      <FeedbackModal
        isOpen={showCancelSuccess}
        onClose={() => setShowCancelSuccess(false)}
        title="Hủy đăng ký thành công"
        message="Bạn đã hủy đăng ký sự kiện thành công."
        type="success"
      />
    </motion.div>
  );
};

export default RegistrationComponent;