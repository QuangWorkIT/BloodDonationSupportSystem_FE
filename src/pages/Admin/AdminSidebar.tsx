import {
    Home,
    Users,
    BarChart3,
    Settings,
    ChevronDown,
    HelpCircle,
    LogOut,
  } from "lucide-react";
  
  interface SidebarProps {
    activeItem: string;
    setActiveItem: (item: string) => void;
  }
  
  const AdminSidebar = ({ activeItem, setActiveItem }: SidebarProps) => {
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
              onClick={() => setActiveItem("home")}
              className={`flex items-center gap-6 w-full px-4 py-4 text-md text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg cursor-pointer ${
                activeItem === "home" ? "bg-blue-600 text-white" : ""
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-md font-medium">Trang chủ</span>
            </button>
            <button
              onClick={() => setActiveItem("accounts")}
              className={`flex items-center gap-6 w-full px-4 py-4 text-md text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg cursor-pointer ${
                activeItem === "accounts" ? "bg-blue-600 text-white" : ""
              }`}
            >
              <Users className="w-6 h-6" />
              <span className="text-md font-medium">Tài khoản</span>
            </button>
            <button
              onClick={() => setActiveItem("stats")}
              className={`flex items-center gap-6 w-full px-4 py-4 text-md text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg cursor-pointer ${
                activeItem === "stats" ? "bg-blue-600 text-white" : ""
              }`}
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-md font-medium">Thống kê</span>
            </button>
            <button
              onClick={() => setActiveItem("settings")}
              className={`flex items-center justify-between w-full px-4 py-4 text-md text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg cursor-pointer ${
                activeItem === "settings" ? "bg-blue-600 text-white" : ""
              }`}
            >
              <div className="flex items-center gap-6">
                <Settings className="w-6 h-6" />
                <span className="text-md font-medium">Cài đặt</span>
              </div>
              <ChevronDown className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveItem("help")}
              className={`flex items-center gap-6 w-full px-4 py-4 text-md text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg cursor-pointer ${
                activeItem === "help" ? "bg-blue-600 text-white" : ""
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
  
  export default AdminSidebar;