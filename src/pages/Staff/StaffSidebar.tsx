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
    <aside className="bg-white h-full w-[250px] border-r border-gray-300 shadow-lg">
      <nav className="py-6 px-3 space-y-4 flex-1 flex flex-col ">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            onClick={() => setActiveItem(item.id)}
            className={`flex justify-center items-center gap-3 w-full h-[80px] px-4 py-4 text-md transition-colors rounded-lg cursor-pointer 
              ${((location.pathname.includes(item.path) || location.pathname.includes("/staff/donorsearch")) && activeItem === item.id)
                ? "bg-red-400 text-white"
                : "text-gray-600 hover:bg-red-50 hover:text-red-400"
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
