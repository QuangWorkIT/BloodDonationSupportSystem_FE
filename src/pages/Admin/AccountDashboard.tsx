import { useState } from "react";
import {
  Home,
  Users,
  BarChart3,
  Settings,
  ChevronDown,
  HelpCircle,
  LogOut,
  ArrowUpDown,
  Edit,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Mail,
  Bell,
  User,
  Search,
} from "lucide-react";

interface Account {
  id: number;
  name: string;
  status: "active" | "inactive";
  email: string;
  birthDate: string;
  role: string;
}

interface AdminSidebarProps {
  activeSidebarItem: string;
  setActiveSidebarItem: (item: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeSidebarItem, setActiveSidebarItem }) => {
  return (
    <aside className="bg-white w-64 flex flex-col border-r border-gray-200 shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🔥</span>
          </div>
          <span className="text-lg font-semibold text-gray-800">Blood gang</span>
        </div>
        <nav className="py-6 px-3 space-y-4">
          <button
            onClick={() => setActiveSidebarItem("home")}
            className={`flex items-center gap-6 w-full px-4 py-4 text-md text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg cursor-pointer ${
              activeSidebarItem === "home" ? "bg-blue-600 text-white" : ""
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-md font-medium">Trang chủ</span>
          </button>
          <button
            onClick={() => setActiveSidebarItem("accounts")}
            className={`flex items-center gap-6 w-full px-4 py-4 text-md text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg cursor-pointer ${
              activeSidebarItem === "accounts" ? "bg-blue-600 text-white" : ""
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-md font-medium">Tài khoản</span>
          </button>
          <button
            onClick={() => setActiveSidebarItem("stats")}
            className={`flex items-center gap-6 w-full px-4 py-4 text-md text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg cursor-pointer ${
              activeSidebarItem === "stats" ? "bg-blue-600 text-white" : ""
            }`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-md font-medium">Thống kê</span>
          </button>
          <button
            onClick={() => setActiveSidebarItem("settings")}
            className={`flex items-center justify-between w-full px-4 py-4 text-md text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg cursor-pointer ${
              activeSidebarItem === "settings" ? "bg-blue-600 text-white" : ""
            }`}
          >
            <div className="flex items-center gap-6">
              <Settings className="w-6 h-6" />
              <span className="text-md font-medium">Cài đặt</span>
            </div>
            <ChevronDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveSidebarItem("help")}
            className={`flex items-center gap-6 w-full px-4 py-4 text-md text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg cursor-pointer ${
              activeSidebarItem === "help" ? "bg-blue-600 text-white" : ""
            }`}
          >
            <HelpCircle className="w-6 h-6" />
            <span className="text-md font-medium">Hỗ trợ</span>
          </button>
        </nav>
      </div>
      <div className="border-t border-gray-100 p-6">
        <button className="flex items-center gap-4 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors rounded-lg cursor-pointer">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

const AccountDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeSidebarItem, setActiveSidebarItem] = useState("accounts");
  const [accounts] = useState<Account[]>([
    {
      id: 1,
      name: "Alyvia Kelley",
      status: "active",
      email: "a.kelley@gmail.com",
      birthDate: "06/18/1978",
      role: "Admin",
    },
    {
      id: 2,
      name: "Jaiden Nixon",
      status: "active",
      email: "jaiden.n@gmail.com",
      birthDate: "08/30/1963",
      role: "Staff",
    },
    {
      id: 3,
      name: "Ace Foley",
      status: "active",
      email: "ace.fo@yahoo.com",
      birthDate: "12/09/1985",
      role: "Staff",
    },
    {
      id: 4,
      name: "Nikolai Schmidt",
      status: "inactive",
      email: "nikolai.schmidt964@outlook.com",
      birthDate: "03/22/1956",
      role: "Staff",
    },
    {
      id: 5,
      name: "Clayton Charles",
      status: "active",
      email: "me@clayton.com",
      birthDate: "10/14/1971",
      role: "Staff",
    },
    {
      id: 6,
      name: "Prince Chen",
      status: "active",
      email: "prince.chen999@gmail.com",
      birthDate: "07/05/1992",
      role: "User",
    },
    {
      id: 7,
      name: "Reece Duran",
      status: "active",
      email: "reece@yahoo.com",
      birthDate: "05/26/1980",
      role: "User",
    },
    {
      id: 8,
      name: "Anastasia Mcdaniel",
      status: "inactive",
      email: "anastasia.spring@mcdaniel2.com",
      birthDate: "02/11/1968",
      role: "User",
    },
    {
      id: 9,
      name: "Melvin Boyle",
      status: "active",
      email: "Me.boyle@gmail.com",
      birthDate: "08/03/1974",
      role: "User",
    },
    {
      id: 10,
      name: "Kailee Thomas",
      status: "active",
      email: "Kailee.thomas@gmail.com",
      birthDate: "11/28/1954",
      role: "User",
    },
  ]);

  const totalPages = Math.ceil(accounts.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentAccounts = accounts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#EFEFEF] text-gray-800 min-h-screen flex">
      {/* Main content */}
      <main className="flex-1 bg-[#EFEFEF]">
        {/* Top bar */}
        <header className="bg-[#EFEFEF] border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-lg relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tìm kiếm"
                type="search"
              />
            </div>
            <div className="flex items-center gap-6">
              <button className="text-gray-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                <Mail className="w-5 h-5" />
              </button>
              <button className="text-gray-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                <Bell className="w-5 h-5" />
              </button>
              <button className="text-gray-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                <User className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">Nguyen Van A</div>
                  <div className="text-xs text-gray-500">jane234@example.com</div>
                </div>
                <ChevronDown className="text-gray-400 w-4 h-4 hover:text-blue-600 transition-colors duration-200 cursor-pointer" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Title and breadcrumb */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Danh sách tài khoản</h1>
            <div className="text-sm text-gray-500">
              <span>Dashboard</span>
              <span className="mx-2">/</span>
              <span className="text-l text-gray-900 mb-2">Tài khoản</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Đang hiện</span>
              <select
                className="border border-gray-300 rounded px-3 py-1 text-sm bg-white"
                value={rowsPerPage}
                onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                <Filter className="w-3 h-3" />
                Lọc
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                <Download className="w-3 h-3" />
                Xuất
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 cursor-pointer">
                + THÊM TÀI KHOẢN
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-between">
                      Họ và tên
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-between">
                      Status
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-between">
                      E-Mail
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-between">
                      Ngày sinh
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-between">
                      Vai trò
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentAccounts.map((account, index) => (
                  <tr key={account.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            account.status === "active" ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-sm text-gray-700 capitalize">{account.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.birthDate}</td>
                    <td className="px-6 py-4 whitespace- nowrap text-sm text-gray-500">{account.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer p-2 rounded border border-gray-300">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === page
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <select
                value={rowsPerPage}
                onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
              <span>/Trang</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountDashboard;
