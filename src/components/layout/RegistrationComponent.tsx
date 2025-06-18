import React, { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "./DatePicker";
import Modal from "./Modal";

type Registration = {
  id: number;
  eventName: string;
  date: string;
  time: string;
  location: string;
  type: string;
  registeredDate: string;
  volunteerDate?: string;
};

const RegistrationComponent = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([
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

  const [editingId, setEditingId] = useState<number | null>(null);
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

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [currentCancelId, setCurrentCancelId] = useState<number | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleCancelClick = (id: number) => {
    setCurrentCancelId(id);
    setIsCancelModalOpen(true);
  };

  const confirmCancel = () => {
    if (currentCancelId) {
      setRegistrations(prev => prev.filter(reg => reg.id !== currentCancelId));
      setIsCancelModalOpen(false);
      setIsSuccessModalOpen(true);
    }
  };

  const handleDateChange = (id: number, date: Date | null) => {
    setVolunteerDates(prev => ({ ...prev, [id]: date }));
  };

  const handleSaveDate = (id: number) => {
    if (!volunteerDates[id]) {
      return;
    }
    
    setEditingId(null);
    setIsSuccessModalOpen(true);
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
                      {editingId === reg.id ? (
                        <div className="flex items-center gap-2">
                          <DatePicker
                            value={volunteerDates[reg.id]}
                            onChange={(date: Date | null) => handleDateChange(reg.id, date)}
                            className="border rounded-md px-3 py-1"
                            minDate={parseDateString(reg.date)}
                            placeholderText="Chọn ngày tình nguyện"
                          />
                          <button
                            onClick={() => handleSaveDate(reg.id)}
                            className="bg-[#C14B53] text-white px-3 py-1 rounded-md text-sm hover:bg-[#a83a42]"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-600 px-3 py-1 rounded-md text-sm border hover:bg-gray-50"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <p className="text-gray-600">
                          <span className="font-medium">Ngày tình nguyện:</span> {volunteerDates[reg.id]?.toLocaleDateString('en-GB') || reg.date}
                          <button
                            onClick={() => setEditingId(reg.id)}
                            className="ml-2 text-[#C14B53] text-sm hover:underline"
                          >
                            Chỉnh sửa
                          </button>
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleCancelClick(reg.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium ml-4"
                >
                  Hủy đăng ký
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Xác nhận hủy đăng ký"
        confirmText="Xác nhận"
        onConfirm={confirmCancel}
      >
        <p>Bạn có chắc chắn muốn hủy đăng ký sự kiện này?</p>
      </Modal>

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Thành công"
        confirmText="Đóng"
        onConfirm={() => setIsSuccessModalOpen(false)}
      >
        {currentCancelId ? (
          <p>Đã hủy đăng ký sự kiện thành công!</p>
        ) : (
          <p>Đã cập nhật ngày tình nguyện thành công!</p>
        )}
      </Modal>
    </motion.div>
  );
};

export default RegistrationComponent;