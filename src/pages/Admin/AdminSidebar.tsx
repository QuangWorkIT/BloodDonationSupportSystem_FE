import { useAuth } from "@/hooks/authen/AuthContext";
import {
  Users,
  BarChart3,
  Settings,
  ChevronDown,
  // HelpCircle,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface SidebarProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const AdminSidebar = ({ activeItem, setActiveItem }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    navigate("/login", { replace: true });
    toast.success("Đăng xuất thành công!");
  };
  // Define your navigation items with their paths
  const navItems = [
    {
      id: "accounts",
      path: "/admin",
      icon: <Users className="w-6 h-6" />,
      label: "Tài khoản",
    },
    {
      id: "stats",
      path: "/admin/analytics",
      icon: <BarChart3 className="w-6 h-6" />,
      label: "Thống kê",
    },
    {
      id: "settings",
      path: "/admin/settings",
      icon: <Settings className="w-6 h-6" />,
      label: "Cài đặt",
    },
    // {
    //   id: "help",
    //   path: "/admin/help",
    //   icon: <HelpCircle className="w-6 h-6" />,
    //   label: "Hỗ trợ",
    // },
  ];

  return (
    <aside className="bg-white flex flex-col border-r border-gray-200 shadow-sm min-h-screen h-screen sticky top-0">
      <div className="flex-1">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
          <div className="w-10 h-10 bg-[#C14B53] dark:bg-[#333] rounded-full flex items-center justify-center cursor-pointer">
            <span className="text-white font-bold text-xs">BD</span>
          </div>
          <span className="ml-2 text-[#C14B53] dark:text-white font-bold text-lg hidden sm:inline">
            Blood Donation
          </span>
        </div>
        <nav className="py-6 px-3 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setActiveItem(item.id)}
              className={`flex items-center gap-6 w-full px-4 py-4 text-md transition-colors rounded-lg cursor-pointer ${
                location.pathname === item.path || activeItem === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {item.icon}
              <span className="text-md font-medium">{item.label}</span>
              {item.id === "settings" && <ChevronDown className="w-5 h-5" />}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-gray-100 p-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors rounded-lg cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
