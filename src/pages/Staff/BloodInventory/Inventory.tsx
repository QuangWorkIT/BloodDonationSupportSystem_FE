import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { BloodUnit } from "./BloodUnit";

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

const bloodData = [
  {
    id: "001",
    date: "2025-05-20",
    time: "08:30",
    type: "A+",
    component: "Toàn phần",
    code: "003",
    age: "3 ngày",
    status: "Tốt",
    expiry: "35 ngày",
    note: "Cần kiểm tra định kỳ",
  },
  {
    id: "002",
    date: "2025-05-25",
    time: "08:30",
    type: "O-",
    component: "Hồng cầu",
    code: "005",
    age: "6 ngày",
    status: "Tốt",
    expiry: "35 ngày",
    note: "Ưu tiên sử dụng",
  },
  {
    id: "003",
    date: "2025-05-20",
    time: "08:30",
    type: "B+",
    component: "Huyết tương",
    code: "001",
    age: "11 ngày",
    status: "Sắp hết hạn",
    expiry: "14 ngày",
    note: "Cần kiểm tra định kỳ",
  },
  {
    id: "004",
    date: "2025-05-20",
    time: "08:30",
    type: "A+",
    component: "Tiểu cầu",
    code: "006",
    age: "16 ngày",
    status: "Hết hạn",
    expiry: "5 ngày",
    note: "Cần loại bỏ",
  },
];

export default function Inventory() {
  const totalPages = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container bg-gray-100 rounded-xl p-6 shadow-md flex flex-col items-center m-4">
      <div className="flex justify-center items-center mb-4">
        <Input className="p-3 w-[530px] rounded-md border border-red-700 mr-4" placeholder="Tìm kiếm nhóm máu, người hiến,..." />
        <button className="bg-red-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-700 transition cursor-pointer">Tìm kiếm</button>
      </div>

      <div className="bg-red-200 px-4 py-2 rounded-md font-semibold mb-6 flex justify-between items-center w-full">
        <p className="text-lg text-red-600">Lưu ý: Nhóm máu O- sắp hết</p>
        <button className="bg-red-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-700 transition cursor-pointer">Tạo yêu cầu khẩn cấp</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 w-fit gap-x-[87px] gap-y-[45px] mb-8 justify-items-center items-center">
        {bloodTypes.map((bt, i) => (
          <BloodUnit key={i} type={bt.type} unit={bt.units} maxUnit={200} />
        ))}
      </div>

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
            {bloodData.map((entry, i) => (
              <motion.tr
                key={entry.id}
                className="text-center text-sm border-b"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <td className="px-6 py-3 border border-black">{entry.id}</td>
                <td className="px-6 py-3 border border-black">
                  {entry.date} {entry.time}
                </td>
                <td className="px-6 py-3 font-semibold border border-black">
                  <span className="bg-red-500 px-3 py-1 rounded-md text-white text-sm">{entry.type}</span>
                </td>
                <td className="px-6 py-3 border border-black">
                  <span className="bg-blue-400 px-3 py-1 rounded-md text-white text-sm">{entry.component}</span>
                </td>
                <td className="px-6 py-3 border border-black">{entry.code}</td>
                <td className="px-6 py-3 border border-black">
                  <span
                    className={`px-3 py-1 rounded-md text-white text-sm ${
                      entry.status === "Tốt" ? "bg-green-500" : entry.status === "Sắp hết hạn" ? "bg-yellow-400" : "bg-red-500"
                    }`}
                  >
                    {entry.age}
                  </span>
                </td>
                <td className="px-6 py-3 border border-black">
                  <span
                    className={`px-3 py-1 rounded-md text-white text-sm ${
                      entry.status === "Tốt" ? "bg-green-500" : entry.status === "Sắp hết hạn" ? "bg-yellow-400" : "bg-red-500"
                    }`}
                  >
                    {entry.status}
                  </span>
                </td>
                <td className="px-6 py-3 border border-black">{entry.expiry}</td>
                <td className="px-6 py-3 border border-black">{entry.note}</td>
                <td className="px-6 py-3 border border-black">
                  <button className="hover:text-red-800 cursor-pointer">
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <motion.div className="flex items-center space-x-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "outline" : "ghost"}
            className={`rounded-lg w-10 h-10 p-0 cursor-pointer ${
              page === currentPage ? "border border-blue-500 text-blue-600 bg-white" : "border border-gray-300 text-gray-600 bg-white"
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
