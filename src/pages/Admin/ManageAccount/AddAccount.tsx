import { useState, type ChangeEvent } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import DatePicker from "@/components/ui/datepicker";
import { authenApi } from "@/lib/instance";
import { AxiosError } from "axios";
import { FaInfoCircle } from "react-icons/fa";

// Type definitions
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

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  gmail?: string;
  phone?: string;
  password?: string;
  bloodTypeId?: string;
  dob?: string;
  [key: string]: string | undefined;
}

interface AddAccountModalProps {
  onSave: (account: StaffAccount) => Promise<void>;
  onCancel: () => void;
}

const AddAccountModal = ({ onSave, onCancel }: AddAccountModalProps) => {
  // Form state with default values
  const [formData, setFormData] = useState<StaffAccount>({
    firstName: "",
    lastName: "",
    phone: "",
    gmail: "",
    password: "",
    longitude: 0,
    latitude: 0,
    bloodTypeId: 1, // Default to first blood type
    dob: "",
    gender: true, // Default to male
  });

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Blood type options
  const bloodTypeOptions = [
    { id: 1, label: "A+" },
    { id: 2, label: "A-" },
    { id: 3, label: "B+" },
    { id: 4, label: "B-" },
    { id: 5, label: "AB+" },
    { id: 6, label: "AB-" },
    { id: 7, label: "O+" },
    { id: 8, label: "O-" },
  ];

  // Validation
  const validateField = (name: keyof StaffAccount, value: string | number | boolean): string | undefined => {
    switch (name) {
      case "firstName":
      case "lastName":
        return value.toString().trim() ? undefined : `${name} is required`;
      case "gmail":
        if (!value.toString().trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toString())) return "Invalid email format";
        return undefined;
      case "dob":
        return value.toString() ? undefined : "Date of birth is required";
      case "phone":
        if (!value.toString().trim()) return "Phone is required";
        if (!/^(0|\+84|84)(3|5|7|8|9)[0-9]{8}$/.test(value.toString())) return "Invalid phone number";
        return undefined;
      case "password":
        if (!value.toString().trim()) return "Password is required";
        if (value.toString().length < 6) return "Password must be at least 6 characters";
        return undefined;
      case "bloodTypeId":
        return value ? undefined : "Blood type is required";
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof StaffAccount>).forEach((field) => {
      // Skip location fields as they have default values
      if (field === "longitude" || field === "latitude") return;

      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handlers
  const handleDateChange = (date: Date) => {
    const isoDate = date.toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, dob: isoDate }));
    if (errors.dob) setErrors((prev) => ({ ...prev, dob: undefined }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      const error = validateField(
        name as keyof StaffAccount,
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value
      );
      if (!error) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleNumberInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);

    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(numValue) ? 0 : numValue,
    }));

    if (errors[name as keyof FormErrors]) {
      const error = validateField(name as keyof StaffAccount, isNaN(numValue) ? 0 : numValue);
      if (!error) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleSubmit = async () => {
    setApiError(null);
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await authenApi.post<ApiResponse<StaffAccount>>("/add-staff", formData);

      if (response.data.isSuccess) {
        await onSave(formData);
      } else {
        setApiError(response.data.message || "Failed to create staff account");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      setApiError(
        axiosError.response?.data?.message || axiosError.message || "An error occurred while creating the staff account"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Thêm Tài Khoản Nhân Viên Mới</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {apiError && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{apiError}</div>}

        <div className="space-y-4 mb-6">
          {/* First Name Field */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Tên
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } rounded px-3 py-2 text-sm`}
              aria-invalid={errors.firstName ? "true" : "false"}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
            />
            {errors.firstName && (
              <p id="firstName-error" className="text-red-500 text-xs mt-1">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name Field */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Họ
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full border ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } rounded px-3 py-2 text-sm`}
              aria-invalid={errors.lastName ? "true" : "false"}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
            />
            {errors.lastName && (
              <p id="lastName-error" className="text-red-500 text-xs mt-1">
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="gmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="gmail"
              type="email"
              name="gmail"
              value={formData.gmail}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full border ${
                errors.gmail ? "border-red-500" : "border-gray-300"
              } rounded px-3 py-2 text-sm`}
              aria-invalid={errors.gmail ? "true" : "false"}
              aria-describedby={errors.gmail ? "gmail-error" : undefined}
            />
            {errors.gmail && (
              <p id="gmail-error" className="text-red-500 text-xs mt-1">
                {errors.gmail}
              </p>
            )}
          </div>

          {/* Date of Birth Field */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
              Ngày Sinh
            </label>
            <DatePicker
              id="dob"
              value={formData.dob ? new Date(formData.dob) : null}
              onChange={handleDateChange}
              disabled={isSubmitting}
              hasError={!!errors.dob}
              className={`w-full ${errors.dob ? "border-red-500" : "border-gray-300"}`}
              aria-invalid={errors.dob ? "true" : "false"}
              aria-describedby={errors.dob ? "dob-error" : undefined}
              placeholderText="DD/MM/YYYY"
            />
            {errors.dob && (
              <p id="dob-error" className="text-red-500 text-xs mt-1">
                {errors.dob}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Số Điện Thoại
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded px-3 py-2 text-sm`}
              aria-invalid={errors.phone ? "true" : "false"}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="text-red-500 text-xs mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật Khẩu
            </label>
            <div className="flex items-center">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`w-full border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded px-3 py-2 text-sm`}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="ml-2 text-gray-500 hover:text-blue-600"
                disabled={isSubmitting}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Blood Type Field */}
          <div>
            <label
              htmlFor="bloodTypeId"
              className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
            >
              Nhóm Máu
              <span className="relative group">
                <FaInfoCircle className="text-blue-500 cursor-pointer" />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 w-64 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 break-words whitespace-normal">
                  Nhóm máu chính xác sẽ được xác nhận bởi nhân viên y tế sau quá trình xét nghiệm máu
                </span>
              </span>
            </label>
            <select
              id="bloodTypeId"
              name="bloodTypeId"
              value={formData.bloodTypeId}
              onChange={handleNumberInputChange}
              disabled={isSubmitting}
              className={`w-full border ${
                errors.bloodTypeId ? "border-red-500" : "border-gray-300"
              } rounded px-3 py-2 text-sm`}
              aria-invalid={errors.bloodTypeId ? "true" : "false"}
              aria-describedby={errors.bloodTypeId ? "bloodTypeId-error" : undefined}
            >
              {bloodTypeOptions.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.bloodTypeId && (
              <p id="bloodTypeId-error" className="text-red-500 text-xs mt-1">
                {errors.bloodTypeId}
              </p>
            )}
          </div>

          {/* Gender Field */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Giới Tính
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender ? "male" : "female"}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                handleInputChange(e);
              }}
              disabled={isSubmitting}
              className={`w-full border ${
                errors.gender ? "border-red-500" : "border-gray-300"
              } rounded px-3 py-2 text-sm`}
              aria-invalid={errors.gender ? "true" : "false"}
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
            {errors.gender && (
              <p id="gender-error" className="text-red-500 text-xs mt-1">
                {errors.gender}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;
