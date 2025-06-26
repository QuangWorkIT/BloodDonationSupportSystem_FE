import { motion } from "framer-motion";
import { FaHeartbeat, FaMapMarkerAlt, FaClock, FaTint } from "react-icons/fa";

interface UrgentRequest {
  id: number;
  bloodType: string;
  hospital: string;
  location: string;
  requiredUnits: number;
  postedTime: string;
  distance: string;
  priority: "critical" | "urgent" | "normal";
}

const UrgentEvents = () => {
  // Sample data - in a real app, this would come from an API
  const urgentRequests: UrgentRequest[] = [
    {
      id: 1,
      bloodType: "O-",
      hospital: "Bệnh viện Trung ương",
      location: "ICU, Tầng 3",
      requiredUnits: 3,
      postedTime: "2 giờ trước",
      distance: "1.2 km",
      priority: "critical",
    },
    {
      id: 2,
      bloodType: "B+",
      hospital: "Bệnh viện Đa khoa Huyện",
      location: "Khoa Cấp cứu",
      requiredUnits: 2,
      postedTime: "5 giờ trước",
      distance: "3.5 km",
      priority: "urgent",
    },
    {
      id: 3,
      bloodType: "AB+",
      hospital: "Trung tâm Y tế Cộng đồng",
      location: "Khoa Phẫu thuật",
      requiredUnits: 1,
      postedTime: "1 ngày trước",
      distance: "5.8 km",
      priority: "normal",
    },
  ];

  const getPriorityColor = (priority: UrgentRequest["priority"]): string => {
    switch (priority) {
      case "critical":
        return "bg-[#C14B53]";
      case "urgent":
        return "bg-[#E67E22]";
      default:
        return "bg-[#3498DB]";
    }
  };

  const getPriorityText = (priority: UrgentRequest["priority"]): string => {
    switch (priority) {
      case "critical":
        return "Khẩn cấp";
      case "urgent":
        return "Cấp bách";
      default:
        return "Bình thường";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Main shadow box container */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header section with subtle gradient */}
        <div className="bg-gradient-to-r from-[#F9F1F1] to-[#F5E8E8] px-6 py-5 border-b border-gray-200">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Yêu cầu khẩn cấp</h1>
              <p className="text-gray-600">
                Những bệnh nhân này đang cần hiến máu gấp. Bạn có thể giúp đỡ?
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mt-3 sm:mt-0"
            >
              <div className="bg-[#C14B53] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                Tổng số yêu cầu: {urgentRequests.length}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Content area */}
        <div className="p-6">
          <div className="space-y-5">
            {urgentRequests.map((request) => (
              <motion.div
                key={request.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -3 }}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row gap-5 items-start">
                    {/* Blood type badge */}
                    <div className="flex-shrink-0">
                      <motion.div
                        className={`rounded-full ${getPriorityColor(
                          request.priority
                        )} text-white p-3 flex flex-col items-center justify-center shadow-md w-16 h-16`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <FaTint className="text-2xl mb-1" />
                        <span className="font-bold text-lg">{request.bloodType}</span>
                      </motion.div>
                    </div>

                    {/* Request details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800 truncate">
                          {request.hospital}
                        </h3>
                        <span
                          className={`${getPriorityColor(
                            request.priority
                          )} text-white text-xs px-2.5 py-1 rounded-full whitespace-nowrap`}
                        >
                          {getPriorityText(request.priority)}
                        </span>
                      </div>

                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-[#C14B53] flex-shrink-0" />
                          <span className="truncate">{request.location}</span>
                        </div>
                        <div className="flex items-center">
                          <FaHeartbeat className="mr-2 text-[#C14B53] flex-shrink-0" />
                          <span>Số đơn vị máu cần: <strong>{request.requiredUnits}</strong></span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          <div className="flex items-center">
                            <FaClock className="mr-2 text-[#C14B53] flex-shrink-0" />
                            <span>Đăng: {request.postedTime}</span>
                          </div>
                          <div className="flex items-center">
                            <span>Khoảng cách: {request.distance}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                      <motion.button
                        className="w-full md:w-auto bg-[#C14B53] text-white px-6 py-2 rounded-md hover:bg-[#a83a42] transition cursor-pointer shadow-sm flex items-center justify-center"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Phản hồi ngay</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Critical notice */}
          <motion.div
            className="mt-8 p-4 bg-red-50 border-l-4 border-[#C14B53] text-gray-700 rounded-r-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="font-medium text-[#C14B53]">Lưu ý quan trọng:</p>
            <p>
              Các yêu cầu máu nhóm O- luôn được ưu tiên hàng đầu vì đây là nhóm máu
              có thể truyền được cho tất cả các nhóm máu khác trong trường hợp khẩn
              cấp.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default UrgentEvents;
