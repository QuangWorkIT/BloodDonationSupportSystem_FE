import { useState, useMemo, useEffect } from "react";
import {
  Edit,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Mail,
  Bell,
  User,
  Search,
  ChevronDown,
  Check,
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { CSVLink } from "react-csv";
import AdminSidebar from "../AdminSidebar";
import DatePicker from "@/components/ui/datepicker";
import AddAccountModal from "./AddAccount";
import { authenApi } from "@/lib/instance";
import { AxiosError } from "axios";

// Type Definitions
type AccountStatus = "Active" | "Inactive";
type AccountRole = "Admin" | "Staff" | "Member";

interface User {
  userId: string;
  name: string;
  status: AccountStatus;
  email: string;
  dob: string;
  role: AccountRole;
  phone?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Account extends User {
  // No need for tableId since we'll calculate it dynamically
}

interface NewAccountData {
  name: string;
  email: string;
  dob: string;
  phone?: string;
  role: AccountRole;
  status: AccountStatus;
}

interface EditFormData {
  name?: string;
  email?: string;
  dob?: string;
  phone?: string;
}

interface PaginatedUserData {
  items: User[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

type SortDirection = "ascending" | "descending";
type SortableField = keyof Omit<Account, "userId">;

interface SortConfig {
  key: SortableField | "";
  direction: SortDirection;
}

interface FilterState {
  role: AccountRole | "";
}
type BloodTypeId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // Assuming standard blood types (A+, A-, B+, B-, AB+, AB-, O+, O-)
interface StaffAccount {
  firstName: string;
  lastName: string;
  phone: string;
  gmail: string;
  password: string;
  longitude: number;
  latitude: number;
  bloodTypeId: BloodTypeId;
  dob: string; // ISO date string (YYYY-MM-DD)
  gender: boolean; // true for male, false for female
}
// CSV Headers Type
type CSVHeaders = {
  label: string;
  key: string;
}[];
const convertStaffAccountToNewAccountData = (staffAccount: StaffAccount): NewAccountData => {
  // Split the full name into first and last name
  const name = `${staffAccount.firstName} ${staffAccount.lastName}`.trim();

  return {
    name,
    email: staffAccount.gmail,
    dob: staffAccount.dob,
    phone: staffAccount.phone,
    role: "Staff", // Since this modal is for adding staff accounts
    status: "Active", // Default to active status
  };
};

const AccountDashboard = () => {
  // State Management
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(10); // Fixed at 10 per page
  const [activeSidebarItem, setActiveSidebarItem] = useState<string>("accounts");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0); // <-- ensure this is in state

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>({
    role: "",
  });

  // Sorting State
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: "ascending",
  });

  // Editing States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({});
  const [showAddAccountModal, setShowAddAccountModal] = useState<boolean>(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  // Data Fetching (fetch all accounts at once, only on mount)
  useEffect(() => {
    const fetchAllAccounts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch all accounts by requesting a very large pageSize
        const response = await authenApi.get<ApiResponse<PaginatedUserData>>(
          `/api/users?pageNumber=1&pageSize=10000`
        );
        if (response.data.isSuccess) {
          setAccounts(response.data.data.items); // all accounts
          setTotalItems(response.data.data.items.length);
        } else {
          setError(response.data.message || "Failed to fetch accounts");
        }
      } catch (err) {
        const error = err as AxiosError<ApiResponse<null>>;
        setError(error.response?.data?.message || error.message || "Error fetching accounts data");
      } finally {
        setLoading(false);
      }
    };
    fetchAllAccounts();
  }, []); // Only run on mount

  // Sorting and Filtering Logic (unchanged)
  const filteredAccounts = useMemo(() => {
    let result = [...accounts];
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (account) =>
          account.name.toLowerCase().includes(term) ||
          account.email.toLowerCase().includes(term) ||
          (account.phone && account.phone.toLowerCase().includes(term))
      );
    }
    // Apply role filter
    if (filters.role) {
      result = result.filter((account) => account.role === filters.role);
    }
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const key = sortConfig.key as keyof Account;
        const aValue = a[key];
        const bValue = b[key];
        if (aValue === undefined || bValue === undefined) return 0;
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return result;
  }, [accounts, searchTerm, filters, sortConfig]);

  // CSV Export Data Preparation
  const csvHeaders: CSVHeaders = [
    { label: "ID", key: "userId" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Status", key: "status" },
    { label: "Role", key: "role" },
    { label: "Date of Birth", key: "dob" },
    { label: "Phone", key: "phone" },
  ];
  // Add this phone number formatter utility
const formatVietnamesePhoneNumber = (phone?: string): string => {
  if (!phone) return "N/A";
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it's already properly formatted, return as-is
  if (digits.startsWith('0') && digits.length === 10) {
    return digits;
  }
  if (digits.startsWith('84') && digits.length === 11) {
    return `+${digits}`;
  }
  
  // For numbers without prefix but correct length (9 digits)
  if (digits.length === 9) {
    return `0${digits}`;
  }
  
  // For numbers that might have 84 prefix but missing +
  if (digits.length === 10 && digits.startsWith('84')) {
    return `+${digits}`;
  }
  
  // For numbers that might have international prefix already
  if (digits.length >= 10 && digits.startsWith('84')) {
    return `+${digits}`;
  }
  
  // Default case - prepend 0 if it's a reasonable length
  if (digits.length >= 9 && digits.length <= 11) {
    return `0${digits.slice(-9)}`; // Take last 9 digits and prepend 0
  }
  
  // Fallback - return the original if we can't format it
  return phone;
};

// Update the CSV data preparation
const csvExportData = useMemo(() => {
  return filteredAccounts.map((account) => ({
    userId: account.userId,
    name: account.name,
    email: account.email,
    status: account.status,
    role: account.role,
    dob: account.dob,
    phone: formatVietnamesePhoneNumber(account.phone),
  }));
}, [filteredAccounts]);
  const requestSort = (key: SortableField) => {
    let direction: SortDirection = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Pagination Logic (frontend)
  const totalPages = Math.ceil(filteredAccounts.length / rowsPerPage);
  const currentAccounts = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    return filteredAccounts.slice(startIdx, endIdx);
  }, [filteredAccounts, currentPage, rowsPerPage]);

  // Add this function after pagination logic
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // CRUD Operations
  const handleEditClick = (account: Account) => {
    setEditingId(account.userId);
    setEditFormData({
      name: account.name,
      email: account.email,
      dob: account.dob,
      phone: account.phone,
    });
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    const formattedDate = date.toISOString().split("T")[0];
    setEditFormData((prev) => ({ ...prev, dob: formattedDate }));
  };

  const handleSaveEdit = async (account: Account) => {
    try {
      setLoading(true);

      // Split name into firstName and lastName
      const [firstName, ...lastNameArr] = (editFormData.name ?? account.name).split(" ");
      const lastName = lastNameArr.join(" ");

      // Prepare the request body
      const body = {
        dob: editFormData.dob ?? account.dob,
        firstName,
        lastName,
      };

      const response = await authenApi.put<ApiResponse<null>>(
        `/api/users?id=${account.userId}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.isSuccess) {
        setAccounts(accounts.map((a) => (a.userId === account.userId ? { ...a, ...editFormData } : a)));
        setEditingId(null);
        setEditFormData({});
      } else {
        setError(response.data.message || "Failed to update account");
      }
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      setError(error.response?.data?.message || error.message || "Error updating account");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleAddNewAccount = async (accountData: NewAccountData) => {
    try {
      setLoading(true);
      const newAccount: Account = {
        ...accountData,
        userId: crypto.randomUUID(),
      };

      // API call would go here in a real implementation
      setAccounts([...accounts, newAccount]);
      setShowAddAccountModal(false);
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      setError(error.response?.data?.message || error.message || "Error creating account");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (account: Account) => {
    try {
      setLoading(true);

      if (account.role === "Admin") {
        setError("Cannot ban admin accounts");
        setAccountToDelete(null);
        return;
      }

      // Simulate API call
      const response = await authenApi.put<ApiResponse<null>>(
        `/api/users/${account.userId}/ban`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.isSuccess) {
        setAccounts(accounts.filter((a) => a.userId !== account.userId));
        setAccountToDelete(null);
      } else {
        setError(response.data.message || "Failed to ban account");
      }
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      setError(error.response?.data?.message || error.message || "Error banning account");
    } finally {
      setLoading(false);
    }
  };

  // Search and Filter Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(1);
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value as AccountRole | "",
    }));
  };

  const resetFilters = () => {
    setCurrentPage(1);
    setFilters({ role: "" });
  };

  // Render Functions
  const renderSortIcon = (key: SortableField) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    return sortConfig.direction === "ascending" ? (
      <ArrowUp className="w-3 h-3 text-gray-400" />
    ) : (
      <ArrowDown className="w-3 h-3 text-gray-400" />
    );
  };

  return (
    <div className="flex min-h-screen h-full w-screen bg-[#EFEFEF]">
      <AdminSidebar activeItem={activeSidebarItem} setActiveItem={setActiveSidebarItem} />

      <main className="flex-1 bg-[#EFEFEF]">
        <header className="bg-[#EFEFEF] border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-lg relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tìm kiếm theo tên hoặc email"
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
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
                  <div className="text-sm font-medium text-gray-700">Admin User</div>
                  <div className="text-xs text-gray-500">admin@example.com</div>
                </div>
                <ChevronDown className="text-gray-400 w-4 h-4 hover:text-blue-600 transition-colors duration-200 cursor-pointer" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Danh sách tài khoản</h1>
            <div className="text-sm text-gray-500">
              <span>Dashboard</span>
              <span className="mx-2">/</span>
              <span className="text-l text-gray-900 mb-2">Tài khoản</span>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              {error}
              <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Đang hiện</span>
                  <span>trong tổng số {totalItems} tài khoản</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    <Filter className="w-3 h-3" />
                    Lọc
                  </button>
                  <CSVLink
                    data={csvExportData}
                    headers={csvHeaders}
                    filename={`accounts_export_${new Date().toISOString().slice(0, 10)}.csv`}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    Xuất
                  </CSVLink>

                  <button
                    onClick={() => setShowAddAccountModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    THÊM TÀI KHOẢN NHÂN SỰ
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                      <select
                        name="role"
                        value={filters.role}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="">Tất cả</option>
                        <option value="Admin">Admin</option>
                        <option value="Staff">Staff</option>
                        <option value="Member">Member</option>
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

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                        #
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r cursor-pointer hover:bg-gray-100"
                        onClick={() => requestSort("name")}
                      >
                        <div className="flex items-center justify-between">
                          Họ và tên
                          {renderSortIcon("name")}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r cursor-pointer hover:bg-gray-100"
                        onClick={() => requestSort("email")}
                      >
                        <div className="flex items-center justify-between">
                          E-Mail
                          {renderSortIcon("email")}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r cursor-pointer hover:bg-gray-100"
                        onClick={() => requestSort("dob")}
                      >
                        <div className="flex items-center justify-between">
                          Ngày sinh
                          {renderSortIcon("dob")}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                        Vai trò
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r cursor-pointer hover:bg-gray-100"
                        onClick={() => requestSort("phone")}
                      >
                        <div className="flex items-center justify-between">
                          Phone
                          {renderSortIcon("phone")}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentAccounts.length > 0 ? (
                      currentAccounts.map((account, index) => (
                        <tr
                          key={account.userId}
                          className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                            {editingId === account.userId ? (
                              <input
                                type="text"
                                name="name"
                                value={editFormData.name || account.name}
                                onChange={handleEditFormChange}
                                className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                              />
                            ) : (
                              account.name
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                            {editingId === account.userId ? (
                              <input
                                type="email"
                                name="email"
                                value={editFormData.email || account.email}
                                onChange={handleEditFormChange}
                                className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                              />
                            ) : (
                              account.email
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                            {editingId === account.userId ? (
                              <DatePicker
                                value={editFormData.dob ? new Date(editFormData.dob) : new Date(account.dob)}
                                onChange={handleDateChange}
                                className=""
                                hasError={false}
                              />
                            ) : (
                              account.dob
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r capitalize">
                            {account.role.toLowerCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                            {editingId === account.userId ? (
                              <input
                                type="text"
                                name="phone"
                                value={editFormData.phone || account.phone || ""}
                                onChange={handleEditFormChange}
                                className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                              />
                            ) : (
                              account.phone || "N/A"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                            {editingId === account.userId ? (
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => handleSaveEdit(account)}
                                  className="bg-green-100 hover:bg-green-200 transition-colors duration-200 cursor-pointer p-2 rounded border border-green-300 text-green-700"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="bg-red-100 hover:bg-red-200 transition-colors duration-200 cursor-pointer p-2 rounded border border-red-300 text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleEditClick(account)}
                                  className="bg-blue-100 hover:bg-blue-200 transition-colors duration-200 cursor-pointer p-2 rounded border border-blue-300 text-blue-700"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setAccountToDelete(account)}
                                  className="bg-red-100 hover:bg-red-200 transition-colors duration-200 cursor-pointer p-2 rounded border border-red-300 text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          Không tìm thấy tài khoản nào phù hợp
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => {
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
                  <span>/Trang</span>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {accountToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Xác nhận cấm tài khoản</h3>
            <p className="text-sm text-gray-500 mb-6">Bạn có chắc chắn muốn cấm tài khoản {accountToDelete.name}?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAccountToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDeleteAccount(accountToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 cursor-pointer"
              >
                Xác nhận cấm
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddAccountModal && (
        <AddAccountModal
          onSave={async (staffAccount) => {
            const newAccountData = convertStaffAccountToNewAccountData(staffAccount);
            await handleAddNewAccount(newAccountData);
          }}
          onCancel={() => setShowAddAccountModal(false)}
        />
      )}
    </div>
  );
};

export default AccountDashboard;