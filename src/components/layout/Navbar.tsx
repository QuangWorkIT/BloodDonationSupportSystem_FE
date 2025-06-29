import { useState } from "react";
import { FaBars, FaSearch, FaTimes, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/authen/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const navItems = [
  { id: "event", label: "Sự kiện hiến máu", href: "/events" },
  { id: "home", label: "Trang chủ", href: "/" },
  { id: "info", label: "Thông tin máu", href: "/bloodinfo" },
  { id: "share", label: "Chia sẻ", href: "/blogs" },

];

export default function BloodDonationNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("event");
  const [showSearch, setShowSearch] = useState(false);
  const { accessToken } = useAuth();

  return (
    <nav className="bg-white shadow-sm w-full sticky">
      <div className="flex items-center justify-between px-6 py-4">
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden cursor-pointer">
          <FaBars size={24} className="text-[#C14B53]" />
        </button>

        <div className="flex items-center max-sm:ml-12">
          <div className="w-10 h-10 bg-[#C14B53] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">BD</span>
          </div>
        </div>

        <div className="flex items-center md:mr-0">
          <div className="md:flex hidden space-x-10">
            {!showSearch &&
              navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => setActiveItem(item.id)}
                  className={`transition font-medium text-base px-4 py-2 rounded-md ${activeItem === item.id ? "bg-[#C14B53] text-white" : "text-[#C14B53] hover:bg-[#C14B53]/10"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
          </div>

          <div className="relative ml-6 max-sm:hidden mr-12">
            <AnimatePresence mode="wait">
              {!showSearch ? (
                <motion.button
                  key="search-button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowSearch(true)}
                  className="absolute -translate-y-1/2 top-1/2 text-gray-600 hover:text-[#C14B53] cursor-pointer transition text-base"
                >
                  <FaSearch size={18} />
                </motion.button>
              ) : (
                <motion.div
                  key="search-bar"
                  initial={{ x: 100, opacity: 0, width: 0 }}
                  animate={{ x: 0, opacity: 1, width: 400 }}
                  exit={{ x: 100, opacity: 0, width: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center bg-white px-6 py-2 rounded-md shadow-sm border border-gray-200 origin-right"
                >
                  <input type="text" placeholder="Tìm kiếm sự kiện..." className="w-full py-1 px-2 text-base focus:outline-none" autoFocus />
                  {/* do not use built in button */}
                  <button onClick={() => setShowSearch(false)} className="text-gray-600 hover:text-[#C14B53] cursor-pointer transition ml-4">
                    <FaTimes size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center">
            <DropdownMenu><DropdownMenuTrigger asChild>
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

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white shadow-md px-2 pb-4 space-y-2"
          >
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                onClick={() => {
                  setActiveItem(item.id);
                  setMenuOpen(false);
                }}
                className={`block px-4 py-2 rounded transition text-base font-medium ${activeItem === item.id ? "bg-[#C14B53] text-white" : "hover:bg-[#C14B53]/10 text-black"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
