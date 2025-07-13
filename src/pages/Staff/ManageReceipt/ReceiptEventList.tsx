import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { Users2, CalendarDays } from "lucide-react";
import StandardReceiptForm from "../StandardReceiptRequest/StandardReceiptForm";
import api, { authenApi } from "@/lib/instance";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";


interface Event {
  id: number;
  title: string;
  eventTime: string;
  time: string;
  bloodType: string;
  bloodRegisCount: number;
  maxOfDonor: number;
  isUrgent: boolean;
  estimateVolume: number
}

const ReceiptEventList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateDonationFormOpen, setCreateDonationFormOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleCancelClick = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  // fetch events
  const fetchEvents = async () => {
    try {
      const response = await api.get('/api/events')
      const data = response.data

      if (data.isSuccess) {
        console.log('Receive events ', data.data.items)
        setEvents(data.data.items)
      } else {
        console.log('Event data status is wrong')
      }
    } catch (error) {
      console.log('Failed to fetch event', error)
    }
  };

  const handleConfirmCancel = async () => {
    try {
      setIsDeleting(true)
      const response = await authenApi.put(`/api/events/${selectedEvent?.id}/deactive`)
      if (response.status === 200) {
        toast.success('Hủy sự kiện thành công')
        await fetchEvents()
      }
    } catch (error) {
      console.log('Fail to cancel event ', error)
      toast.error('Hủy sự kiện thất bại')
    } finally {
      setIsDeleting(false)
      setShowModal(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const renderPagination = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

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
    <div className="container flex flex-col gap-4 bg-gray-200 rounded-xl px-4 py-8 m-4">
      {isCreateDonationFormOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
          >
            <StandardReceiptForm onCick={() => setCreateDonationFormOpen(false)} />
          </motion.div>
        </AnimatePresence>
      )}
      {/* Events list */}
      {!isCreateDonationFormOpen && (
        <>
          <div className="mb-4 flex justify-between">
            <h2 className="text-3xl font-medium text-gray-800 ml-2">Các sự kiện hiến máu</h2>
            <button
              onClick={() => setCreateDonationFormOpen(true)}
              className="bg-blue-300 hover:bg-blue-500 text-gray-700 px-4 py-2 rounded-md text-lg flex items-center gap-2
              cursor-pointer transition-all duration-300 ease-in-out hover:text-white">
              <CalendarDays className="w-5" />
              Tạo sự kiện hiến máu
            </button>
          </div>
          <div className="space-y-6 mt-5">
            {currentEvents.map((event: Event, index) => (
              <motion.div
                key={event.id}
                className="bg-white rounded-md shadow-md overflow-hidden border border-gray-200 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <div className="flex flex-col items-center md:flex-row p-6">
                  <div className="w-16 h-16 bg-[#C14B53] rounded-full flex items-center justify-center mr-6 mb-4 md:mb-0 shadow-sm">
                    <FaHeart className="text-white text-xl" />
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-5">
                      <h3 className="text-2xl text-[#ba3f3f] font-semibold mb-5 hover:underline w-max">
                        <Link to={`/staff/receipt/list/${event.id}`}>
                          {event.title}
                        </Link>
                      </h3>
                      {event.isUrgent && (
                        <Button className="bg-[#AA3939] hover:bg-[#ba3f3f] font-bold">Nguy cấp</Button>
                      )}
                    </div>
                    <p className="text-lg text-gray-600 mb-5">
                      Địa chỉ: <span className="font-semibold text-black">387 Đ. Lê Văn Việt, Tăng Nhơn Phú A, Thủ Đức, Hồ Chí Minh</span>
                    </p>
                    <p className="text-lg text-gray-600 mb-5">
                      Thời gian hoạt động: <span className="font-semibold text-black">{event.eventTime}</span>,
                      từ  <span className="font-semibold text-black">7:00</span> đến <span className="font-semibold text-black">17:00</span>
                    </p>
                    <p className="text-lg text-gray-600">
                      Ưu tiên nhóm máu: <span className="font-semibold text-black">{event.bloodType ? event.bloodType : "A, B, AB, O"}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-center mt-4 md:mt-0">
                    <div className="flex gap-1 font-semibold mb-2">
                      <Users2 className="w-4" />
                      Người đăng ký
                    </div>
                    <span className="text-red-700 font-medium text-2xl mb-[64px]">
                      {event.bloodRegisCount ? event.bloodRegisCount : 0} / {event.maxOfDonor}
                    </span>
                    <motion.button
                      disabled={isDeleting}
                      className="bg-[#C14B53] text-white text-xl font-semibold px-6 py-2 rounded-md hover:bg-[#a83a42] transition cursor-pointer shadow-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCancelClick(event)}
                    >
                      Huỷ sự kiện
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {renderPagination()}
          </motion.div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full relative top-20 left-[33%]">
            <div className="flex justify-between mb-2">
              <h2 className="ml-2 text-[27px] font-normal mb-2">Xác nhận hủy sự kiện</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="text-gray-500 size-4 mt-3 cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>

            <div className="h-[1px] bg-gray-200 mb-4"></div>

            <p className="text-lg text-gray-600 mb-4">
              Nếu bạn xác nhận hủy sự kiện này, các đơn yêu cầu tiếp theo cũng sẽ bị hủy. <span className="text-red-700">Không thể hoàn tác thao tác này.</span>
            </p>
            <div className="flex justify-end">
              <button
                disabled={isDeleting}
                onClick={handleConfirmCancel}
                className="px-5 py-2 text-white bg-red-700 rounded-md hover:bg-red-800 cursor-pointer ">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptEventList;
