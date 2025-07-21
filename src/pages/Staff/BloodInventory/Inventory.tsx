import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Trash2, Search, AlertTriangle } from "lucide-react";
import { BloodUnit } from "./BloodUnit";
import { authenApi } from "@/lib/instance";
import LoadingSpinner from "@/components/layout/Spinner";
import { Link } from "react-router-dom";

// Mock data, will be replaced by API calls
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
  const [bloodInventories, setBloodInventories] = useState<Entry[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Mock critical alert data
  const criticalAlerts = {
    lowStock: [
      { type: 'O', stock: 5, threshold: 10 },
      { type: 'A', stock: 7, threshold: 10 },
    ],
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
          params: { pageNumber: currentPage, pageSize: 6 },
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
        setBloodInventories((prev) => prev.filter((entry) => entry.bloodUnitId !== selectedDeleteId));
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
    <div className="bg-gray-50/50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Kho máu</h1>
          <p className="text-gray-500 mt-1">Tổng quan và quản lý các đơn vị máu.</p>
        </header>
        
        {/* Alerts Section */}
        {criticalAlerts.lowStock.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-8 shadow-sm"
          >
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800">Cảnh báo tồn kho thấp</h3>
                <p className="text-red-700 text-sm">
                  Các nhóm máu sau đang ở dưới ngưỡng an toàn: {' '}
                  {criticalAlerts.lowStock.map((a, i) => (
                    <span key={a.type} className="font-bold">
                      {a.type} ({a.stock} đơn vị){i < criticalAlerts.lowStock.length - 1 ? ', ' : '.'}
                    </span>
                  ))}
                </p>
              </div>
              <Link to={'/staff/donorsearch'}>
                <Button variant="destructive" size="sm" className="ml-4 whitespace-nowrap">
                  Tạo yêu cầu khẩn
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Blood Units Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {bloodTypes.map((bt) => (
            <BloodUnit key={bt.type} type={bt.type} unit={bt.units} maxUnit={200} />
          ))}
        </div>

        {/* Inventory Table Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Chi tiết kho máu</h2>
                <p className="text-gray-500 text-sm mt-1">Danh sách tất cả đơn vị máu hiện có.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input className="pl-10 w-64" placeholder="Tìm kiếm theo ID, nhóm máu..." />
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Nhóm máu</th>
                    <th className="px-6 py-3">Thành phần</th>
                    <th className="px-6 py-3">Tuổi máu</th>
                    <th className="px-6 py-3">Ngày hết hạn</th>
                    <th className="px-6 py-3">Trạng thái</th>
                    <th className="px-6 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bloodInventories.map((entry) => (
                    <motion.tr 
                      key={entry.bloodUnitId}
                      className="hover:bg-gray-50/80 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{entry.bloodUnitId}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#C14B53]">{entry.bloodTypeName}</span>
                      </td>
                      <td className="px-6 py-4">{entry.bloodComponentName}</td>
                      <td className="px-6 py-4">{entry.bloodAge} ngày</td>
                      <td className="px-6 py-4">{new Date(entry.expiredDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${entry.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {entry.isAvailable ? "Sẵn có" : "Hết hạn"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                          onClick={() => {
                            setSelectedDeleteId(entry.bloodUnitId);
                            setShowConfirmModal(true);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="p-4 flex items-center justify-between border-t border-gray-200">
              <span className="text-sm text-gray-600">Trang {currentPage} trên {totalPages}</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
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
            <h2 className="text-xl font-bold text-gray-800 mb-2">Xác nhận xóa</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa đơn vị máu này? <span className="font-semibold text-red-600">Hành động này không thể hoàn tác.</span>
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                className="font-semibold"
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedDeleteId(null);
                }}
              >
                Hủy
              </Button>
              <Button variant="destructive" className="font-semibold" onClick={handleDelete}>
                Xóa
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
