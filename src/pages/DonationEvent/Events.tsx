import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import VolunteerForm from "./VolunteerForm";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/instance";
import DonationRegisterForm from "./DonationRegisterForm";
import logo from "@/assets/images/image12.png";
import { Button } from "@/components/ui/button";

interface Event {
  id: number;
  title: string;
  address: string;
  eventTime: string;
  bloodType: string;
  bloodComponent: string;
  bloodRegisCount: number;
  maxOfDonor: number;
  isUrgent: boolean;
  estimateVolume: number;
}

const Events = () => {
  const [activeTab, setActiveTab] = useState("donation-events");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEventId, setCurrentEventId] = useState(0);
  const [currentEventTime, setCurrentEventTime] = useState("");
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isRegistrationFormOpen, setRegistraionFormOpen] = useState(false);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/api/events", {
          params: {
            pageNumber: 1,
            pageSize: 20,
          }
        });
        const data = response.data;

        if (data.isSuccess) {
          console.log("Receive events ", data.data.items);
          setEvents(data.data.items);
        } else {
          console.log("Event data status is wrong");
        }
      } catch (error) {
        console.log("Failed to fetch event", error);
      }
    };

    fetchEvents();
  }, []);

  // handle search event
  const handleSearchEventClick = () => {
    const dateFromDate = new Date(dateFrom);
    const dateToDate = new Date(dateTo);

    const searchEvents: Event[] = events.filter((event: Event) => {
      const currentEventDate = new Date(event.eventTime);
      return dateFromDate <= currentEventDate && currentEventDate <= dateToDate;
    });

    console.log(searchEvents);
    setEvents(searchEvents);
  };

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
          className={`w-10 h-10 rounded-md flex items-center justify-center ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 border hover:bg-gray-50 cursor-pointer"
            }`}
        >
          <FaChevronLeft />
        </motion.button>

        {pages.map((page, index) =>
          page === "..." ? (
            <motion.span key={index} className="px-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
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
          className={`w-10 h-10 rounded-md flex items-center justify-center ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 border hover:bg-gray-50 cursor-pointer"
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
      {isRegistrationFormOpen ? (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <DonationRegisterForm
              eventId={currentEventId}
              eventTime={currentEventTime}
              event={currentEvent}
              setRegistraionFormOpen={setRegistraionFormOpen}
            />
          </motion.div>
        </AnimatePresence>
      ) : (
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
              <motion.div className="bg-white rounded-md shadow-sm p-4 mb-8 border border-gray-200">
                <h2 className="text-lg font-medium mb-4">Bạn muốn đặt lịch vào thời gian nào?</h2>
                <div className="flex flex-col justify-center items-center md:flex-row gap-4">
                  <div className="w-full flex max-sm:gap-5 gap-3 items-center">
                    <p className="font-semibold">Từ ngày</p>
                    <div className="relative flex items-center border rounded-md p-2 flex-1">
                      <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full focus:outline-none" />
                    </div>
                  </div>
                  <div className="w-full flex gap-3 items-center">
                    <p className="font-semibold">đến ngày</p>
                    <div className="flex items-center border rounded-md p-2 flex-1">
                      <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full focus:outline-none" />
                    </div>
                  </div>
                  <motion.button
                    className="bg-[#C14B53] text-white px-6 py-2 rounded-md hover:bg-[#a83a42] transition cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSearchEventClick()}
                  >
                    Tìm kiếm
                  </motion.button>
                </div>
              </motion.div>

              {/* Events List with shadow boxing */}
              <div className="space-y-6 mb-8">
                {currentEvents.map((event: Event, index) => (
                  <motion.div
                    data-testid="event-item"
                    key={event.id}
                    className="bg-white rounded-md shadow-md overflow-hidden border border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex flex-col md:flex-row p-6">
                      {/* Logo */}
                      <img src={logo} className="size-24 mr-3" />

                      {/* Event Details */}
                      <div className="flex-1">
                        <div className="flex gap-5 items-center mb-2">
                          <h3 className="text-red-700 text-lg font-medium mb-2">{event.title}</h3>
                          {event.isUrgent && (
                            <Button className="bg-[#AA3939] hover:bg-[#ba3f3f] font-bold">
                              Nguy cấp
                            </Button>
                          )}
                        </div>
                        <p className="text-gray-600 mb-1">Địa chỉ: 387 Đ. Lê Văn Việt, Tăng Nhơn Phú A, Thủ Đức, Hồ Chí Minh</p>
                        <p className="text-gray-600 mb-1">
                          Thời gian hoạt động: <span className="font-semibold text-black">{event.eventTime}</span>, từ 7:00 đến 17:00
                        </p>
                        <p className="text-gray-600">
                          Ưu tiên người hiến có nhóm máu: <span className="font-semibold text-black">{event.bloodType ? event.bloodType : "A, B, AB, O"}</span>
                        </p>
                        {event.isUrgent && event.bloodType && event.bloodType !== "A, B, AB, O" && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-700 text-sm font-medium">
                              ⚠️ Sự kiện khẩn cấp chỉ chấp nhận nhóm máu: <span className="font-bold">{event.bloodType}</span>
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Registration */}
                      <div className="flex flex-col items-end mt-4 md:mt-0">
                        <div className="font-semibold mb-2">
                          Số người đã đăng ký:{" "}
                          <span className="text-red-700 text-lg">
                            {event.bloodRegisCount ? event.bloodRegisCount : 0} / {event.maxOfDonor}
                          </span>
                        </div>
                        <motion.button
                          className="bg-[#C14B53] text-white px-6 py-2 rounded-md hover:bg-[#a83a42] transition cursor-pointer shadow-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setCurrentEventTime(event.eventTime);
                            setCurrentEventId(event.id);
                            setCurrentEvent(event);
                            setRegistraionFormOpen(true);
                          }}
                        >
                          Đăng ký
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              <motion.div className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
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
              <VolunteerForm setActiveTab={() => setActiveTab("donation-events")}/>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Events;
