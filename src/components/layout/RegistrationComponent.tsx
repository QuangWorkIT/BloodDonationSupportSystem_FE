/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "../ui/datepicker";
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
   
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [tempVolunteerDate, setTempVolunteerDate] = useState<Date | null>(null);
  const [registrationToCancel, setRegistrationToCancel] = useState<number | null>(null);

  const openEditModal = (reg: unknown) => {
    setSelectedRegistration(reg);
    setTempVolunteerDate(volunteerDates[(reg as any).id] || parseDateString((reg as any).date));
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

export default RegistrationComponent;