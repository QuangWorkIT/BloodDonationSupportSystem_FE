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
    <footer className="bg-[#F8F9FA] text-gray-800 w-full text-sm">
      <div className="w-full px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="space-y-1">
            <p className="font-medium">Lô E2a-8, Đường D1 Khu Công nghệ cao, P. Long Thạnh Mỹ, TP. Thủ Đức, TP. Hồ Chí Minh</p>
            <p className="text-gray-600 text-xs">contact@lifesouth.org</p>
            <div className="flex gap-4 mt-1">
              {/* Replace <a> tags with <Link> */}
              <Link to="/policy" className="text-[#C9717A] hover:text-[#a83a42]">
                Chính sách
              </Link>
              <Link to="/blogs" className="text-[#C9717A] hover:text-[#a83a42]">
                Blog
              </Link>
              <Link to="/contact" className="text-[#C9717A] hover:text-[#a83a42]">
                Liên hệ
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center mt-4 md:mt-0">
            <button onClick={scrollToTop} className="bg-[#C14B53] text-white p-2 rounded-full hover:bg-[#a83a42] cursor-pointer transition">
              <FaArrowUp size={25} />
            </button>
            <span className="text-l text-[#C9717A] mt-0.5 hover: cursor-pointer">Trở về đầu trang</span>
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
