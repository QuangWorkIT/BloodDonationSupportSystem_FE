import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Trash2, Bell } from "lucide-react";
import { BloodUnit } from "./BloodUnit";
import { authenApi } from "@/lib/instance";
import LoadingSpinner from "@/components/layout/Spinner";
import { Link } from "react-router-dom";

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

export default function Inventory() {
  const [bloodInventories, setBloodInventories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Mock critical alert data (replace with real data as needed)
  const criticalAlerts = {
    lowStock: [
      { type: 'O', stock: 5, threshold: 10 },
      { type: 'A', stock: 7, threshold: 10 },
    ],
    // lowEventRegistration: [], // Not used for staff
  };

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
    <div className="container bg-gray-100 rounded-xl p-6 shadow-md flex flex-col items-center m-4">
      <div className="flex justify-center items-center mb-4">
        <Input className="p-3 w-[530px] rounded-md border border-red-700 mr-4" placeholder="Tìm kiếm nhóm máu, người hiến,..." />
        <button className="bg-red-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-700 transition cursor-pointer">Tìm kiếm</button>
      </div>
      {/* Critical Alerts Section */}
      {(criticalAlerts.lowStock.length > 0) && (
        <div className="mb-6 w-full">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500 animate-pulse" /> Cảnh báo quan trọng
          </h2>
          <div className="space-y-4 mb-4">
            {criticalAlerts.lowStock.map((item) => (
              <div key={`low-stock-${item.type}`} className="flex items-center bg-red-50 border-l-4 border-red-400 shadow-sm rounded-lg px-5 py-4 text-sm text-red-900">
                <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full mr-4">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.418 0-8-3.582-8-8 0-3.866 2.857-7.163 6.65-7.876a1 1 0 01.7 0C17.143 5.837 20 9.134 20 13c0 4.418-3.582 8-8 8z" /></svg>
                </div>
                <span className="font-bold mr-2">Kho máu:</span> Nhóm máu <span className="font-extrabold text-red-600 mx-1">{item.type}</span> chỉ còn <span className="font-extrabold text-red-600 mx-1">{item.stock}</span> đơn vị <span className="text-xs text-red-400">(ngưỡng an toàn: {item.threshold})</span>
              </div>
            ))}
          </div>
          <Link to={'/staff/donorsearch'}>
            <button className="bg-red-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-700 transition cursor-pointer">Tạo yêu cầu khẩn cấp</button>
          </Link>
        </div>
      )}
      {/* End Critical Alerts Section */}
      {/* Remove old red alert bar and keep the create event button in the alert section above */}
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
