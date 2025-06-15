import { Archive, Droplet, HeartPlus, SquareActivity } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const StaffSidebar = ({ activeItem, setActiveItem }: SidebarProps) => {
  const location = useLocation();

  // Define your navigation items with their paths
  const navItems = [
    {
      id: "inventory",
      path: "/",
      icon: <Archive className="w-6 h-6" />,
      label: "Kho máu",
    },
    {
      id: "donation-management",
      path: "/test",
      icon: <Droplet className="w-6 h-6" />,
      label: "Quản lý hiến máu",
    },
    {
      id: "waiting-receive",
      path: "/",
      icon: <HeartPlus className="w-6 h-6" />,
      label: "Chờ lấy máu",
    },
    {
      id: "waiting-analysis",
      path: "/",
      icon: <SquareActivity className="w-6 h-6" />,
      label: "Chờ xét nghiệm máu",
    },
  ];

  return (
    <aside className="bg-white h-full w-64 border-r border-gray-300 shadow-lg">
      <nav className="py-6 px-3 space-y-4 flex-1 flex flex-col">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            onClick={() => setActiveItem(item.id)}
            className={`flex items-center gap-6 w-full px-4 py-4 text-md transition-colors rounded-lg cursor-pointer ${
              location.pathname === item.path || activeItem === item.id ? "bg-red-400 text-white" : "text-gray-600 hover:bg-red-50 hover:text-red-400"
            }`}
          >
            {item.icon}
            <span className="text-md font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default StaffSidebar;
