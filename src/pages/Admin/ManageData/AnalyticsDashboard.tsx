import { useState, useMemo } from "react";
import {
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  Users,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Bell,
} from "lucide-react";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import AdminSidebar from "../AdminSidebar";


// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Type definitions
type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
type TimeSpan = 'weekly' | 'monthly' | 'yearly' | 'all';

interface DashboardStats {
  currentViewers: number;
  bloodUnitsInStock: number;
  monthlyEvents: number;
  yearlyDonors: number;
  weeklyChanges: {
    viewers: { value: string; trend: 'up' | 'down' };
    bloodUnits: { value: string; trend: 'up' | 'down' };
    events: { value: string; trend: 'up' | 'down' };
    donors: { value: string; trend: 'up' | 'down' };
  };
}

interface BloodStock {
  type: string;
  quantity: number;
  color: string;
}

interface DonationActivity {
  month: string;
  donations: number;
}

interface DonationEvent {
  id: number;
  date: string;
  location: string;
  registeredDonors: number;
  expectedDonors: number;
  status: EventStatus;
}

const AnalyticsDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeSidebarItem, setActiveSidebarItem] = useState("stats");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    timeSpan: "monthly" as TimeSpan,
    eventStatus: "" as EventStatus | "",
  });

  // Generated data
  const [dashboardStats] = useState<DashboardStats>({
    currentViewers: 1312,
    bloodUnitsInStock: 1423,
    monthlyEvents: 12,
    yearlyDonors: 923,
    weeklyChanges: {
      viewers: { value: "+1.01%", trend: "up" },
      bloodUnits: { value: "+0.49%", trend: "up" },
      events: { value: "-0.91%", trend: "down" },
      donors: { value: "+1.51%", trend: "up" },
    },
  });

  const [bloodStock] = useState<BloodStock[]>([
    { type: 'A', quantity: 15, color: '#FF6384' },
    { type: 'B', quantity: 23, color: '#36A2EB' },
    { type: 'AB', quantity: 15, color: '#FFCE56' },
    { type: 'O', quantity: 35, color: '#4BC0C0' },
  ]);

  const [donationActivity] = useState<DonationActivity[]>([
    { month: 'JAN', donations: 120 },
    { month: 'FEB', donations: 150 },
    { month: 'MAR', donations: 180 },
    { month: 'APR', donations: 200 },
    { month: 'MAY', donations: 240 },
    { month: 'JUN', donations: 300 },
    { month: 'JUL', donations: 280 },
    { month: 'AUG', donations: 260 },
    { month: 'SEP', donations: 220 },
    { month: 'OCT', donations: 190 },
    { month: 'NOV', donations: 160 },
    { month: 'DEC', donations: 140 },
  ]);

  const [events, setEvents] = useState<DonationEvent[]>([
    { id: 12594, date: "Oct 15, 2023", location: "312 Vitamette Ave", registeredDonors: 134, expectedDonors: 225, status: "upcoming" },
    { id: 12595, date: "Nov 5, 2023", location: "456 Main Street", registeredDonors: 210, expectedDonors: 300, status: "upcoming" },
    { id: 12596, date: "Aug 20, 2023", location: "789 Park Avenue", registeredDonors: 250, expectedDonors: 250, status: "completed" },
    { id: 12597, date: "Sep 10, 2023", location: "101 Center Road", registeredDonors: 150, expectedDonors: 180, status: "completed" },
    { id: 12598, date: "Dec 1, 2023", location: "202 Emergency Lane", registeredDonors: 320, expectedDonors: 350, status: "ongoing" },
    { id: 12599, date: "Jul 15, 2023", location: "303 Regular Street", registeredDonors: 180, expectedDonors: 200, status: "completed" },
    { id: 12600, date: "Jun 5, 2023", location: "404 Cancelled Road", registeredDonors: 90, expectedDonors: 150, status: "cancelled" },
    { id: 12601, date: "Jan 20, 2024", location: "505 Community Ave", registeredDonors: 150, expectedDonors: 280, status: "upcoming" },
    { id: 12602, date: "Feb 10, 2024", location: "606 School Street", registeredDonors: 190, expectedDonors: 220, status: "upcoming" },
    { id: 12603, date: "Mar 5, 2024", location: "707 Business Park", registeredDonors: 120, expectedDonors: 180, status: "upcoming" },
  ]);

  // Chart data and options
  const bloodStockChartData = {
    labels: bloodStock.map(item => item.type),
    datasets: [
      {
        data: bloodStock.map(item => item.quantity),
        backgroundColor: bloodStock.map(item => item.color),
        borderWidth: 1,
      },
    ],
  };

  const donationActivityChartData = {
    labels: donationActivity.map(item => item.month),
    datasets: [
      {
        label: 'Số lượng hiến máu',
        data: donationActivity.map(item => item.donations),
        backgroundColor: '#3B82F6',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DonationEvent;
    direction: "ascending" | "descending";
  } | null>(null);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (event) =>
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply time span filter
    if (filters.timeSpan === 'weekly') {
      // In a real app, you would filter by date range
      result = result.slice(0, 3); // Just for demo
    } else if (filters.timeSpan === 'monthly') {
      result = result.slice(0, 6); // Just for demo
    }

    // Apply event status filter
    if (filters.eventStatus) {
      result = result.filter((event) => event.status === filters.eventStatus);
    }

    // Apply sorting
    if (sortConfig !== null) {
      result.sort((a, b) => {
        const key = sortConfig.key;
        if (a[key] < b[key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [events, searchTerm, filters, sortConfig]);

  const requestSort = (key: keyof DonationEvent) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      timeSpan: "monthly",
      eventStatus: "",
    });
    setCurrentPage(1);
  };

  // Helper function to get status color
  const getStatusColor = (status: EventStatus): string => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const changeEventStatus = (id: number, newStatus: EventStatus) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, status: newStatus } : event
    ));
  };

  return (
    <div className="bg-[#EFEFEF] text-gray-800 min-h-screen flex h-screen w-screen">
      <AdminSidebar activeItem={activeSidebarItem} setActiveItem={setActiveSidebarItem} />


      {/* Main content */}
      
      <main className="flex-1 bg-[#EFEFEF]">
        {/* Top bar */}
        <header className="bg-[#EFEFEF] border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-lg relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tìm kiếm theo địa điểm"
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex items-center gap-6">
              <button className="text-gray-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                <Bell className="w-5 h-5" />
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bảng thống kê số liệu</h1>
            <div className="text-sm text-gray-500">
              <span>Dashboard</span>
              <span className="mx-2">/</span>
              <span className="text-l text-gray-900 mb-2">Thống kê</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Current Viewers */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Số người hiển thị</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.currentViewers.toLocaleString()}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                {dashboardStats.weeklyChanges.viewers.trend === 'up' ? (
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                )}
                <p className={`text-sm ${dashboardStats.weeklyChanges.viewers.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {dashboardStats.weeklyChanges.viewers.value}
                </p>
              </div>
            </div>

            {/* Blood Units */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Đơn vị máu trong kho</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.bloodUnitsInStock.toLocaleString()}</p>
                </div>
                <div className="bg-red-100 p-2 rounded-full">
                  <Users className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                {dashboardStats.weeklyChanges.bloodUnits.trend === 'up' ? (
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                )}
                <p className={`text-sm ${dashboardStats.weeklyChanges.bloodUnits.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {dashboardStats.weeklyChanges.bloodUnits.value}
                </p>
              </div>
            </div>

            {/* Monthly Events */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Tổng sự kiện tháng này</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.monthlyEvents}</p>
                </div>
                <div className="bg-purple-100 p-2 rounded-full">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                {dashboardStats.weeklyChanges.events.trend === 'up' ? (
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                )}
                <p className={`text-sm ${dashboardStats.weeklyChanges.events.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {dashboardStats.weeklyChanges.events.value}
                </p>
              </div>
            </div>

            {/* Yearly Donors */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Tổng người hiến năm nay</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.yearlyDonors.toLocaleString()}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                {dashboardStats.weeklyChanges.donors.trend === 'up' ? (
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                )}
                <p className={`text-sm ${dashboardStats.weeklyChanges.donors.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {dashboardStats.weeklyChanges.donors.value}
                </p>
              </div>
            </div>
          </div>

          {/* Blood Stock and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Blood Stock Doughnut Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kho máu</h2>
              <div className="h-64">
                <Doughnut data={bloodStockChartData} options={chartOptions} />
              </div>
            </div>

            {/* Donation Activity Bar Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động hiến máu</h2>
              <div className="h-64">
                <Bar data={donationActivityChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Events Table */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Danh sách sự kiện</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  <Filter className="w-3 h-3" />
                  Lọc
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                  <Download className="w-3 h-3" />
                  Xuất
                </button>
              </div>
            </div>

            {/* Filter dropdown */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng thời gian</label>
                    <select
                      name="timeSpan"
                      value={filters.timeSpan}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option value="weekly">Tuần này</option>
                      <option value="monthly">Tháng này</option>
                      <option value="yearly">Năm nay</option>
                      <option value="all">Tất cả</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select
                      name="eventStatus"
                      value={filters.eventStatus}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option value="">Tất cả</option>
                      <option value="upcoming">Sắp diễn ra</option>
                      <option value="ongoing">Đang diễn ra</option>
                      <option value="completed">Đã hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => requestSort("id")}
                      >
                        ID
                        {sortConfig?.key === "id" ? (
                          sortConfig.direction === "ascending" ? (
                            <ArrowUp className="w-3 h-3 text-gray-400" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-gray-400" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => requestSort("date")}
                      >
                        Ngày
                        {sortConfig?.key === "date" ? (
                          sortConfig.direction === "ascending" ? (
                            <ArrowUp className="w-3 h-3 text-gray-400" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-gray-400" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                      Địa điểm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                      Số người hiến
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentEvents.length > 0 ? (
                    currentEvents.map((event, index) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                          #{event.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                          {event.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                          {event.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                          {event.registeredDonors}/{event.expectedDonors}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm border-r">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}
                          >
                            {event.status === 'upcoming' && 'Sắp diễn ra'}
                            {event.status === 'ongoing' && 'Đang diễn ra'}
                            {event.status === 'completed' && 'Đã hoàn thành'}
                            {event.status === 'cancelled' && 'Đã hủy'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <select
                            value={event.status}
                            onChange={(e) => changeEventStatus(event.id, e.target.value as EventStatus)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs"
                          >
                            <option value="upcoming">Sắp diễn ra</option>
                            <option value="ongoing">Đang diễn ra</option>
                            <option value="completed">Đã hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                        Không tìm thấy sự kiện nào phù hợp
                      </td>
                    </tr>
                  )}
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
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;