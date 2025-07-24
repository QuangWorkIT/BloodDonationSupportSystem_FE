import { useState, useEffect } from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/authen/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminNavbar() {
  const { accessToken, user, setToken, setUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    setToken(null);
    setUser(null);
    toast.success("Đăng xuất thành công!");
    navigate("/login", { replace: true });
  };

  return (
    <nav
      className={`fixed left-1/2 top-6 z-50 w-full -translate-x-1/2 rounded-2xl flex items-center justify-between mx-auto ml-25 transition-all duration-300
        ${
          scrolled
            ? "max-w-3xl px-6 py-2 shadow-xl bg-white/80 border-blue-100"
            : "max-w-4xl px-8 py-4 shadow-xl bg-white/90 border-blue-100"
        }
      `}
      style={{ boxShadow: "0 8px 32px rgba(37, 99, 235, 0.13)" }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">BD</span>
        </div>
        <span
          className={`ml-2 text-blue-600 font-bold drop-shadow-sm transition-all duration-300 ${
            scrolled ? "text-base" : "text-lg"
          } hidden md:inline`}
        >
          Blood Donation
        </span>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 relative group cursor-pointer transition drop-shadow-lg"
              aria-label={user?.unique_name || "Tài khoản"}
              tabIndex={0}
            >
              <FaUser size={20} color="#fff" />
              <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition whitespace-nowrap z-50">
                {user?.unique_name || "Tài khoản"}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-0 rounded-2xl shadow-2xl border-0 overflow-hidden bg-white mt-2">
            <div className="py-2">
              {accessToken ? (
                <>
                  <div className="flex items-center gap-3 px-5 py-4 border-b bg-blue-50">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600">
                      <FaUser size={22} color="#fff" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-blue-600 text-base">{user?.unique_name || "Tài khoản"}</span>
                      {user?.gmail && <span className="text-xs text-gray-500">{user.gmail}</span>}
                    </div>
                  </div>
                  <button
                    className="flex items-center gap-2 w-full text-left px-5 py-3 text-red-600 hover:bg-blue-50 transition font-medium text-base focus:outline-none focus:bg-blue-50 cursor-pointer"
                    tabIndex={0}
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="mr-2" /> Đăng xuất
                  </button>
                </>
              ) : null}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
                onClick={confirmLogout}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
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
