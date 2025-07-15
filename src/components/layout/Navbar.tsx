import { useState, useRef, useEffect } from "react";
import { FaBars, FaUser, FaTimes, FaCalendarAlt, FaHome, FaTint, FaRegNewspaper } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/authen/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'react-toastify';

const navItems = [
  { id: "event", label: "Sự kiện hiến máu", href: "/events", icon: <FaCalendarAlt className="mr-2" /> },
  { id: "home", label: "Trang chủ", href: "/", icon: <FaHome className="mr-2" /> },
  { id: "info", label: "Thông tin máu", href: "/bloodinfo", icon: <FaTint className="mr-2" /> },
  { id: "share", label: "Chia sẻ", href: "/blogs", icon: <FaRegNewspaper className="mr-2" /> },
];

export default function BloodDonationNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { accessToken, user, isLoading, setToken, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line no-empty-pattern
  const [] = useState<number | null>(null);

  const activeItem = navItems.find((item) =>
    location.pathname === item.href || (item.href === "/" && location.pathname === "/home")
  )?.id;

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
      if (e.key === "Tab" && mobileMenuRef.current) {
        const focusableEls = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const profileLabel = accessToken ? (user?.unique_name || "Tài khoản") : "Đăng nhập";

  return (
    <nav className="bg-white shadow-sm w-full sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 h-[80px]">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden cursor-pointer p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#C14B53]"
          aria-label="Mở menu"
        >
          <FaBars size={24} className="text-[#C14B53]" />
        </button>
        <Link to="/" className="flex items-center gap-2 focus:outline-none focus-visible:outline-none cursor-pointer" tabIndex={0} aria-label="Trang chủ">
          <div className="w-10 h-10 bg-[#C14B53] dark:bg-[#333] rounded-full flex items-center justify-center cursor-pointer">
            <span className="text-white font-bold text-xs">BD</span>
          </div>
          <span className="ml-2 text-[#C14B53] dark:text-white font-bold text-lg hidden sm:inline">Blood Donation</span>
        </Link>
        <div className="flex items-center md:mr-0 gap-6">
          <div className="md:flex hidden space-x-4 lg:space-x-10">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={`transition font-medium text-base px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C14B53] flex items-center cursor-pointer ${
                  activeItem === item.id
                    ? "bg-[#C14B53] text-white"
                    : "text-[#C14B53] hover:bg-[#C14B53]/10"
                }`}
                tabIndex={0}
                aria-current={activeItem === item.id ? "page" : undefined}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center pl-2 pr-2 relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-8 h-8 bg-[#C14B53] dark:bg-white rounded-full flex items-center justify-center hover:bg-[#8B0B1A] focus:outline-none focus:ring-2 focus:ring-[#C14B53] relative group cursor-pointer"
                  aria-label={profileLabel}
                  tabIndex={0}
                >
                  <FaUser size={18} color="#fff" />
                  <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#18181b] animate-pulse" />
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition whitespace-nowrap z-50">
                    {profileLabel}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-0 rounded-2xl shadow-2xl border-0 overflow-hidden bg-white dark:bg-[#23232b]">
                <div className="py-2">
                  {isLoading ? (
                    <div className="flex items-center px-4 py-6 text-gray-500 justify-center">
                      <span className="animate-spin inline-block w-5 h-5 border-2 border-[#C14B53] border-t-transparent rounded-full mr-2"></span>
                      Đang tải...
                    </div>
                  ) : accessToken ? (
                    <>
                      <div className="flex items-center gap-3 px-5 py-4 border-b dark:border-[#333] bg-[#F8F9FA] dark:bg-[#23232b]">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#C14B53] dark:bg-[#333]">
                          <FaUser size={22} color="#fff" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#C14B53] dark:text-white text-base">{user?.unique_name || 'Tài khoản'}</span>
                          {user?.gmail && <span className="text-xs text-gray-500 dark:text-gray-300">{user.gmail}</span>}
                        </div>
                      </div>
                      <Link
                        to={"/profile"}
                        className="flex items-center gap-2 px-5 py-3 text-[#C14B53] dark:text-white hover:bg-[#F8F9FA] dark:hover:bg-[#222] transition font-medium text-base focus:outline-none focus:bg-[#F8F9FA] dark:focus:bg-[#222] cursor-pointer"
                        tabIndex={0}
                      >
                        <FaUser className="mr-2" /> Tài khoản
                      </Link>
                      <button
                        className="flex items-center gap-2 w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-[#222] transition font-medium text-base focus:outline-none focus:bg-red-50 dark:focus:bg-[#222] cursor-pointer"
                        tabIndex={0}
                        onClick={() => {
                          setToken(null);
                          setUser(null);
                          toast.success('Đăng xuất thành công!');
                          navigate('/', { replace: true });
                        }}
                      >
                        <FaTimes className="mr-2" /> Đăng xuất
                      </button>
                    </>
                  ) : (
                    <Link
                      to={"/login"}
                      className="flex items-center gap-2 px-5 py-3 text-[#C14B53] dark:text-white hover:bg-[#F8F9FA] dark:hover:bg-[#222] transition font-medium text-base focus:outline-none focus:bg-[#F8F9FA] dark:focus:bg-[#222] cursor-pointer"
                      tabIndex={0}
                    >
                      <FaUser className="mr-2" /> Đăng nhập
                    </Link>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40 cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              aria-label="Đóng menu"
              tabIndex={-1}
            />
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="fixed top-0 left-0 right-0 md:hidden bg-white shadow-md px-2 pb-4 pt-4 space-y-2 z-50"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex justify-between items-center px-2 mb-2">
                <span className="text-[#C14B53] font-bold text-lg">Menu</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C14B53] cursor-pointer"
                  aria-label="Đóng menu"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3 rounded transition text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#C14B53] flex items-center cursor-pointer ${
                    activeItem === item.id ? "bg-[#C14B53] text-white" : "hover:bg-[#C14B53]/10 text-black"
                  }`}
                  tabIndex={0}
                  aria-current={activeItem === item.id ? "page" : undefined}
                  style={{ minHeight: 44 }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
