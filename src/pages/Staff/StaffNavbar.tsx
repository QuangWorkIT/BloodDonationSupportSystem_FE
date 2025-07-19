import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/authen/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import { FaTimes, FaRegNewspaper, FaUserInjured } from "react-icons/fa";

const StaffNavbar = () => {
  const { accessToken, user, isLoading, setToken, setUser } = useAuth();
  const navigate = useNavigate();

  const profileLabel = accessToken
    ? user?.unique_name || "Tài khoản"
    : "Đăng nhập";

  const navItems = [
    {
      id: "urgent",
      label: "Khẩn cấp",
      href: "donorsearch",
      icon: <FaUserInjured className="mr-2" />,
    },
    {
      id: "chia-se",
      label: "Chia sẻ",
      href: "blogs",
      icon: <FaRegNewspaper className="mr-2" />,
    },
  ];

  const activeItem = navItems.find(
    (item) =>
      location.pathname.endsWith(item.href) ||
      (item.href === "/" && location.pathname === "/home")
  )?.id;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between h-20">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-[#C14B53] dark:bg-[#333] rounded-full flex items-center justify-center cursor-pointer">
            <span className="text-white font-bold text-xs">BD</span>
          </div>
          <span className="ml-2 text-[#C14B53] dark:text-white font-bold text-lg hidden sm:inline">
            Blood Donation
          </span>
        </div>

        {/* Centered navigation group with animations */}
        <div className="absolute right-1 transform -translate-x-15">
          <div className="flex items-center space-x-10">
            {
              <>
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
              </>
            }

            {/* Login button */}
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
                            <span className="font-semibold text-[#C14B53] dark:text-white text-base">
                              {user?.unique_name || "Tài khoản"}
                            </span>
                            {user?.gmail && (
                              <span className="text-xs text-gray-500 dark:text-gray-300">
                                {user.gmail}
                              </span>
                            )}
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
                            toast.success("Đăng xuất thành công!");
                            navigate("/", {
                              replace: true,
                            });
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

        {/* Empty div to balance the flex layout */}
        <div className="w-10"></div>
      </div>
    </nav>
  );
};

export default StaffNavbar;
