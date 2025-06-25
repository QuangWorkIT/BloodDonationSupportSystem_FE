import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import DatePicker from "@/components/ui/datepicker";

interface Account {
  name: string;
  status: "active" | "inactive";
  email: string;
  birthDate: string;
  role: string;
  phone: string;
  password: string;
}

interface AddAccountModalProps {
  onSave: (account: Omit<Account, "id">) => void;
  onCancel: () => void;
}

const AddAccountModal = ({ onSave, onCancel }: AddAccountModalProps) => {
  const [newAccount, setNewAccount] = useState<Omit<Account, "id">>({
    name: "",
    status: "active",
    email: "",
    birthDate: "",
    role: "User",
    phone: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateNewAccount = () => {
    const errors: Record<string, string> = {};

    if (!newAccount.name.trim()) {
      errors.name = "Đây là trường bắt buộc";
    }

    if (!newAccount.email.trim()) {
      errors.email = "Đây là trường bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAccount.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!newAccount.birthDate.trim()) {
      errors.birthDate = "Đây là trường bắt buộc";
    }

    if (!newAccount.phone.trim()) {
      errors.phone = "Đây là trường bắt buộc";
    } else if (!/^(0|\+84|84)(3|5|7|8|9)[0-9]{8}$/.test(newAccount.phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (!newAccount.password.trim()) {
      errors.password = "Đây là trường bắt buộc";
    } else if (newAccount.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBirthDateChange = (date: string) => {
    setNewAccount((prev) => ({ ...prev, birthDate: date }));
    if (validationErrors.birthDate) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.birthDate;
        return newErrors;
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSubmit = () => {
    if (validateNewAccount()) {
      onSave(newAccount);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Thêm tài khoản mới</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input
              type="text"
              name="name"
              value={newAccount.name}
              onChange={handleChange}
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
              onChange={handleChange}
              className={`w-full border ${
                validationErrors.email ? "border-red-500" : "border-gray-300"
              } rounded px-3 py-2 text-sm`}
            />
            {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
              Ngày sinh
            </label>

            <DatePicker
              value={newAccount.birthDate ? new Date(newAccount.birthDate) : null}
              onChange={(date: Date) => handleBirthDateChange(date.toISOString())}
              hasError={Boolean(validationErrors?.birthDate)}
              className={`w-full ${validationErrors?.birthDate ? "border-red-500" : "border-gray-300"}`}
              aria-invalid={Boolean(validationErrors?.birthDate)}
              aria-describedby={validationErrors?.birthDate ? "birthDate-error" : undefined}
            />

            {validationErrors?.birthDate && (
              <p id="birthDate-error" className="text-red-500 text-xs mt-1">
                {validationErrors.birthDate}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={newAccount.phone}
              onChange={handleChange}
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
                type={showPassword ? "text" : "password"}
                name="password"
                value={newAccount.password}
                onChange={handleChange}
                className={`w-full border ${
                  validationErrors.password ? "border-red-500" : "border-gray-300"
                } rounded px-3 py-2 text-sm`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="ml-2 text-gray-500 hover:text-blue-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {validationErrors.password && <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select
              name="role"
              value={newAccount.role}
              onChange={handleChange}
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
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 cursor-pointer"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;
