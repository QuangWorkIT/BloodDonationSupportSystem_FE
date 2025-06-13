import { useState } from "react";
import { FaSearch, FaTimes, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

type NavItem = {
  id: string;
  label: string;
  href: string;
};

const StaffNavbar = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const navItems: NavItem[] = [
    { id: "urgent", label: "Khẩn cấp", href: "/" },
    { id: "trang-chu", label: "Trang chủ", href: "/" },
    { id: "chia-se", label: "Chia sẻ", href: "/blogs" },
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
            {!showSearch && (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.href}
                    onClick={() => setActiveItem(item.id)}
                    className={`text-base transition-all duration-500 ${
                      item.id === "urgent"
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

            <div className="relative ml-6 ">
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
            {/* Login button */}
            <div className="flex flex-col items-center justify-center ml-6">
              <div className="w-8 h-8 bg-[#C14B53] rounded-full flex items-center justify-center mb-1 hover:bg-[#8B0B1A] transition duration-200 cursor-pointer">
                <FaUser size={18} color="#fff" />
              </div>
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
