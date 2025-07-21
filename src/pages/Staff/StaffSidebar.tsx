import { Archive, Droplet, HeartPlus, SquareActivity } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const StaffSidebar = ({ activeItem, setActiveItem }: SidebarProps) => {
  const location = useLocation();

  const navItems = [
    {
      id: "inventory",
      path: "/staff",
      icon: <Archive className="w-6 h-6" />,
      label: "Kho máu",
    },
    {
      id: "donation-management",
      path: "/staff/receipt",
      icon: <Droplet className="w-6 h-6" />,
      label: "Quản lý hiến máu",
    },
    {
      id: "waiting-receive",
      path: "/staff/bloodcollect",
      icon: <HeartPlus className="w-6 h-6" />,
      label: "Chờ lấy máu",
    },
    {
      id: "waiting-analysis",
      path: "/staff/bloodanalysis",
      icon: <SquareActivity className="w-6 h-6" />,
      label: "Chờ xét nghiệm máu",
    },
  ];

  return (
    <aside className="bg-white h-full w-[280px] border-r border-gray-200 shadow-sm flex flex-col">
      <nav className="py-6 px-4 space-y-3 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            onClick={() => setActiveItem(item.id)}
            className={`flex items-center gap-4 w-full px-4 py-3 text-base transition-all duration-300 rounded-lg cursor-pointer group 
              ${
                location.pathname === item.path ||
                (item.path === "/staff/receipt" && location.pathname.includes("/staff/receipt")) ||
                (item.path === "/staff/bloodcollect" && location.pathname.includes("/staff/bloodcollect")) ||
                (item.path === "/staff/bloodanalysis" && location.pathname.includes("/staff/bloodanalysis")) ||
                (item.path === "/staff" && location.pathname === "/staff")
                  ? "bg-[#C14B53] text-white shadow-md"
                  : "text-gray-600 hover:bg-[#F8E6E9] hover:text-[#C14B53]"
              }`}
          >
            <div
              className={`p-2 rounded-lg transition-all duration-300 ${
                location.pathname.includes(item.path)
                  ? "bg-white/20"
                  : "bg-gray-100 group-hover:bg-white/80"
              }`}
            >
              {item.icon}
            </div>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default StaffSidebar;
