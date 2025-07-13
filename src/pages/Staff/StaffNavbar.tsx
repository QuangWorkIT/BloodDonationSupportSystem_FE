import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/authen/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
type NavItem = {
  id: string;
  label: string;
  href: string;
};

const StaffNavbar = () => {
  const { accessToken } = useAuth()
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { id: "urgent", label: "Khẩn cấp", href: "donorsearch" },
    { id: "chia-se", label: "Chia sẻ", href: "blogs" },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between h-20">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-[#C14B53] rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xs">BD</span>
          </div>
        </div>

        {/* Centered navigation group with animations */}
        <div className="absolute right-1 transform -translate-x-15">
          <div className="flex items-center space-x-10">
            {(
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.href}
                    onClick={() => setActiveItem(item.id)}
                    className={`text-base transition-all duration-500 ${item.id === "urgent"
                      ? "bg-[#C14B53] text-white px-4 py-2 rounded-md font-medium shadow-sm scale-100 hover:scale-105"
                      : activeItem === item.id
                        ? "text-[#C14B53] border-b-2 border-[#C14B53] pb-1 font-medium scale-100 hover:scale-105"
                        : "text-[#C14B53] pb-1 font-medium hover:border-b-2 hover:border-[#C14B53] hover:opacity-80 scale-100 hover:scale-105"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}

            {/* Login button */}
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="w-8 h-8 bg-[#C14B53] rounded-full flex items-center justify-center hover:bg-[#8B0B1A] hover:cursor-pointer">
                    <FaUser size={18} color="#fff" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-30">
                  <DropdownMenuRadioGroup>
                    {
                      accessToken ? (
                        <DropdownMenuRadioItem value="profile">
                          <Link to={'/profile'}>
                            Profile
                          </Link>
                        </DropdownMenuRadioItem>
                      ) : (
                        <DropdownMenuRadioItem value="login">
                          <Link to={'/login'}>
                            Login
                          </Link>
                        </DropdownMenuRadioItem>
                      )
                    }
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Empty div to balance the flex layout */}
        <div className="w-10"></div>
      </div>
    </nav>
  );
};

export default StaffNavbar;
