import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { BloodUnit } from "./BloodUnit";
import { authenApi } from "@/lib/instance";
import LoadingSpinner from "@/components/layout/Spinner";
import { useNavigate } from "react-router-dom";

const bloodTypes = [
  { type: "A-", units: 112 },
  { type: "B-", units: 170 },
  { type: "AB-", units: 82 },
  { type: "O-", units: 32 },
  { type: "A+", units: 142 },
  { type: "B+", units: 78 },
  { type: "AB+", units: 66 },
  { type: "O+", units: 92 },
];

interface Entry {
  bloodUnitId: number;
  createAt: string;
  bloodTypeName: string;
  bloodComponentName: string;
  bloodRegisId: string;
  bloodAge: number;
  isAvailable: boolean;
  expiredDate: string;
  description?: string | null;
}

interface BloodTypeAlert {
  bloodTypeName: string;
}
export default function Inventory() {
  const nav = useNavigate()
  const [bloodInventories, setBloodInventories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bloodTypeAlert, setBloodTypeAlert] = useState<BloodTypeAlert[]>([]);
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const fetchInventories = async () => {
      setLoading(true);
      try {
        const response = await authenApi.get("/api/blood-inventories/paged", {
          params: {
            pageNumber: currentPage,
            pageSize: 4,
          },
        });

        if (response.data?.isSuccess) {
          setBloodInventories(response.data.data.items);
          setTotalPages(response.data.data.totalPages);
        }
      } catch (err) {
        console.error("Failed to fetch blood inventory:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventories();
  }, [currentPage]);

  // fetch blood type alert
  useEffect(() => {
    const fetchBloodTypeAlert = async () => {
      try {
        const response = await authenApi.get("/api/blood-inventories/alert");
        if (response.data?.isSuccess) {
          console.log("Blood type alert:", response.data.data);
          setBloodTypeAlert(response.data.data);
        } else {
          console.error("Failed to fetch blood type alert:", response.data?.message || "Unknown error");
        }
      } catch (err) {
        console.error("Failed to fetch blood type alert:", err);
      }
    };

    fetchBloodTypeAlert();
  }, [])

  const handleDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      const response = await authenApi.put(`/api/blood-inventories/${selectedDeleteId}/delete`);
      if (response.data?.isSuccess) {
        setBloodInventories((prev) => prev.filter((entry: Entry) => entry.bloodUnitId !== selectedDeleteId));
      } else {
        console.error("Delete failed:", response.data?.message || "Unknown error");
      }
    } catch (err) {
      console.error("Failed to delete blood unit:", err);
    } finally {
      setShowConfirmModal(false);
      setSelectedDeleteId(null);
    }
  };

  return (
    <div className="container bg-[#F0EFF4] rounded-xl p-6 shadow-md flex flex-col items-center m-4">
      <div className="flex justify-center items-center mb-4">
        <Input className="p-3 w-[530px] rounded-md border bg-white border-red-700 mr-4"
          placeholder="Tìm kiếm nhóm máu" />
        <button className="bg-red-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-700 transition cursor-pointer">Tìm kiếm</button>
      </div>
      {
        bloodTypeAlert.length > 0 && (
          <div className="bg-red-200 px-4 py-2 rounded-md font-semibold mb-6 flex justify-between items-center w-full">
            <p className="text-lg text-red-600">Lưu ý: Nhóm máu {bloodTypeAlert[0].bloodTypeName} sắp hết</p>
            <button
              onClick={() => nav("/staff/donorsearch", { replace: true })}
              className="bg-red-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-700 transition cursor-pointer">Tạo yêu cầu khẩn cấp</button>
          </div>
        )
      }

      {/* Still hardcoding */}
      <div className="grid grid-cols-2 sm:grid-cols-4 w-fit gap-x-[87px] gap-y-[45px] mb-8 justify-items-center items-center">
        {bloodTypes.map((bt, i) => (
          <BloodUnit key={i} type={bt.type} unit={bt.units} maxUnit={200} />
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full mb-6">
          <table className="w-full table-auto border border-black">
            <thead className="bg-red-800 text-white">
              <tr className="border border-black">
                <th className="px-4 py-2 border border-black">ID</th>
                <th className="px-4 py-2 border border-black">Ngày tạo</th>
                <th className="px-4 py-2 border border-black">Nhóm máu</th>
                <th className="px-4 py-2 border border-black">Thành phần</th>
                <th className="px-4 py-2 border border-black">Mã hiến</th>
                <th className="px-4 py-2 border border-black">Tuổi</th>
                <th className="px-4 py-2 border border-black">Trạng thái</th>
                <th className="px-4 py-2 border border-black">Hết hạn</th>
                <th className="px-4 py-2 border border-black">Ghi chú</th>
                <th className="px-4 py-2 border border-black"> </th>
              </tr>
            </thead>
            <tbody>
              {bloodInventories.map((entry: Entry, i) => (
                <motion.tr
                  key={entry.bloodUnitId}
                  className="text-center text-sm border-b"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <td className="px-6 py-3 border border-black">{entry.bloodUnitId}</td>
                  <td className="px-6 py-3 border border-black">{new Date(entry.createAt).toLocaleDateString()}</td>
                  <td className="px-6 py-3 font-semibold border border-black">
                    <span className="bg-red-500 px-3 py-1 rounded-md text-white text-sm">{entry.bloodTypeName}</span>
                  </td>
                  <td className="px-6 py-3 border border-black">
                    <span className="bg-blue-400 px-3 py-1 rounded-md text-white text-sm">{entry.bloodComponentName}</span>
                  </td>
                  <td className="px-6 py-3 border border-black">{entry.bloodRegisId}</td>
                  <td className="px-6 py-3 border border-black">{entry.bloodAge} ngày</td>
                  <td className="px-6 py-3 border border-black">
                    <span className={`px-3 py-1 rounded-md text-white text-sm ${entry.isAvailable ? "bg-green-500" : "bg-red-500"}`}>
                      {entry.isAvailable ? "Tốt" : "Hết hạn"}
                    </span>
                  </td>
                  <td className="px-6 py-3 border border-black">{entry.expiredDate}</td>
                  <td className="px-6 py-3 border border-black">{entry.description || "-"}</td>
                  <td className="px-6 py-3 border border-black">
                    <button
                      className="hover:text-red-800 cursor-pointer"
                      onClick={() => {
                        setSelectedDeleteId(entry.bloodUnitId);
                        setShowConfirmModal(true);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showConfirmModal && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-red-700 mb-4">Xác nhận xóa</h2>
            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn xóa đơn vị máu này không? <span className="text-red-800">Hành động này không thể hoàn tác.</span>
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                className="px-4 py-2 text-gray-700 border border-gray-300 cursor-pointer"
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedDeleteId(null);
                }}
              >
                Hủy
              </Button>
              <Button className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 cursor-pointer" onClick={handleDelete}>
                Xóa
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.div className="flex items-center space-x-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "outline" : "ghost"}
            className={`rounded-lg w-10 h-10 p-0 cursor-pointer ${page === currentPage ? "border border-blue-500 text-blue-600 bg-white" : "border border-gray-300 text-gray-600 bg-white"
              }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ))}

        <Select onValueChange={(value) => handlePageChange(Number(value))}>
          <SelectTrigger className="w-20 h-10 rounded-lg">
            <SelectValue placeholder={`${currentPage}`} />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: totalPages }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()} onClick={() => handlePageChange(i)}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-1 text-muted-foreground">/Trang</span>
      </motion.div>
    </div>
  );
}
