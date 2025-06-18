import React from "react";
import { motion } from "framer-motion";
import Modal from "./Modal";

const DonationHistory = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const donations = [
    {
      date: "01 / 01 / 2024",
      type: "Toàn phần",
      facility: "Viện Huyết học - Truyền máu Trung ương",
      address: "14 Trần Thái Tông, Cầu Giấy, Hà Nội",
    },
    {
      date: "13 / 05 / 2024",
      type: "Huyết tương",
      facility: "Bệnh viện Bạch Mai",
      address: "78 Giải Phóng, Đống Đa, Hà Nội",
    },
    {
      date: "18 / 08 / 2024",
      type: "Toàn phần",
      facility: "Bệnh viện Hữu nghị Việt Đức",
      address: "40 Tràng Thi, Hoàn Kiếm, Hà Nội",
    },
    {
      date: "12 / 03 / 2025",
      type: "Tiểu cầu",
      facility: "Bệnh viện Đa khoa Xanh Pôn",
      address: "12 Chu Văn An, Ba Đình, Hà Nội",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-md shadow-md p-6"
    >
      <h2 className="text-xl font-bold mb-6 text-[#C14B53]">Lịch sử hiến máu</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại máu hiến
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cơ sở</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donations.map((donation, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.type}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{donation.facility}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{donation.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-[#C14B53] text-white px-6 py-2 rounded-md hover:bg-[#a83a42] transition cursor-pointer"
          onClick={() => setIsDetailModalOpen(true)}
        >
          Xem chi tiết
        </motion.button>
      </div>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Chi tiết lịch sử hiến máu"
      >
        <div className="space-y-4">
          {donations.map((donation, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <h4 className="font-bold text-[#C14B53]">{donation.facility}</h4>
              <p className="text-gray-600">Ngày: {donation.date}</p>
              <p className="text-gray-600">Loại hiến máu: {donation.type}</p>
              <p className="text-gray-600">Địa chỉ: {donation.address}</p>
            </div>
          ))}
        </div>
      </Modal>
    </motion.div>
  );
};

export default DonationHistory;