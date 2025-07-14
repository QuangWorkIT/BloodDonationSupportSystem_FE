import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { authenApi } from "@/lib/instance";
import { AxiosError } from "axios";

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

// Display Donation interface for the UI
interface Donation {
  registrationId: number;
  date: string;
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

// Helper function to format date from API format (YYYY-MM-DD) to display format (DD / MM / YYYY)
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day} / ${month} / ${year}`;
};

// Helper function to transform API data to display format
const transformApiDonation = (apiDonation: ApiDonation): Donation => {
  return {
    registrationId: apiDonation.registrationId,
    date: formatDate(apiDonation.donateDate),
    facility: apiDonation.facilityName,
    address: apiDonation.facilityAddress,
    status: apiDonation.status ? "Hoàn thành" : "Thất bại",
    amount: apiDonation.volume ? `${apiDonation.volume}ml` : undefined,
    reason: !apiDonation.status ? apiDonation.description : undefined,
  };
};

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
                <p className="text-base text-gray-500">Mã đăng ký</p>
                <p className="font-medium">#{donation.registrationId}</p>
              </div>
              
              <div>
                <p className="text-base text-gray-500">Ngày hiến máu</p>
                <p className="font-medium">{donation.date}</p>
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
  // State Management
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
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
          // Transform API data to display format
          const transformedDonations = response.data.data.map(transformApiDonation);
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

      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C14B53]"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
          <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <span className="text-red-700">×</span>
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">Mã ĐK</th>
                <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
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
              {donations.length > 0 ? (
                donations.map((donation) => (
                  <tr key={donation.registrationId}>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">#{donation.registrationId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{donation.date}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-base text-gray-500">
                    Không có lịch sử hiến máu nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <DonationDetailsModal 
        donation={selectedDonation} 
        isOpen={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)} 
      />
    </motion.div>
  );
};

export default DonationHistory;
