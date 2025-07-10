import { useState, useEffect } from "react";
import { FaHeart, FaSearch, FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { User2Icon, CalendarDays } from "lucide-react";
import { authenApi } from "@/lib/instance";
import type { AxiosError } from "axios";
import LoadingSpinner from "@/components/layout/Spinner";
import { formatDateTime } from "@/utils/format";
import StaffCheckoutReceiptForm from "../CheckoutReceipt/StaffCheckoutReceiptForm";

interface Event {
  id: number;
  name: string;
  total: number;
  eventTime: string;
}

export interface Donor {
  id: number;
  fullName: string;
  isHealth: boolean;
  bloodTypeName: string;
  performedAt: string;
  bloodRegisId: number;
}

const BloodCollectEventList = () => {
  const defaultDonor = {
    id: -1,
    fullName: "undefined",
    isHealth: false,
    bloodTypeName: "undefined",
    performedAt: "",
    bloodRegisId: -1
  }
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;
  const [events, setEvents] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isFetchingEvent, setIsFetchingEvent] = useState(false)
  const [isBloodCollectFormOpen, setIsBloodCollectFormOpen] = useState(false)
  const [currentDonor, setCurrentDonor] = useState<Donor | null>(null)

  const fetchEvents = async () => {
    try {
      setIsFetchingEvent(true)
      const response = await authenApi.get('/api/events/waiting-for-blood-procedure')
      const data = response.data

      if (data.isSuccess) {
        console.log('fetch waiting donor events success! ', data.data)
        setEvents(data.data.items)
      }
    } catch (error) {
      const err = error as AxiosError
      if (err) {
        console.log('err axios fetch events ', err.message)
      } else {
        console.log('Error ', error)
      }
    } finally {
      setIsFetchingEvent(false)
    }
  }
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventDetail = async (event: Event) => {
    setSelectedEvent(event)
    try {
      const response = await authenApi.get(`/api/events/${event.id}/health-procedures`)
      const data = response.data

      if (data.isSuccess) {
        console.log('data ', data.data)
        setDonors(data.data.items)
      }
    } catch (error) {
      const err = error as AxiosError
      if (err.message)
        console.log('Error message ', err.message)
      else
        console.log('Error fetching donor ', error)
    }
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
            className={`w-10 h-10 rounded-md border cursor-pointer ${currentPage === page ? "bg-[#C14B53] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
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
            {isFetchingEvent ? (<LoadingSpinner />) : (
              currentEvents.length > 0 ? (
                currentEvents.map((event: Event, index) => (
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
                          Số người chờ lấy máu: <span className="font-semibold text-2xl">{event.total} người</span>
                        </p>
                      </div>
                      <div className="flex flex-col gap-4 items-end justify-between">
                        <p>Thời gian {event.eventTime}</p>
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
                ))
              ) : (<div className="flex w-full justify-center text-[20px] italic text-gray-600">
                Chưa có người hiến máu nào chờ được hiến máu.
              </div>)
            )}
          </div>

          <motion.div className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {renderPagination()}
          </motion.div>
        </div>
      ) : (
        // User list
        !isBloodCollectFormOpen ? (
          <div className="container flex flex-col gap-4 bg-gray-200 rounded-xl px-4 py-8 m-4">
            <div className="mb-4 flex justify-between">
              <h2 className="text-xl font-medium text-gray-700 ml-2">
                Sự kiện ngày<span className="font-semibold text-black text-2xl"> {selectedEvent.eventTime}</span>
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
                      <div className="text-2xl font-semibold">{donor.fullName}</div>
                      <div className="text-lg text-gray-600">
                        Tình trạng sức khỏe: <span className="text-black font-semibold">{donor.isHealth && "Tốt"}</span>
                      </div>
                      <div className="text-lg text-gray-600">
                        Loại máu: <span className="text-black font-semibold">{donor.bloodTypeName ? donor.bloodTypeName : "A"}</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-600">
                        Thời gian khám: <span className="text-black font-semibold">{formatDateTime(donor.performedAt)[0]}, {formatDateTime(donor.performedAt)[1]}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentDonor(donor)
                      setIsBloodCollectFormOpen(true)
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-xl text-white font-semibold px-4 py-2 rounded-md cursor-pointer">
                    Tiến hành lấy máu
                  </button>
                </motion.div>
              ))}
            </div>

            <motion.div className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              {renderPagination()}
            </motion.div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="flex-1 min-h-screen bg-gray-200 rounded-xl px-4 py-8 m-4"
            >
              <StaffCheckoutReceiptForm
                donor={currentDonor ? currentDonor : defaultDonor}
                setIsBloodCollectFormOpen={() => setIsBloodCollectFormOpen(false)}
                fetchEvents={fetchEvents}
              />
            </motion.div>
          </AnimatePresence>
        )
      )}
    </>
  );
};

export default BloodCollectEventList;
