import { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BloodDonationNavbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import UrgentEvents from "../DonationEvent/UrgentEvents";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const slides = [
    {
      title: "Tham gia hiến máu lần đầu tiên, bạn cần biết những gì?",
      description: "",
      buttonText: "Xem tại đây",
      imageUrl: "src/assets/images/image7.png",
      bgGradient: "bg-gradient-to-r from-red-700 to-red-500",
    },
    {
      title: "Tham gia hiến máu KHẨN",
      description: "Để phục vụ cho nhu cầu truyền máu của người bệnh",
      buttonText: "Tham gia ngay",
      imageUrl: "src/assets/images/image6.png",
      bgGradient: "bg-gradient-to-r from-red-800 to-red-600",
    },
    {
      title: "TP.HCM hiện đang cần\n2000+ ĐƠN VỊ MÁU",
      description: "Để phục vụ cho cấp cứu và điều trị",
      buttonText: "Đăng kí hiến máu tại đây",
      imageUrl: "src/assets/images/image5.png",
      bgGradient: "bg-gradient-to-r from-red-900 to-red-700",
    },
  ];

  const importantNotes = [
    {
      title: "Ai có thể tham gia hiến máu?",
      content: [
        "Tất cả mọi người từ 18 - 60 tuổi, thực sự tình nguyện hiến máu của mình để cứu chữa người bệnh.",
        "Cân nặng ít nhất là 45kg đối với phụ nữ, nam giới. Lượng máu hiến mỗi lần không quá 9ml/kg cân nặng và không quá 500ml mỗi lần.",
        "Không bị nhiễm hoặc không có các hành vi lây nhiễm HIV và các bệnh lây nhiễm qua đường truyền máu khác.",
        "Thời gian giữa 2 lần hiến máu là 12 tuần đối với cả Nam và Nữ.",
        "Có giấy tờ tùy thân",
      ],
    },
    {
      title: "Ai không nên hiến máu?",
      content: [
        "Người đã nhiễm hoặc đã thực hiện hành vi có nguy cơ nhiễm HIV, viêm gan B, viêm gan C, và các vius lây qua đường truyền máu.",
        "Người có các bệnh mãn tính: tim mạch, huyết áp, hô hấp, dạ dày…",
      ],
    },
    {
      title: "Máu của tôi sẽ được xét nghiệm như thế nào?",
      content: [
        "Tất cả những đơn vị máu thu được sẽ được kiểm tra nhóm máu (hệ ABO, hệ Rh), HIV, virus viêm gan B, virus viêm gan C, giang mai, sốt rét.",
        "Bạn sẽ được thông báo kết quả, được giữ kín và được hỗ trợ khi phát hiện ra các bệnh nhiễm trùng nói trên.",
      ],
    },
  ];

  const criterias = [
    {
      text: "Cân nặng: Nam > 45 kg và Nữ > 42 kg",
      image: "src/assets/images/Frame1.png",
      iconColor: "text-red-500",
    },
    {
      text: "Không nghiện ma túy, rượu bia và các chất kích thích",
      image: "src/assets/images/Frame2.png",
      iconColor: "text-red-600",
    },
    {
      text: "Người khỏe mạnh trong độ tuổi từ 18 đến 60 tuổi",
      image: "src/assets/images/18+.png",
      iconColor: "text-red-700",
    },
    {
      text: "Không mắc bệnh mãn tính hoặc cấp tính về tim mạch, huyết áp, hô hấp, dạ dày...",
      image: "src/assets/images/heart.png",
      iconColor: "text-red-500",
    },
    {
      text: "Thời gian tối thiểu giữa 2 lần hiến máu là 12 tuần đối với cả Nam và Nữ",
      image: "src/assets/images/schedule.png",
      iconColor: "text-red-600",
    },
    {
      text: "Không mắc hoặc không có các hành vi nguy cơ lây nhiễm HIV, viêm gan B, viêm gan C, và các virus lây qua đường truyền máu",
      image: "src/assets/images/virus.png",
      iconColor: "text-red-700",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50">
      <BloodDonationNavbar />

      <div className="flex flex-col sm:gap-[100px] gap-10">
        {/* Hero Slider - With Red Hover Buttons */}
        <section
          className={`relative h-[300px] sm:h-[500px] ${slides[currentSlide].bgGradient} flex items-center overflow-hidden`}
        >
          <div className="absolute inset-0 bg-black/30 z-10"></div>

          {/* Carousel Navigation Buttons with Red Hover */}
          <button
            onClick={prevSlide}
            className="absolute left-4 z-30 p-3 rounded-full bg-white/30 hover:bg-red-700/80 transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 z-30 p-3 rounded-full bg-white/30 hover:bg-red-700/80 transition-colors cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          <div className="container mx-auto px-6 z-20 flex flex-col sm:flex-row items-center justify-between">
            <div className="sm:w-1/2 w-full text-white sm:pr-8">
              <h2 className="text-2xl sm:text-5xl font-bold leading-tight mb-4 drop-shadow-md">
                {slides[currentSlide].title.split("\n").map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              {slides[currentSlide].description && (
                <p className="text-yellow-200 text-lg sm:text-xl mb-6">{slides[currentSlide].description}</p>
              )}
              <Button className="bg-white text-red-700 hover:bg-gray-100 font-bold py-6 px-8 rounded-full shadow-lg transition-all hover:scale-105">
                {slides[currentSlide].buttonText}
              </Button>

              <div className="flex gap-3 mt-8">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all ${
                      currentSlide === index ? "bg-white w-6" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Image container - hidden on mobile, visible on desktop */}
            <div className="hidden sm:block sm:w-1/2">
              <img
                src={slides[currentSlide].imageUrl}
                alt=""
                className="absolute right-0 bottom-0 h-full sm:h-auto sm:w-1/2 object-cover object-center"
                style={{ borderRadius: 0 }}
              />
            </div>
          </div>
        </section>

        {/* Introduction Section - Improved Responsiveness */}
        <section className="container mx-auto px-6 text-center">
          <div className="grid sm:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col sm:flex-row gap-6 items-start text-left">
              <div className={`bg-red-100 p-4 rounded-full min-w-[80px] ${expandedIndex === 0 ? "animate-pulse" : ""}`}>
                <img
                  src="src/assets/images/Vector1.png"
                  alt=""
                  className="w-12 h-12 object-contain" // Fixed aspect ratio
                  style={{ aspectRatio: "1/1" }}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-700 mb-2">Buổi hiến máu đầu tiên</h2>
                <p className="text-gray-600 mb-4 text-sm sm:text-base mt-4">
                  Những gì bạn cần biết cho lần đầu tiên hiến máu
                </p>
                <Link
                  to="/bloodinfo"
                  className="inline-flex items-center text-red-600 font-medium hover:text-red-800 group text-sm sm:text-base mt-4"
                >
                  Tìm hiểu thêm
                  <ChevronDown className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col sm:flex-row gap-6 items-start text-left">
              <div className={`bg-red-100 p-4 rounded-full min-w-[80px] ${expandedIndex === 1 ? "animate-pulse" : ""}`}>
                <img
                  src="src/assets/images/Vector2.png"
                  alt=""
                  className="w-12 h-12 object-contain" // Fixed aspect ratio
                  style={{ aspectRatio: "1/1" }}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-700 mb-2">Quy trình hiến máu</h2>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  Tìm hiểu về quy trình hiến máu một cách an toàn và hiệu quả
                </p>
                <Link
                  to="/bloodinfo"
                  className="inline-flex items-center text-red-600 font-medium hover:text-red-800 group text-sm sm:text-base"
                >
                  Tìm hiểu thêm
                  <ChevronDown className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 relative inline-block">
              <span className="relative z-10">
                Một giọt <span className="text-red-600">máu</span> ngàn yêu thương
              </span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-red-100 z-0"></span>
            </h2>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              Cơ sở Hiến máu Nhân đạo - nơi kết nối những tấm lòng nhân ái vì cộng đồng. Chúng tôi là đơn vị y tế chuyên
              tiếp nhận, quản lý và điều phối nguồn máu từ người hiến tới những bệnh nhân cần truyền máu kịp thời. Với
              đội ngũ y bác sĩ tận tâm, hệ thống lưu trữ máu hiện đại cùng nền tảng công nghệ hỗ trợ hiệu quả, chúng tôi
              cam kết mang lại quy trình hiến máu an toàn, nhanh chóng và minh bạch.
            </p>
          </div>
        </section>

        <UrgentEvents/>
        {/* Blood Donation Criteria Section - Responsive Improvements */}
        <section className="bg-gradient-to-br from-red-600 to-red-800 py-12 sm:py-16 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
                <span className="text-yellow-300">Tiêu chuẩn</span> hiến máu
              </h2>
              <p className="text-red-100 max-w-2xl mx-auto text-base sm:text-lg">
                Mỗi giọt máu bạn trao đi là một cơ hội sống bạn mang lại cho người khác
              </p>
            </div>

            <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {criterias.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 hover:transform hover:-translate-y-2 transition-transform duration-300"
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${item.iconColor} bg-opacity-20 flex items-center justify-center`}
                  >
                    <img src={item.image} alt="" className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="font-medium text-gray-800 text-sm sm:text-base">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Important Notes Section - Responsive Improvements */}
        <section className="container mx-auto px-6 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-red-700">Lưu ý quan trọng</h2>
            <p className="text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto text-base sm:text-lg">
              Những điều cần biết trước khi tham gia hiến máu nhân đạo
            </p>

            <div className="space-y-3 sm:space-y-4">
              {importantNotes.map((note, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    className="w-full flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 text-left bg-white hover:bg-red-50 transition-colors"
                    onClick={() => setExpandedIndex(index === expandedIndex ? null : index)}
                  >
                    <h3 className="text-base sm:text-lg font-semibold text-red-700">{note.title}</h3>
                    <ChevronDown
                      className={`w-5 h-5 text-red-600 transition-transform duration-200 ${
                        expandedIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedIndex === index && (
                    <div className="px-4 sm:px-6 pb-4 pt-2 bg-white text-left">
                      <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                        {note.content.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Link
              to="/blogs"
              className="inline-block mt-6 sm:mt-8 text-red-600 font-medium hover:text-red-800 group transition-colors text-sm sm:text-base"
            >
              Xem thêm thông tin
              <span className="block h-0.5 bg-red-600 group-hover:bg-red-800 transition-colors w-0 group-hover:w-full duration-300"></span>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
