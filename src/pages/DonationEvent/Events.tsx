import { useState, useEffect } from "react";
import { FaCalendarAlt, FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import VolunteerForm from "./VolunteerForm";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/instance";

interface Event {
  id: number;
  title: string;
  address: string;
  eventTime: string;
  bloodType: string;
  bloodComponent: string;
  registered: number;
  maxOfDonor: number;
  isUrgent: boolean;
  estimateVolume: number
}
const Events = () => {
  const [activeTab, setActiveTab] = useState("donation-events");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      // const response = await fetch("https://6846eafc7dbda7ee7ab0dd85.mockapi.io/event");
      // const data = await response.json();
      // setEvents(data);
      try {
        const response = await api.get('/api/events')
        const data = response.data

        if (data.isSuccess) {
          console.log('Receive events ', data.data.items)
          setEvents(data.data.items)
        }else {
          console.log('Event data status is wrong')
        }
      } catch (error) {
        console.log('Failed to fetch event', error)
      }
    };

    fetchEvents();
  }, []);

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  // Improved pagination controls
  const renderPagination = () => {
    let pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, and current page with ellipsis
      if (currentPage <= 3) {
        // Show first 3, ellipsis, last
        pages = [1, 2, 3, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        // Show first, ellipsis, last 3
        pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
      } else {
        // Show first, ellipsis, current-1, current, current+1, ellipsis, last
        pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
      }
    }

    return (
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`w-10 h-10 rounded-md flex items-center justify-center ${currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 border hover:bg-gray-50 cursor-pointer"
            }`}
        >
          <FaChevronLeft />
        </motion.button>

        {pages.map((page, index) =>
          page === "..." ? (
            <motion.span
              key={index}
              className="px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              ...
            </motion.span>
          ) : (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(parseInt(page.toString()))}
              className={`w-10 h-10 rounded-md ${currentPage === parseInt(page.toString())
                  ? "bg-[#C14B53] text-white cursor-pointer"
                  : "bg-white text-gray-700 border hover:bg-gray-50 cursor-pointer"
                }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {page}
            </motion.button>
          )
        )}
        <motion.button
          whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`w-10 h-10 rounded-md flex items-center justify-center ${currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 border hover:bg-gray-50 cursor-pointer"
            }`}
        >
          <FaChevronRight />
        </motion.button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation Toggle with animation */}
      <div className="flex justify-center mb-8">
        <motion.div
          className="flex bg-white rounded-full shadow-sm border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("donation-events")}
            className={`flex-1 px-6 py-2 text-sm font-medium cursor-pointer relative ${activeTab === "donation-events" ? "text-white" : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            {activeTab === "donation-events" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[#C14B53] z-0 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">Sự kiện hiến máu</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("register-volunteer")}
            className={`flex-1 px-6 py-2 text-sm font-medium cursor-pointer relative ${activeTab === "register-volunteer" ? "text-white" : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            {activeTab === "register-volunteer" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[#C14B53] z-0 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">Đăng ký tình nguyện viên</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Conditional Rendering of Events List or Volunteer Form */}
      <AnimatePresence mode="wait">
        {activeTab === "donation-events" ? (
          <motion.div
            key="donation-events"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Date Picker */}
            <motion.div
              className="bg-white rounded-md shadow-sm p-4 mb-8 border border-gray-200"
            >
              <h2 className="text-lg font-medium mb-4">Bạn muốn đặt lịch vào thời gian nào?</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center border rounded-md p-2 flex-1">
                  <FaCalendarAlt className="text-gray-400 mr-2" />
                  <input type="text" placeholder="dd / MM / yyyy" className="w-full focus:outline-none" />
                </div>
                <div className="flex items-center border rounded-md p-2 flex-1">
                  <FaCalendarAlt className="text-gray-400 mr-2" />
                  <input type="text" placeholder="dd / MM / yyyy" className="w-full focus:outline-none" />
                </div>
                <motion.button
                  className="bg-[#C14B53] text-white px-6 py-2 rounded-md hover:bg-[#a83a42] transition cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Tìm kiếm
                </motion.button>
              </div>
            </motion.div>

            {/* Events List with shadow boxing */}
            <div className="space-y-6 mb-8">
              {currentEvents.map((event: Event, index) => (
                <motion.div
                  key={event.id}
                  className="bg-white rounded-md shadow-md overflow-hidden border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex flex-col md:flex-row p-6">
                    {/* Logo */}
                    <motion.div
                      className="w-16 h-16 bg-[#C14B53] rounded-full flex items-center justify-center mr-6 mb-4 md:mb-0 shadow-sm"
                      whileHover={{ rotate: 10 }}
                    >
                      <FaHeart className="text-white text-xl" />
                    </motion.div>

                    {/* Event Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-1">Địa chỉ của cơ sở y tế</p>
                      <p className="text-gray-600 mb-1">
                        Thời gian hoạt động: {event.eventTime}, từ 7:00 đến 17:00
                      </p>
                      <p className="text-gray-600">Ưu tiên người hiến có nhóm máu: <span>{event.bloodType ? event.bloodType : "A, B, AB, O"}</span></p>
                    </div>

                    {/* Registration */}
                    <div className="flex flex-col items-end mt-4 md:mt-0">
                      <div className="text-sm text-gray-600 mb-2">
                        Số người đã đăng ký: {event.registered ? event.registered : 0} / {event.maxOfDonor}
                      </div>
                      <motion.button
                        className="bg-[#C14B53] text-white px-6 py-2 rounded-md hover:bg-[#a83a42] transition cursor-pointer shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Đăng ký
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {renderPagination()}
            </motion.div>
          </motion.div>
        ) : (
          // Render the VolunteerForm when the volunteer tab is active
          <motion.div
            key="register-volunteer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <VolunteerForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
