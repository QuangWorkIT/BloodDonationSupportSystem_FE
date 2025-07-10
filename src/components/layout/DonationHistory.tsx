import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";



interface Donation {
  date: string;
  type: string;
  facility: string;
  address: string;
  status: "Hoàn thành" | "Thất bại";
  amount?: string;
  reason?: string;
}

interface DonationDetailsModalProps {
  donation: Donation | null;
  isOpen: boolean;
  onClose: () => void;
}

// Feedback Modal Component

// Donation Details Modal Component
const DonationDetailsModal: React.FC<DonationDetailsModalProps> = ({ 
  donation, 
  isOpen, 
  onClose 
}) => {
  if (!donation) return null;

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
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-center mb-4 text-[#C14B53]">Chi tiết lần hiến máu</h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-base text-gray-500">Ngày hiến máu</p>
                <p className="font-medium">{donation.date}</p>
              </div>
              
              <div>
                <p className="text-base text-gray-500">Loại máu hiến</p>
                <p className="font-medium">{donation.type}</p>
              </div>
              
              <div>
                <p className="text-base text-gray-500">Cơ sở</p>
                <p className="font-medium">{donation.facility}</p>
              </div>
              
              <div>
                <p className="text-base text-gray-500">Địa chỉ</p>
                <p className="font-medium">{donation.address}</p>
              </div>
              
              <div>
                <p className="text-base text-gray-500">Trạng thái</p>
                <p className={`font-medium ${
                  donation.status === "Hoàn thành" ? "text-green-600" : "text-red-600"
                }`}>
                  {donation.status}
                </p>
              </div>
              
              <div>
                <p className="text-base text-gray-500">Mô tả</p>
                <p className="font-medium">
                  {donation.status === "Hoàn thành" 
                    ? `Đã hiến thành công ${donation.amount || '350ml'} máu`
                    : donation.reason || "Không đủ điều kiện sức khỏe để hiến máu"}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#C14B53] text-white rounded-md hover:opacity-90 cursor-pointer"
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

// Main Donation History Component
const DonationHistory: React.FC = () => {
  const donations: Donation[] = [
    {
      date: "01 / 01 / 2024",
      type: "Toàn phần",
      facility: "Viện Huyết học - Truyền máu Trung ương",
      address: "14 Trần Thái Tông, Cầu Giấy, Hà Nội",
      status: "Hoàn thành",
      amount: "350ml"
    },
    {
      date: "13 / 05 / 2024",
      type: "Huyết tương",
      facility: "Bệnh viện Bạch Mai",
      address: "78 Giải Phóng, Đống Đa, Hà Nội",
      status: "Thất bại",
      reason: "Huyết áp không ổn định"
    },
    {
      date: "18 / 08 / 2024",
      type: "Toàn phần",
      facility: "Bệnh viện Hữu nghị Việt Đức",
      address: "40 Tràng Thi, Hoàn Kiếm, Hà Nội",
      status: "Hoàn thành",
      amount: "450ml"
    },
    {
      date: "12 / 03 / 2025",
      type: "Tiểu cầu",
      facility: "Bệnh viện Đa khoa Xanh Pôn",
      address: "12 Chu Văn An, Ba Đình, Hà Nội",
      status: "Thất bại",
      reason: "Nồng độ hemoglobin thấp"
    },
  ];

  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleDetailsClick = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowDetailsModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-md shadow-md p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-[#C14B53]">Lịch sử hiến máu</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                Loại máu hiến
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">Cơ sở</th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donations.map((donation, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{donation.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{donation.type}</td>
                <td className="px-6 py-4 text-base text-gray-900">{donation.facility}</td>
                <td className="px-6 py-4 whitespace-nowrap text-base">
                  <span className={`px-2 py-1 rounded-full text-base font-medium ${
                    donation.status === "Hoàn thành" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {donation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900 ">
                  <button
                    onClick={() => handleDetailsClick(donation)}
                    className="text-[#C14B53] hover:underline cursor-pointer"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DonationDetailsModal 
        donation={selectedDonation} 
        isOpen={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)} 
      />
    </motion.div>
  );
};

export default DonationHistory;
