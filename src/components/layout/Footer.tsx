import { FaArrowUp } from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-[#F8F9FA] text-gray-800 w-full text-sm"> {/* Brighter white and smaller text */}
      {/* Main content - made more compact */}
      <div className="w-full px-4 py-4"> {/* Reduced padding */}
        <div className="flex flex-col md:flex-row justify-between items-start">
          {/* Left content - tighter spacing */}
          <div className="space-y-1"> {/* Reduced spacing */}
            <p className="font-medium">Lô E2a-8, Đường D1 Khu Công nghệ cao, P. Long Thạnh Mỹ, TP. Thủ Đức, TP. Hồ Chí Minh</p>
            <p className="text-gray-600 text-xs">contact@lifesouth.org</p> {/* Smaller email text */}
            <div className="flex gap-4 mt-1"> {/* Tighter link spacing */}
              <a href="#" className="text-[#C9717A] hover:text-[#a83a42]">Chính sách</a>
              <a href="#" className="text-[#C9717A] hover:text-[#a83a42]">Blog</a>
              <a href="#" className="text-[#C9717A] hover:text-[#a83a42]">Liên hệ</a>
            </div>
          </div>

          {/* Compact round button with text */}
          <div className="flex flex-col items-center mt-2 md:mt-0"> {/* Reduced margin */}
            <button 
              onClick={scrollToTop}
              className="bg-[#C14B53] text-white p-2 rounded-full hover:bg-[#a83a42] cursor-pointer transition"
            >
              <FaArrowUp size={25} /> 
            </button>
            <span className="text-l text-[#C9717A] mt-0.5 hover: cursor-pointer">Trở về đầu trang</span> {/* Smaller label */}
          </div>
        </div>
      </div>

      {/* Slimmer copyright strip */}
      <div className="bg-[#C14B53] text-white py-2 w-full text-left px-4 text-xs"> {/* Reduced height */}
        <p>@2025 Blood Donation. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;