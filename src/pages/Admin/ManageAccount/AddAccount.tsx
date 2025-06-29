import { useState, type ChangeEvent } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import DatePicker from "@/components/ui/datepicker";
import { authenApi } from "@/lib/instance";
import { AxiosError } from "axios";

// Type definitions
type UserStatus = "Active" | "Inactive";
type UserRole = "Admin" | "Staff" | "Member";

interface Account {
  id?: number;
  name: string;
  status: UserStatus;
  email: string;
  dob: string; // ISO date string (YYYY-MM-DD)
  role: UserRole;
  phone: string;
  password: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

interface FormErrors {
  name?: string;
  email?: string;
  dob?: string;
  phone?: string;
  password?: string;
  [key: string]: string | undefined;
}

interface AddAccountModalProps {
  onSave: (account: Omit<Account, "id">) => Promise<void>;
  onCancel: () => void;
}

const AddAccountModal = ({ onSave, onCancel }: AddAccountModalProps) => {
  // Form state - role is fixed as "Staff"
  const [formData, setFormData] = useState<Omit<Account, "id">>({
    name: "",
    status: "Active",
    email: "",
    dob: "",
    role: "Staff", // Fixed role
    phone: "",
    password: "",
  });

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation
  const validateField = (name: keyof Omit<Account, "id">, value: string): string | undefined => {
    switch (name) {
      case "name":
        return value.trim() ? undefined : "Name is required";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        return undefined;
      case "dob":
        return value ? undefined : "Date of birth is required";
      case "phone":
        if (!value.trim()) return "Phone is required";
        if (!/^(0|\+84|84)(3|5|7|8|9)[0-9]{8}$/.test(value)) return "Invalid phone number";
        return undefined;
      case "password":
        if (!value.trim()) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return undefined;
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof Omit<Account, "id">>).forEach((field) => {
      if (field === "status" || field === "role") return;
      
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
    const isoDate = date.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, dob: isoDate }));
    if (errors.dob) setErrors(prev => ({ ...prev, dob: undefined }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Prevent changing role if the field is role
    if (name === "role") return;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      const error = validateField(name as keyof Omit<Account, "id">, value);
      if (!error) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleSubmit = async () => {
    setApiError(null);
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await authenApi.post<ApiResponse<Account>>("/api/users", formData);

      if (response.data.isSuccess) {
        await onSave(formData);
      } else {
        setApiError(response.data.message || "Failed to create account");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      setApiError(
        axiosError.response?.data?.message || 
        axiosError.message || 
        "An error occurred while creating the account"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Add New Account</h3>
          <button 
            onClick={onCancel} 
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {apiError}
          </div>
        )}

        <div className="space-y-4 mb-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded px-3 py-2 text-sm`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-xs mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded px-3 py-2 text-sm`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Date of Birth Field */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <DatePicker
              id="dob"
              value={formData.dob ? new Date(formData.dob) : null}
              onChange={handleDateChange}
              disabled={isSubmitting}
              hasError={!!errors.dob}
              className={`w-full ${errors.dob ? "border-red-500" : "border-gray-300"}`}
              aria-invalid={!!errors.dob}
              aria-describedby={errors.dob ? "dob-error" : undefined}
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
              Phone Number
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
              aria-invalid={!!errors.phone}
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
              Password
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
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="ml-2 text-gray-500 hover:text-blue-600"
                disabled={isSubmitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
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

          {/* Role Field - Display only (read-only) */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              id="role"
              type="text"
              name="role"
              value="Staff"
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100"
            />
          </div>

          {/* Status Field */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;