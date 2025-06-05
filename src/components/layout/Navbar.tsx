import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = {
  id: string;
  label: string;
  href: string;
};

const BloodDonationNavbar = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const navItems: NavItem[] = [
    { id: "su-kien", label: "Sự kiện hiến máu", href: "/events" },
    { id: "trang-chu", label: "Trang chủ", href: "/" },
    { id: "ve-chung-toi", label: "Về chúng tôi", href: "/about" },
    { id: "chia-se", label: "Chia sẻ", href: "/share" },
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
        <div className="absolute right-1 transform -translate-x-85">
          <div className="flex items-center space-x-10">
            {!showSearch && (
              <>
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveItem(activeItem === item.id ? null : item.id);
                    }}
                    className={`
                      text-base transition-all duration-200
                      ${
                        activeItem === item.id
                          ? "bg-[#C14B53] text-white px-4 py-2 rounded-md font-medium shadow-sm"
                          : "text-[#C14B53] border-b-2 border-[#C14B53] pb-1 font-medium hover:opacity-80"
                      }
                    `}
                  >
                    {item.label}
                  </a>
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
                    animate={{ x: -130, opacity: 1, width: 400 }}
                    exit={{ x: 100, opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center bg-white px-6 py-2 rounded-md shadow-sm border border-gray-200 origin-right"
                  >
                    <input
                      type="text"
                      placeholder="Tìm kiếm sự kiện..."
                      className="w-full py-1 px-2 text-base focus:outline-none"
                      autoFocus
                    />
                    {/* do not use built in button */}
                    <button
                      onClick={() => setShowSearch(false)}
                      className="text-gray-600 hover:text-[#C14B53] cursor-pointer transition ml-4"
                    >
                      <FaTimes size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Empty div to balance the flex layout */}
        <div className="w-10"></div>
      </div>
    </nav>
  );
};

export default BloodDonationNavbar;