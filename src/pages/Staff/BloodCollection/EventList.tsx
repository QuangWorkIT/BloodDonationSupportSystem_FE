import { useState, useEffect } from "react";
import { FaHeart, FaSearch, FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { User2Icon, CalendarDays } from "lucide-react";

interface Event {
  id: number;
  name: string;
  address: string;
  date: string;
  time: string;
  bloodTypes: string;
  registered: number;
  capacity: number;
}

interface Donor {
  id: number;
  name: string;
  healthStatus: string;
  bloodType: string;
  time: string;
}

const EventList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;
  const [events, setEvents] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("https://6846eafc7dbda7ee7ab0dd85.mockapi.io/event");
      const data = await response.json();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  const handleEventDetail = async (event: Event) => {
    setSelectedEvent(event);
    // Simulate fetching donors
    const dummyDonors = Array.from({ length: events.length }).map((_, i) => ({
      id: i + 1,
      name: "Nguyễn Văn A",
      healthStatus: "Tốt",
      bloodType: "A+",
      time: `${event.date}, 7:30 - 8:00`,
    }));
    setDonors(dummyDonors);
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const currentDonors = selectedEvent ? donors.slice(indexOfFirstEvent, indexOfLastEvent) : [];
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const totalDonorPages = Math.ceil(donors.length / eventsPerPage);

  const renderPagination = () => {
    const pages = !selectedEvent ? Array.from({ length: totalPages }, (_, i) => i + 1) : Array.from({ length: totalDonorPages }, (_, i) => i + 1);

    return (
      <div className="flex items-center space-x-2">
        {pages.map((page) => (
          <motion.button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-10 h-10 rounded-md border cursor-pointer ${
              currentPage === page ? "bg-[#C14B53] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {page}
          </motion.button>
        ))}
      </div>
    );
  };

  return (
    <>
      {!selectedEvent ? (
        // Events list
        <div className="container flex flex-col gap-4 bg-gray-200 rounded-xl px-4 py-8 m-4">
          <div className="mb-4 flex justify-between">
            <h2 className="text-3xl font-medium text-gray-800 ml-2">Các sự kiện nhận máu</h2>
            <div className="flex gap-4 items-center">
              <button className="bg-blue-200 hover:bg-blue-400 text-gray-700 px-4 py-2 rounded-md text-lg flex items-center gap-2 cursor-pointer">
                <CalendarDays className="w-5" />
                Tạo sự kiện hiến máu
              </button>
            </div>
          </div>

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
                <div className="flex flex-col items-center md:flex-row p-4">
                  <div className="w-16 h-16 bg-[#C14B53] rounded-full flex items-center justify-center mr-6 mb-4 md:mb-0 shadow-sm">
                    <FaHeart className="text-white text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl text-red-700 font-semibold mb-[20px]">{event.name}</h3>
                    <p className="text-black text-xl mb-1">
                      Số người chờ lấy máu: <span className="font-semibold text-2xl">{event.registered} người</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 items-end justify-between">
                    <p className="text-black italic text-xl mr-1">{event.date}</p>
                    <motion.button
                      className="bg-blue-500 text-white font-semibold text-xl px-8 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer shadow-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEventDetail(event)}
                    >
                      Chi tiết
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {renderPagination()}
          </motion.div>
        </div>
      ) : (
        // User list
        <div className="container flex flex-col gap-4 bg-gray-200 rounded-xl px-4 py-8 m-4">
          <div className="mb-4 flex justify-between">
            <h2 className="text-xl font-medium text-gray-700 ml-2">
              Sự kiện ngày: <span className="font-semibold text-black text-2xl">{selectedEvent.date}</span>
            </h2>
            <div className="ml-6 mr-2">
              <AnimatePresence mode="wait">
                {!showSearch ? (
                  <motion.button
                    key="search-button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowSearch(true)}
                    className="text-gray-700 hover:text-red-700 px-4 py-2 rounded-md text-lg cursor-pointer transition flex items-center gap-2"
                  >
                    <FaSearch size={18} />
                  </motion.button>
                ) : (
                  <motion.div
                    key="search-bar"
                    initial={{ x: 100, opacity: 0, width: 0 }}
                    animate={{ x: 0, opacity: 1, width: 400 }}
                    exit={{ x: 100, opacity: 0, width: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center bg-white px-6 py-2 rounded-md shadow-sm border border-gray-200 origin-right"
                  >
                    <input type="text" placeholder="Tìm kiếm người hiến..." className="w-full py-1 px-2 text-base focus:outline-none" autoFocus />
                    {/* do not use built in button */}
                    <button onClick={() => setShowSearch(false)} className="text-gray-600 hover:text-[#C14B53] cursor-pointer transition ml-4">
                      <FaTimes size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-4">
            {currentDonors.map((donor, index) => (
              <motion.div
                key={donor.id}
                className="bg-white rounded-md shadow-md overflow-hidden border border-gray-200 p-4 flex justify-between items-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 md:mb-0 shadow-sm">
                    <User2Icon className="text-2xl" />
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <div className="text-2xl font-semibold">{donor.name}</div>
                    <div className="text-lg text-gray-600">
                      Tình trạng sức khỏe: <span className="text-black font-semibold">{donor.healthStatus}</span>
                    </div>
                    <div className="text-lg text-gray-600">
                      Loại máu: <span className="text-black font-semibold">{donor.bloodType}</span>
                    </div>
                    <div className="text-lg font-semibold text-gray-600">
                      Thời gian khám: <span className="text-black font-semibold">{donor.time}</span>
                    </div>
                  </div>
                </div>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-xl text-white font-semibold px-4 py-2 rounded-md cursor-pointer">
                  Tiến hành lấy máu
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {renderPagination()}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default EventList;
