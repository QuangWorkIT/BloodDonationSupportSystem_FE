import { useState, useRef, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/authen/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { FaUserInjured, FaRegNewspaper, FaBars, FaUser, FaTimes } from "react-icons/fa";
import { useLocation, useNavigate, Link } from "react-router-dom";


const navItems = [
  { id: "urgent", label: "Khẩn cấp", href: "/staff/donorsearch", icon: <FaUserInjured className="mr-2" /> },
  { id: "share", label: "Chia sẻ", href: "/staff/blogs", icon: <FaRegNewspaper className="mr-2" /> },
];

export default function StaffNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { accessToken, user, isLoading, setToken, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const activeItem = navItems.find((item) => location.pathname.endsWith(item.href))?.id;

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const profileLabel = accessToken ? user?.unique_name || "Tài khoản" : "Đăng nhập";

  return (
    <nav
      className={`fixed left-1/2 top-6 z-50 transition-all duration-300 mb-10
        bg-white/10 backdrop-blur-xl border border-white/20
        ${
          scrolled
            ? "max-w-5xl w-[98vw] py-2 px-6 h-[60px] shadow-xl bg-white/80 border-gray-100"
            : "max-w-6xl w-[99vw] py-8 px-16 h-[100px] shadow-md"
        }
        rounded-2xl -translate-x-1/2 flex items-center justify-between
      `}
      style={{
        boxShadow: scrolled ? "0 8px 32px rgba(193,75,83,0.13)" : "0 2px 8px rgba(193,75,83,0.07)",
        transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
      }}
    >
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden cursor-pointer p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#C14B53]"
        aria-label="Mở menu"
      >
        <FaBars size={24} className="text-[#C14B53]" />
      </button>
      <Link
        to="/staff"
        className="flex items-center gap-2 focus:outline-none cursor-pointer"
        tabIndex={0}
        aria-label="Trang chủ Staff"
      >
        <div className="w-10 h-10 bg-[#C14B53] rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">BD</span>
        </div>
        <span
          className={`ml-2 text-[#C14B53] font-bold text-lg drop-shadow-sm transition-all duration-300 ${
            scrolled ? "hidden" : "hidden md:inline"
          }`}
        >
          Blood Donation
        </span>
      </Link>
      <div
        className={`hidden md:flex flex-1 justify-center items-center gap-2 transition-all duration-300 ${
          scrolled ? "gap-6" : ""
        }`}
      >
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            className={`transition font-semibold text-base flex items-center justify-center cursor-pointer drop-shadow-sm
              ${
                scrolled
                  ? `w-14 h-14 rounded-full ${
                      activeItem === item.id ? "bg-[#C14B53] text-white" : "bg-[#F8E6E9] text-[#C14B53]"
                    }`
                  : `px-4 py-2 rounded-full ${
                      activeItem === item.id
                        ? "bg-[#C14B53] text-white shadow-lg ring-2 ring-[#C14B53]/40"
                        : "text-[#C14B53] hover:bg-[#C14B53]/10 hover:text-[#a83a42]"
                    }`
              }`}
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
            tabIndex={0}
            aria-current={activeItem === item.id ? "page" : undefined}
          >
            <span
              className={`flex items-center justify-center transition-all duration-300 ${
                scrolled ? "text-2xl ml-[7px]" : ""
              }`}
            >
              {item.icon}
            </span>
            <span className={`ml-2 transition-all duration-300 ${scrolled ? "hidden" : "inline"}`}>{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-10 h-10 bg-[#C14B53] rounded-full flex items-center justify-center hover:bg-[#a83a42] focus:outline-none focus:ring-2 focus:ring-[#C14B53] relative group cursor-pointer transition drop-shadow-sm"
              aria-label={profileLabel}
              tabIndex={0}
            >
              <FaUser size={20} color="#fff" />
              <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition whitespace-nowrap z-50">
                {profileLabel}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-0 rounded-2xl shadow-2xl border-0 overflow-hidden bg-white">
            <div className="py-2">
              {isLoading ? (
                <div className="flex items-center px-4 py-6 text-gray-500 justify-center">
                  <span className="animate-spin inline-block w-5 h-5 border-2 border-[#C14B53] border-t-transparent rounded-full mr-2"></span>
                  Đang tải...
                </div>
              ) : accessToken ? (
                <>
                  <div className="flex items-center gap-3 px-5 py-4 border-b bg-[#F8F9FA]">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#C14B53]">
                      <FaUser size={22} color="#fff" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#C14B53] text-base">{user?.unique_name || "Tài khoản"}</span>
                      {user?.gmail && <span className="text-xs text-gray-500">{user.gmail}</span>}
                    </div>
                  </div>
                  <Link
                    to={"/profile"}
                    className="flex items-center gap-2 px-5 py-3 text-[#C14B53] hover:bg-[#F8F9FA] transition font-medium text-base focus:outline-none focus:bg-[#F8F9FA] cursor-pointer"
                    tabIndex={0}
                  >
                    <FaUser className="mr-2" /> Tài khoản
                  </Link>
                  <button
                    className="flex items-center gap-2 w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 transition font-medium text-base focus:outline-none focus:bg-red-50 cursor-pointer"
                    tabIndex={0}
                    onClick={() => setShowLogoutModal(true)}
                  >
                    <FaTimes className="mr-2" /> Đăng xuất
                  </button>
                </>
              ) : (
                <Link
                  to={"/login"}
                  className="flex items-center gap-2 px-5 py-3 text-[#C14B53] hover:bg-[#F8F9FA] transition font-medium text-base focus:outline-none focus:bg-[#F8F9FA] cursor-pointer"
                  tabIndex={0}
                >
                  <FaUser className="mr-2" /> Đăng nhập
                </Link>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 mt-6 w-[92vw] max-w-screen-md bg-white rounded-2xl shadow-2xl px-4 py-6 z-50 flex flex-col gap-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex justify-between items-center mb-2">
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
                className={`block px-4 py-3 rounded-full transition text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#C14B53] flex items-center cursor-pointer
                    ${activeItem === item.id ? "bg-[#C14B53] text-white" : "hover:bg-[#C14B53]/10 text-[#C14B53]"}
                  `}
                tabIndex={0}
                aria-current={activeItem === item.id ? "page" : undefined}
                style={{ minHeight: 44 }}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed mt-10 inset-0 z-50 flex items-center justify-center ">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Xác nhận đăng xuất</h2>
            <p className="mb-4 text-gray-600">Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-gray-600 rounded-md border hover:bg-gray-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  setToken(null);
                  setUser(null);
                  toast.success("Đăng xuất thành công!");
                  navigate("/", { replace: true });
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
