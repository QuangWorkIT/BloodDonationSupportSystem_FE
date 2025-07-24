import { motion } from "framer-motion";
import {
  FaHeartbeat,
  FaClock,
  FaTint,
  FaUserInjured,
  FaHospital,
  FaCalendarAlt,
  FaRulerHorizontal,
} from "react-icons/fa";
import { authenApi } from "@/lib/instance";
import { useEffect, useState } from "react";

interface UrgentEventApiResponse {
  eventId: number;
  title: string;
  estimatedVolume: number;
  bloodTypeName: string;
  eventTime: string;
  createAt: string;
  distance: number;
}

const UrgentEvents = () => {
  const [urgentRequests, setUrgentRequests] = useState<UrgentEventApiResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrgentEvents = async () => {
      try {
        setLoading(true);
        const response = await authenApi.get("/api/events/urgent");
        if (Array.isArray(response.data.data)) {
          setUrgentRequests(response.data.data);
        } else {
          setUrgentRequests([]);
        }
      } catch {
        setUrgentRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUrgentEvents();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-[#F9F1F1] to-[#F5E8E8] px-6 py-5 border-b border-gray-200">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Yêu cầu khẩn cấp</h1>
              <p className="text-gray-600">Những bệnh nhân này đang cần hiến máu gấp. Bạn có thể giúp đỡ?</p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} className="mt-3 sm:mt-0">
              <div className="bg-[#C14B53] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                Tổng số yêu cầu: {urgentRequests.length}
              </div>
            </motion.div>
          </motion.div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C14B53]"></div>
            </div>
          ) : urgentRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <FaUserInjured className="text-5xl mb-3 text-red-500" />
              <div>Không có ca nguy cấp nào gần bạn</div>
            </div>
          ) : (
            <div className="space-y-5">
              {urgentRequests.map((request) => (
                <motion.div
                  key={request.eventId}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-[#C14B53]/30 hover:shadow-lg transition-shadow duration-300 ring-1 ring-[#C14B53]/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -3, scale: 1.01 }}
                >
                  <div className="p-5 flex flex-col md:flex-row gap-5 items-start">
                    {/* Blood type badge */}
                    <div className="flex-shrink-0">
                      <motion.div
                        className={`rounded-full bg-[#C14B53] text-white p-3 flex flex-col items-center justify-center shadow-md w-16 h-16 border-4 border-white`}
                        whileHover={{ scale: 1.08 }}
                      >
                        <FaTint className="text-2xl mb-1" />
                        <span className="font-bold text-lg">{request.bloodTypeName}</span>
                      </motion.div>
                    </div>

                    {/* Request details */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-[#C14B53] truncate flex items-center gap-2">
                          <FaHospital className="inline-block mr-1 text-[#C14B53]" />
                          {request.title}
                        </h3>
                        <span
                          className={`bg-[#C14B53] text-white text-xs px-2.5 py-1 rounded-full whitespace-nowrap ml-2`}
                        >
                          Khẩn cấp
                        </span>
                      </div>

                      {/* Two rows of details: top and bottom */}
                      <div className="flex flex-col gap-2 text-gray-600">
                        <div className="flex flex-wrap gap-6">
                          <div className="flex items-center gap-2">
                            <FaHeartbeat className="text-[#C14B53]" />
                            <span>
                              Số đơn vị máu: <strong>{request.estimatedVolume}</strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-[#C14B53]" />
                            <span>Ngày hiến máu: {request.eventTime}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-6">
                          <div className="flex items-center gap-2">
                            <FaClock className="text-[#C14B53]" />
                            <span>Đăng: {new Date(request.createAt).toLocaleString("vi-VN")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaRulerHorizontal className="text-[#C14B53]" />
                            <span>Khoảng cách: {request.distance} km</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0 flex items-center justify-center">
                      <motion.button
                        className="w-full md:w-auto bg-[#C14B53] text-white px-6 py-2 rounded-md hover:bg-[#a83a42] transition cursor-pointer shadow-sm flex items-center justify-center font-semibold text-base gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaUserInjured className="mr-2 text-lg" />
                        <span>Phản hồi ngay</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {/* Critical notice */}
          <motion.div
            className="mt-8 p-4 bg-red-50 border-l-4 border-[#C14B53] text-gray-700 rounded-r-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="font-medium text-[#C14B53]">Lưu ý quan trọng:</p>
            <p>
              Các yêu cầu máu nhóm O- luôn được ưu tiên hàng đầu vì đây là nhóm máu có thể truyền được cho tất cả các
              nhóm máu khác trong trường hợp khẩn cấp.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default UrgentEvents;
