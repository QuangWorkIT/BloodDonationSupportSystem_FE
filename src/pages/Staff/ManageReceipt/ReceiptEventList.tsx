import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Users2, CalendarDays, PlusCircle, AlertTriangle, Building, Droplet } from "lucide-react";
import StandardReceiptForm from "../StandardReceiptRequest/StandardReceiptForm";
import api, { authenApi } from "@/lib/instance";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import eventLogo from '@/assets/images/image12.png';

interface Event {
  id: number;
  title: string;
  eventTime: string;
  time: string;
  bloodType: string;
  bloodRegisCount: number;
  maxOfDonor: number;
  isUrgent: boolean;
  estimateVolume: number;
}

const ReceiptEventList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateDonationFormOpen, setCreateDonationFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/api/events", { params: { pageSize: 100 } });
      if (response.data.isSuccess) {
        setEvents(response.data.data.items);
      }
    } catch (error) {
      console.log("Failed to fetch event", error);
    }
  };
  // Fetch all events at once
  useEffect(() => {
    fetchEvents();
  }, []);

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const handleConfirmCancel = async () => {
    if (!selectedEvent) return;
    setIsDeleting(true);
    try {
      const response = await authenApi.put(`/api/events/${selectedEvent.id}/deactive`);
      if (response.status === 200) {
        toast.success("Hủy sự kiện thành công");
        // Refetch all events to update the list
        const refetchResponse = await api.get("/api/events", { params: { pageSize: 100 } });
        if (refetchResponse.data.isSuccess) {
          setEvents(refetchResponse.data.data.items);
        }
      }
    } catch (error) {
      toast.error("Hủy sự kiện thất bại");
    } finally {
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  if (isCreateDonationFormOpen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <StandardReceiptForm
            onCick={() => setCreateDonationFormOpen(false)}
            fetchEvents={fetchEvents}
          />
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="bg-gray-50/50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Sự kiện hiến máu</h1>
            <p className="text-gray-500 mt-1">Quản lý và tạo các sự kiện hiến máu mới.</p>
          </div>
          <Button onClick={() => setCreateDonationFormOpen(true)} className="mt-4 sm:mt-0 cursor-pointer">
            <PlusCircle className="h-4 w-4 mr-2" />
            Tạo sự kiện mới
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentEvents.map((event) => (
            <motion.div
              key={event.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-6 flex-grow flex items-center gap-6">
                <img src={eventLogo} alt="Red Cross Logo" className="w-20 h-20 object-contain rounded-full border" />
                <div className="flex-1">
                  {event.isUrgent && (
                    <div className="flex items-center text-red-600 mb-2 font-semibold text-sm">
                      <AlertTriangle className="h-4 w-4 mr-1.5 animate-pulse" />
                      KHẨN CẤP
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-800 hover:text-red-700 transition-colors">
                    <Link to={`/staff/receipt/list/${event.id}`}>{event.title}</Link>
                  </h3>
                  <div className="mt-4 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-3 text-gray-400" />
                      <span>387 Đ. Lê Văn Việt, Tăng Nhơn Phú A, Thủ Đức</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-3 text-gray-400" />
                      <span>{new Date(event.eventTime).toLocaleDateString('vi-VN')} (7:00 - 17:00)</span>
                    </div>
                    <div className="flex items-center">
                      <Droplet className="h-4 w-4 mr-3 text-gray-400" />
                      <span>Ưu tiên nhóm máu: <span className="font-semibold text-gray-800">{event.bloodType || "Tất cả"}</span></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                  <Users2 className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="text-blue-600 font-bold">{event.bloodRegisCount || 0}</span>
                  <span className="text-gray-500">/{event.maxOfDonor} người</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                  onClick={() => { setSelectedEvent(event); setShowModal(true); }}
                >
                  Hủy
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Trang trước"
          >
            <FaChevronLeft />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="icon"
              className={`rounded-full w-8 h-8 ${currentPage === i + 1 ? 'bg-blue-600 text-white' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Trang sau"
          >
            <FaChevronRight />
          </Button>
        </div>
      </div>

      {showModal && selectedEvent && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">Xác nhận hủy sự kiện</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn hủy sự kiện "{selectedEvent.title}"? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                className="font-semibold cursor-pointer"
                onClick={() => setShowModal(false)}
                disabled={isDeleting}
              >
                Không
              </Button>
              <Button variant="destructive" className="font-semibold cursor-pointer" onClick={handleConfirmCancel} disabled={isDeleting}>
                {isDeleting ? "Đang hủy..." : "Có, hủy sự kiện"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ReceiptEventList;
