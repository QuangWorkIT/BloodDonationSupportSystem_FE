import { Users, BarChart3, Settings, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const AdminSidebar = ({ activeItem, setActiveItem }: SidebarProps) => {
  const location = useLocation();
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
  ];

  return (
    <aside className="sticky top-0 bg-white min-h-screen w-[280px] border-r border-blue-100 shadow-sm flex flex-col">
      <nav className="py-6 px-4 space-y-3 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            onClick={() => setActiveItem(item.id)}
            className={`flex items-center gap-4 w-full px-4 py-3 text-base transition-all duration-300 rounded-lg cursor-pointer group
              ${
                location.pathname === item.path || activeItem === item.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-blue-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
          >
            <div
              className={`p-2 rounded-lg transition-all duration-300 ${
                location.pathname === item.path || activeItem === item.id
                  ? "bg-white/20"
                  : "bg-blue-50 group-hover:bg-white/80"
              }`}
            >
              {item.icon}
            </div>
            <span className="font-medium">{item.label}</span>
            {item.id === "settings" && <ChevronDown className="w-5 h-5" />}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
