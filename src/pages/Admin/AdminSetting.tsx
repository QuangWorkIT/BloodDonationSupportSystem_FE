import { useState } from "react";
import { Save, Droplet, Mail, Shield, Check, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

const AdminSettings = () => {
  const [activeSidebarItem, setActiveSidebarItem] = useState("settings");
  const [formData, setFormData] = useState({
    donationInterval: "56", // ngày giữa các lần hiến
    notificationEnabled: true,
    emailSender: "noreply@blooddonor.org",
    maintenanceMode: false,
    minDonorAge: "18",
    maxDonorAge: "65",
    appointmentDuration: "30", // phút
    passwordResetExpiry: "24", // giờ
  });
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveModal(true);
  };

  const confirmSave = () => {
    // save logic
    setShowSaveModal(false);
  };

  const cancelSave = () => {
    setShowSaveModal(false);
  };

  return (
    <div className="flex min-h-screen h-full w-screen bg-[#EFEFEF] overflow-x-hidden ">
      <AdminSidebar activeItem={activeSidebarItem} setActiveItem={setActiveSidebarItem} />

      <main className="flex-1 bg-blue-50 p-6 pt-27">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {/* Content */}
          <div className="p-8">
            {/* Title và breadcrumb */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Droplet className="text-red-500" />
                Cài Đặt Hệ Thống
              </h1>
              <div className="text-sm text-gray-500">
                <span>Dashboard</span>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Cài đặt</span>
              </div>
            </div>

            {/* Form setting */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2 flex items-center gap-2 mt-8">
                  <Mail className="text-blue-500 w-5 h-5" />
                  Cài Đặt Thông Báo
                </h2>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notificationEnabled"
                    name="notificationEnabled"
                    checked={formData.notificationEnabled}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notificationEnabled" className="ml-2 block text-sm text-gray-700">
                    Bật thông báo email
                  </label>
                </div>

                {formData.notificationEnabled && (
                  <div>
                    <label htmlFor="emailSender" className="block text-sm font-medium text-gray-700 mb-1">
                      Email gửi thông báo
                    </label>
                    <input
                      type="email"
                      id="emailSender"
                      name="emailSender"
                      value={formData.emailSender}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                )}

                <h2 className="text-lg font-medium text-gray-900 border-b pb-2 flex items-center gap-2 mt-8">
                  <Shield className="text-green-500 w-5 h-5" />
                  Tùy Chọn Hệ Thống
                </h2>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    name="maintenanceMode"
                    checked={formData.maintenanceMode}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                    Chế độ bảo trì (tắt truy cập công khai)
                  </label>
                </div>

                <div>
                  <label htmlFor="passwordResetExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                    Thời hạn link đặt lại mật khẩu (giờ)
                  </label>
                  <input
                    type="number"
                    id="passwordResetExpiry"
                    name="passwordResetExpiry"
                    value={formData.passwordResetExpiry}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    min="1"
                    max="72"
                  />
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Lưu Cài Đặt
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Xác Nhận Thay Đổi</h3>
            <p className="text-sm text-gray-500 mb-6">Bạn có chắc chắn muốn lưu các thay đổi cài đặt này?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelSave}
                className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Hủy
              </button>
              <button
                onClick={confirmSave}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Xác Nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
