import DonorCard from "./DonorCard";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { authenApi } from "@/lib/instance";
import type { DonorCardProps } from "@/pages/Staff/ManageReceipt/DonorCard";
import LoadingSpinner from "@/components/layout/Spinner";
import HealthCheckForm from "./HealthCheckForm";
import { toast } from "react-toastify";
import { ArrowLeft, Search, UserPlus } from "lucide-react";

const searchSchema = z.object({
  searchContent: z.string(),
});

function DonorReceiptList() {
  const { eventId } = useParams();
  const [listOfDonor, setListOfDonor] = useState<DonorCardProps[]>([]);
  const [eventTime, setEventTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isHealthCheckout, setIsHealthCheckout] = useState(false);
  const [currentDonor, setCurrentDonor] = useState<DonorCardProps | null>(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentDonorId, setCurrentDonorId] = useState<number | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  const getDonors = async () => {
    setIsLoading(true);
    try {
      const response = await authenApi.get(`/api/events/${eventId}/blood-registrations`);
      if (response.data.isSuccess) {
        setEventTime(response.data.data.eventTime);
        setListOfDonor(response.data.data.items);
      }
    } catch (error) {
      console.log("Fail to fetch donors", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDonors();
  }, [eventId]);

  const handleReject = async () => {
    if (currentDonorId == null) return;
    setIsRejecting(true);
    try {
      const response = await authenApi.put(`/api/blood-registrations/${currentDonorId}/reject`);
      if (response.data.isSuccess) {
        toast.success("Đã từ chối đơn đăng ký hiến máu!");
        getDonors();
      }
    } catch (error) {
      toast.error("Lỗi từ chối đơn đăng ký hiến máu!");
    } finally {
      setIsRejecting(false);
      setIsShowModal(false);
      setCurrentDonorId(null);
    }
  };

  const searchForm = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: { searchContent: "" },
  });

  const filteredDonors = listOfDonor.filter(donor => 
    donor.memberName.toLowerCase().includes(searchForm.watch('searchContent').toLowerCase())
  );
  
  if (isHealthCheckout && currentDonor) {
      return (
          <AnimatePresence>
              <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
              >
                  <HealthCheckForm
                      currentDonor={currentDonor}
                      handleCancel={() => setIsHealthCheckout(false)}
                      refetchDonors={getDonors}
                  />
              </motion.div>
          </AnimatePresence>
      );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <Link to="/staff/receipt" className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Quay lại danh sách sự kiện
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Sự kiện ngày {eventTime ? new Date(eventTime).toLocaleDateString('vi-VN') : '...'}
            </h1>
            <p className="text-gray-500 mt-1">
              Danh sách các tình nguyện viên đã đăng ký.
            </p>
          </div>
          <Form {...searchForm}>
            <form className="relative mt-4 sm:mt-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    {...searchForm.register("searchContent")}
                    className="pl-10 w-64"
                    placeholder="Tìm theo tên..."
                />
            </form>
          </Form>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : filteredDonors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map((donor, index) => (
              <motion.div
                key={donor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <DonorCard
                  {...donor}
                  handleHealthCheckout={() => {
                    setCurrentDonor(donor);
                    setIsHealthCheckout(true);
                  }}
                  setIsShowModal={setIsShowModal}
                  setCurrentDonorId={setCurrentDonorId}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Không có đơn đăng ký</h3>
            <p className="mt-1 text-sm text-gray-500">Chưa có tình nguyện viên nào đăng ký cho sự kiện này.</p>
          </div>
        )}
      </div>

      {isShowModal && (
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
            <h2 className="text-xl font-bold text-gray-800 mb-2">Xác nhận từ chối</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn từ chối đơn đăng ký của tình nguyện viên này?
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                className="font-semibold"
                onClick={() => setIsShowModal(false)}
                disabled={isRejecting}
              >
                Hủy
              </Button>
              <Button variant="destructive" className="font-semibold" onClick={handleReject} disabled={isRejecting}>
                {isRejecting ? "Đang xử lý..." : "Từ chối"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default DonorReceiptList;
