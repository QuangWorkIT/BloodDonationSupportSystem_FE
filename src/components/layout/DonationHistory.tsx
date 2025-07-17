import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { authenApi } from "@/lib/instance";
import { AxiosError } from "axios";
import { FaEye, FaTint, FaHashtag, FaCalendarAlt, FaMapMarkerAlt, FaHospital, FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

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
  status: "Hoàn thành" | "Đang diễn ra" | "Thất bại";
  amount?: string;
  description: string;
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
    date: formatDate(apiDonation.donateDate),
    facility: apiDonation.facilityName,
    address: apiDonation.facilityAddress,
    status: status,
    amount: apiDonation.volume ? `${apiDonation.volume}ml` : undefined,
    description: apiDonation.description,
  };
};

// Donation Details Modal Component
const DonationDetailsModal: React.FC<DonationDetailsModalProps> = ({ 
  donation, 
  isOpen, 
  onClose 
}) => {
  if (!donation) return null;

  const getStatusIcon = () => {
    switch (donation.status) {
      case "Hoàn thành":
        return <FaCheckCircle className="text-green-500 mr-2" />;
      case "Đang diễn ra":
        return <FaInfoCircle className="text-blue-500 mr-2" />;
      case "Thất bại":
        return <FaTimesCircle className="text-red-500 mr-2" />;
      default:
        return <FaInfoCircle className="text-gray-500 mr-2" />;
    }
  };

  const getStatusStyle = () => {
    switch (donation.status) {
      case "Hoàn thành":
        return "bg-green-100 text-green-800";
      case "Đang diễn ra":
        return "bg-blue-100 text-blue-800";
      case "Thất bại":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
            className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with accent bar and icon */}
            <div className="bg-[#C14B53] flex flex-col items-center justify-center py-6 px-4">
              <FaTint className="text-white text-4xl mb-2" />
              <h3 className="text-2xl font-bold text-center text-white">Chi tiết lần hiến máu</h3>
            </div>
            <div className="border-b border-gray-200 my-0" />
            {/* Details Card */}
            <div className="p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex items-center gap-3">
                <FaHashtag className="text-[#C14B53] text-lg" />
                <div>
                  <p className="text-base text-gray-500">Mã đăng ký</p>
                  <p className="font-medium">#{donation.registrationId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-[#C14B53] text-lg" />
                <div>
                  <p className="text-base text-gray-500">Ngày hiến máu</p>
                  <p className="font-medium">{donation.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaHospital className="text-[#C14B53] text-lg" />
                <div>
                  <p className="text-base text-gray-500">Cơ sở</p>
                  <p className="font-medium">{donation.facility}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-[#C14B53] text-lg" />
                <div>
                  <p className="text-base text-gray-500">Địa chỉ</p>
                  <p className="font-medium">{donation.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 col-span-1 md:col-span-2">
                {getStatusIcon()}
                <div>
                  <p className="text-base text-gray-500">Trạng thái</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-base font-medium ${getStatusStyle()}`}>
                    {donation.status}
                  </span>
                </div>
              </div>
              {donation.status === "Hoàn thành" && donation.amount && (
                <div className="flex items-center gap-3 col-span-1 md:col-span-2">
                  <FaTint className="text-[#C14B53] text-lg" />
                  <div>
                    <p className="text-base text-gray-500">Lượng máu hiến</p>
                    <p className="font-medium">{donation.amount}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 col-span-1 md:col-span-2">
                <FaInfoCircle className="text-[#C14B53] text-lg" />
                <div>
                  <p className="text-base text-gray-500">Mô tả</p>
                  <p className="font-medium">
                    {donation.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-0 flex justify-center bg-white pb-8">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#C14B53] text-white rounded-xl font-semibold text-lg hover:bg-[#a83a42] transition focus:outline-none focus:ring-2 focus:ring-[#C14B53] cursor-pointer shadow-md"
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
      className="pt-2"
    >
      <div className="flex items-center gap-3 bg-[#C14B53] py-6 px-6 rounded-t-2xl">
        <FaTint className="text-white text-2xl" />
        <h2 className="text-xl font-bold text-white">Lịch sử hiến máu</h2>
      </div>
      <div className="border-b border-gray-200 my-0" />

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
        <div className="overflow-x-auto rounded-2xl shadow-xl bg-white mt-0">
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-2xl overflow-hidden">
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
                          : donation.status === "Đang diễn ra"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900 ">
                      <button
                        onClick={() => handleDetailsClick(donation)}
                        className="text-[#C14B53] hover:bg-[#f8e6ea] p-2 rounded-full transition cursor-pointer"
                        aria-label="Xem chi tiết"
                      >
                        <FaEye size={20} />
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
