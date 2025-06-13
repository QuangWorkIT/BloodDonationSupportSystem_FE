import { useState, useMemo } from "react";
import {
  ArrowUpDown,
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
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import DatePicker from "@/components/ui/datepicker";

interface Account {
  id: number;
  name: string;
  status: "active" | "inactive";
  email: string;
  birthDate: string;
  role: string;
  phone: string;
  password: string;
}

const AccountDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeSidebarItem, setActiveSidebarItem] = useState("accounts");
  const [showPassword, setShowPassword] = useState<Record<number, boolean>>({});
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: 1,
      name: "Alyvia Kelley",
      status: "active",
      email: "a.kelley@gmail.com",
      birthDate: "06/18/1978",
      role: "Admin",
      phone: "123-456-7890",
      password: "password123",
    },
    {
      id: 2,
      name: "Jaiden Nixon",
      status: "active",
      email: "jaiden.n@gmail.com",
      birthDate: "08/30/1963",
      role: "Staff",
      phone: "234-567-8901",
      password: "password234",
    },
    {
      id: 3,
      name: "Ace Foley",
      status: "active",
      email: "ace.fo@yahoo.com",
      birthDate: "12/09/1985",
      role: "Staff",
      phone: "345-678-9012",
      password: "password345",
    },
    {
      id: 4,
      name: "Nikolai Schmidt",
      status: "inactive",
      email: "nikolai.schmidt964@outlook.com",
      birthDate: "03/22/1956",
      role: "Staff",
      phone: "456-789-0123",
      password: "password456",
    },
    {
      id: 5,
      name: "Clayton Charles",
      status: "active",
      email: "me@clayton.com",
      birthDate: "10/14/1971",
      role: "Staff",
      phone: "567-890-1234",
      password: "password567",
    },
    {
      id: 6,
      name: "Prince Chen",
      status: "active",
      email: "prince.chen999@gmail.com",
      birthDate: "07/05/1992",
      role: "User",
      phone: "678-901-2345",
      password: "password678",
    },
    {
      id: 7,
      name: "Reece Duran",
      status: "active",
      email: "reece@yahoo.com",
      birthDate: "05/26/1980",
      role: "User",
      phone: "789-012-3456",
      password: "password789",
    },
    {
      id: 8,
      name: "Anastasia Mcdaniel",
      status: "inactive",
      email: "anastasia.spring@mcdaniel2.com",
      birthDate: "02/11/1968",
      role: "User",
      phone: "890-123-4567",
      password: "password890",
    },
    {
      id: 9,
      name: "Melvin Boyle",
      status: "active",
      email: "Me.boyle@gmail.com",
      birthDate: "08/03/1974",
      role: "User",
      phone: "901-234-5678",
      password: "password901",
    },
    {
      id: 10,
      name: "Kailee Thomas",
      status: "active",
      email: "Kailee.thomas@gmail.com",
      birthDate: "11/28/1954",
      role: "User",
      phone: "012-345-6789",
      password: "password012",
    },
  ]);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    role: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Account>>({});
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [accountToSave, setAccountToSave] = useState<Account | null>(null);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newAccount, setNewAccount] = useState<Omit<Account, "id"> & { id?: number }>({
    name: "",
    status: "active",
    email: "",
    birthDate: "",
    role: "User",
    phone: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const togglePasswordVisibility = (id: number) => {
    setShowPassword((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter and search logic
  const [sortConfig, setSortConfig] = useState<{
    key: "name" | "birthDate" | "";
    direction: "ascending" | "descending";
  }>({ key: "", direction: "ascending" });

  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (account) =>
          account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter((account) => account.status === filters.status);
    }

    // Apply role filter
    if (filters.role) {
      result = result.filter((account) => account.role === filters.role);
    }

    // Apply sorting
    result.sort((a, b) => {
      const key = sortConfig.key as keyof Account;
      if (a[key] < b[key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [accounts, searchTerm, filters, sortConfig]);

  const requestSort = (key: "name" | "birthDate") => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  const totalPages = Math.ceil(filteredAccounts.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentAccounts = filteredAccounts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleEditClick = (account: Account) => {
    setEditingId(account.id);
    setEditFormData({
      name: account.name,
      email: account.email,
      birthDate: account.birthDate,
      role: account.role,
      status: account.status,
      phone: account.phone,
      password: account.password,
    });
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = (account: Account) => {
    setAccountToSave({
      ...account,
      ...editFormData,
    } as Account);
    setShowChangeModal(true);
  };

  const confirmChanges = () => {
    if (accountToSave) {
      setAccounts(accounts.map((a) => (a.id === accountToSave.id ? accountToSave : a)));
      setEditingId(null);
      setEditFormData({});
      setShowChangeModal(false);
      setAccountToSave(null);
    }
  };

  const cancelChanges = () => {
    setShowChangeModal(false);
    setAccountToSave(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleAddAccountClick = () => {
    setShowAddAccountModal(true);
    setNewAccount({
      name: "",
      status: "active",
      email: "",
      birthDate: "",
      role: "User",
      phone: "",
      password: "",
    });
    setValidationErrors({});
  };

  const validateNewAccount = () => {
    const errors: Record<string, string> = {};

    if (!newAccount.name.trim()) {
      errors.name = "Name is required";
    }

    if (!newAccount.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAccount.email)) {
      errors.email = "Invalid email format";
    }

    if (!newAccount.birthDate.trim()) {
      errors.birthDate = "Birth date is required";
    }

    if (!newAccount.phone.trim()) {
      errors.phone = "Phone is required";
    }

    if (!newAccount.password.trim()) {
      errors.password = "Password is required";
    } else if (newAccount.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBirthDateChange = (date: string) => {
    setNewAccount((prev) => ({ ...prev, birthDate: date }));
  };
  const handleNewAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAccount((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSaveNewAccount = () => {
    if (!validateNewAccount()) return;

    const newId = Math.max(...accounts.map((a) => a.id), 0) + 1;
    setAccounts([
      ...accounts,
      {
        ...newAccount,
        id: newId,
      } as Account,
    ]);
    setShowAddAccountModal(false);
    setNewAccount({
      name: "",
      status: "active",
      email: "",
      birthDate: "",
      role: "User",
      phone: "",
      password: "",
    });
  };

  const handleCancelAddAccount = () => {
    setShowAddAccountModal(false);
    setNewAccount({
      name: "",
      status: "active",
      email: "",
      birthDate: "",
      role: "User",
      phone: "",
      password: "",
    });
    setValidationErrors({});
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      role: "",
    });
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#EFEFEF] text-gray-800 min-h-screen flex">
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
              <span>trong tổng số {filteredAccounts.length} tài khoản</span>
            </div>
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
              <button
                onClick={handleAddAccountClick}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                THÊM TÀI KHOẢN
              </button>
            </div>
          </div>

          {/* Filter dropdown */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Tất cả</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
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
                    <option value="User">User</option>
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
                    #
                  </th>
                  {/* Name header */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => requestSort("name")}
                    >
                      Họ và tên
                      {sortConfig.key === "name" ? (
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
                    <div className="flex items-center justify-between">
                      Status
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                    <div className="flex items-center justify-between">
                      E-Mail
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  {/* Birth Date header */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => requestSort("birthDate")}
                    >
                      Ngày sinh
                      {sortConfig.key === "birthDate" ? (
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
                    <div className="flex items-center justify-between">
                      Vai trò
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                    Password
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentAccounts.length > 0 ? (
                  currentAccounts.map((account, index) => (
                    <tr key={account.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">{account.id}</td>

                      {/* Name */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                        {editingId === account.id ? (
                          <input
                            type="text"
                            name="name"
                            value={editFormData.name || ""}
                            onChange={handleEditFormChange}
                            className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                          />
                        ) : (
                          account.name
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap border-r">
                        {editingId === account.id ? (
                          <select
                            name="status"
                            value={editFormData.status || ""}
                            onChange={handleEditFormChange}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                account.status === "active" ? "bg-green-500" : "bg-red-500"
                              }`}
                            ></div>
                            <span className="text-sm text-gray-700 capitalize">{account.status}</span>
                          </div>
                        )}
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                        {editingId === account.id ? (
                          <input
                            type="email"
                            name="email"
                            value={editFormData.email || ""}
                            onChange={handleEditFormChange}
                            className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                          />
                        ) : (
                          account.email
                        )}
                      </td>

                      {/* Birth Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                        {editingId === account.id ? (
                          <DatePicker
                            value={editFormData.birthDate || ""}
                            onChange={(date) => handleEditFormChange({ target: { name: "birthDate", value: date } })}
                            className={undefined}
                            hasError={undefined}
                          />
                        ) : (
                          account.birthDate
                        )}
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                        {editingId === account.id ? (
                          <select
                            name="role"
                            value={editFormData.role || ""}
                            onChange={handleEditFormChange}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            <option value="Admin">Admin</option>
                            <option value="Staff">Staff</option>
                            <option value="User">User</option>
                          </select>
                        ) : (
                          account.role
                        )}
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                        {editingId === account.id ? (
                          <input
                            type="text"
                            name="phone"
                            value={editFormData.phone || ""}
                            onChange={handleEditFormChange}
                            className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                          />
                        ) : (
                          account.phone
                        )}
                      </td>

                      {/* Password */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                        {editingId === account.id ? (
                          <div className="flex items-center">
                            <input
                              type={showPassword[account.id] ? "text" : "password"}
                              name="password"
                              value={editFormData.password || ""}
                              onChange={handleEditFormChange}
                              className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(account.id)}
                              className="ml-2 text-gray-500 hover:text-blue-600"
                            >
                              {showPassword[account.id] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span>{showPassword[account.id] ? account.password : "****"}</span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(account.id)}
                              className="ml-2 text-gray-500 hover:text-blue-600"
                            >
                              {showPassword[account.id] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        {editingId === account.id ? (
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
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleEditClick(account)}
                              className="bg-blue-100 hover:bg-blue-200 transition-colors duration-200 cursor-pointer p-2 rounded border border-blue-300 text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                      Không tìm thấy tài khoản nào phù hợp
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
      </main>

      {/* Change Confirmation Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Xác nhận thay đổi</h3>
            <p className="text-sm text-gray-500 mb-6">Bạn có chắc chắn muốn lưu các thay đổi này?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelChanges}
                className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 cursor-pointer"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm tài khoản mới</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={newAccount.name}
                  onChange={handleNewAccountChange}
                  className={`w-full border ${
                    validationErrors.name ? "border-red-500" : "border-gray-300"
                  } rounded px-3 py-2 text-sm`}
                />
                {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newAccount.email}
                  onChange={handleNewAccountChange}
                  className={`w-full border ${
                    validationErrors.email ? "border-red-500" : "border-gray-300"
                  } rounded px-3 py-2 text-sm`}
                />
                {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                <DatePicker
                  value={newAccount.birthDate}
                  onChange={handleBirthDateChange}
                  hasError={!!validationErrors.birthDate}
                  className={`w-full ${validationErrors.birthDate ? "border-red-500" : "border-gray-300"}`}
                />
                {validationErrors.birthDate && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.birthDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={newAccount.phone}
                  onChange={handleNewAccountChange}
                  className={`w-full border ${
                    validationErrors.phone ? "border-red-500" : "border-gray-300"
                  } rounded px-3 py-2 text-sm`}
                />
                {validationErrors.phone && <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="flex items-center">
                  <input
                    type={showPassword[0] ? "text" : "password"}
                    name="password"
                    value={newAccount.password}
                    onChange={handleNewAccountChange}
                    className={`w-full border ${
                      validationErrors.password ? "border-red-500" : "border-gray-300"
                    } rounded px-3 py-2 text-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(0)}
                    className="ml-2 text-gray-500 hover:text-blue-600"
                  >
                    {showPassword[0] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                <select
                  name="role"
                  value={newAccount.role}
                  onChange={handleNewAccountChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="User">User</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  name="status"
                  value={newAccount.status}
                  onChange={handleNewAccountChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelAddAccount}
                className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveNewAccount}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 cursor-pointer"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDashboard;
