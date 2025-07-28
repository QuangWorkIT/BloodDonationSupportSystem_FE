import { FaArrowUp } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#EBD6D8] text-gray-800 w-full text-sm">
      <div className="w-full px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="space-y-1">
            <p className="font-medium">387 Đ. Lê Văn Việt, Tăng Nhơn Phú A, Thủ Đức, Hồ Chí Minh, Việt Nam</p>
            <p className="text-gray-600 text-xs">nguyenhoangak782@gmail.com</p>
            <div className="flex gap-4 mt-1">
              {/* Replace <a> tags with <Link> */}
              <Link to="" className="text-[#C9717A] hover:text-[#a83a42]">
                Chính sách
              </Link>
              <Link to="/blogs" className="text-[#C9717A] hover:text-[#a83a42]">
                Blog
              </Link>
              <Link to="" className="text-[#C9717A] hover:text-[#a83a42]">
                Liên hệ
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center mt-4 md:mt-0">
            <button
              onClick={scrollToTop}
              className="bg-[#C14B53] text-white p-1.5 md:p-2 rounded-full hover:bg-[#a83a42] cursor-pointer transition"
            >
              <FaArrowUp className="w-4 h-4 md:w-6 md:h-6" />
            </button>
            <span className="text-sm text-[#C9717A] mt-0.5 cursor-pointer hover:underline">
              Trở về đầu trang
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#C14B53] text-white py-2 w-full text-left px-4 text-xs">
        <p>@2025 Blood Donation. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
