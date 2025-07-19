import { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BloodDonationNavbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import UrgentEvents from "../DonationEvent/UrgentEvents";
import { motion, AnimatePresence } from "framer-motion";
import vector1 from '@/assets/images/Vector1.png';
import vector2 from '@/assets/images/Vector2.png';
import image7 from '@/assets/images/image7.png';
import image6 from '@/assets/images/image6.png';
import image5 from '@/assets/images/image5.png';
import frame1 from '@/assets/images/Frame1.png';
import frame2 from '@/assets/images/Frame2.png';
import img18plus from '@/assets/images/18+.png';
import heart from '@/assets/images/heart.png';
import schedule from '@/assets/images/schedule.png';
import virus from '@/assets/images/virus.png';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  const slides = [
    {
      title: "Tham gia hiến máu lần đầu tiên, bạn cần biết những gì?",
      description: "",
      buttonText: "Xem tại đây",
      imageUrl: image7,
      bgGradient: "bg-gradient-to-r from-red-700 to-red-500",
    },
    {
      title: "Tham gia hiến máu KHẨN",
      description: "Để phục vụ cho nhu cầu truyền máu của người bệnh",
      buttonText: "Tham gia ngay",
      imageUrl: image6,
      bgGradient: "bg-gradient-to-r from-red-800 to-red-600",
    },
    {
      title: "TP.HCM hiện đang cần\n2000+ ĐƠN VỊ MÁU",
      description: "Để phục vụ cho cấp cứu và điều trị",
      buttonText: "Đăng kí hiến máu tại đây",
      imageUrl: image5,
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
      image: frame1,
      iconColor: "text-red-500",
    },
    {
      text: "Không nghiện ma túy, rượu bia và các chất kích thích",
      image: frame2,
      iconColor: "text-red-600",
    },
    {
      text: "Người khỏe mạnh trong độ tuổi từ 18 đến 60 tuổi",
      image: img18plus,
      iconColor: "text-red-700",
    },
    {
      text: "Không mắc bệnh mãn tính hoặc cấp tính về tim mạch, huyết áp, hô hấp, dạ dày...",
      image: heart,
      iconColor: "text-red-500",
    },
    {
      text: "Thời gian tối thiểu giữa 2 lần hiến máu là 12 tuần đối với cả Nam và Nữ",
      image: schedule,
      iconColor: "text-red-600",
    },
    {
      text: "Không mắc hoặc không có các hành vi nguy cơ lây nhiễm HIV, viêm gan B, viêm gan C, và các virus lây qua đường truyền máu",
      image: virus,
      iconColor: "text-red-700",
    },
  ];

  const nextSlide = () => {
    setSlideDirection('next');
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setSlideDirection('prev');
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 overflow-x-hidden">
      <BloodDonationNavbar />

      <div className="flex flex-col sm:gap-[100px] gap-10 pt-[125px]">
        {/* Hero Slider - With Red Hover Buttons */}
        <section
          className={`relative h-[300px] sm:h-[480px] flex items-center overflow-hidden z-0`}
        >
          {/* Animated Gradient Background with SVG Blobs */}
          <div className="absolute inset-0 z-0">
            {/* Main animated gradient - blood-like colors with more fluid animation */}
            <motion.div
              initial={{ backgroundPosition: '0% 50%', backgroundSize: '180% 180%', filter: 'blur(12px)' }}
              animate={{
                backgroundPosition: [
                  '0% 50%',
                  '100% 60%',
                  '80% 100%',
                  '0% 50%'
                ],
                backgroundSize: [
                  '180% 180%',
                  '220% 200%',
                  '200% 220%',
                  '180% 180%'
                ],
                filter: [
                  'blur(12px)',
                  'blur(24px)',
                  'blur(16px)',
                  'blur(12px)'
                ]
              }}
              transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-br from-[#C14B53] via-[#a83a42] to-[#7a2328] opacity-90"
            />
            {/* SVG Blobs */}
            <motion.svg
              initial={{ scale: 0.9, opacity: 0.7, rotate: 0, x: 0, y: 0 }}
              animate={{
                scale: [0.9, 1.1, 0.9],
                opacity: [0.7, 1, 0.7],
                rotate: [0, 15, -10, 0],
                x: [0, 30, -20, 0],
                y: [0, 20, -10, 0],
              }}
              transition={{ duration: 18, repeat: Infinity, repeatType: "mirror" }}
              className="absolute -top-32 -left-32 w-[500px] h-[500px] opacity-60"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="200" cy="200" rx="200" ry="180" fill="#a83a42" />
            </motion.svg>
            <motion.svg
              initial={{ scale: 1, opacity: 0.5, rotate: 0, x: 0, y: 0 }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.5, 0.8, 0.5],
                rotate: [0, -10, 10, 0],
                x: [0, -20, 30, 0],
                y: [0, 15, -15, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", delay: 2 }}
              className="absolute -bottom-40 right-0 w-[420px] h-[420px] opacity-40"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="200" cy="200" rx="180" ry="200" fill="#7a2328" />
            </motion.svg>
            <style>{`
              @keyframes gradient-move {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
              }
              .animate-gradient-move {
                background-size: 200% 200%;
                animation: gradient-move 10s ease-in-out infinite;
              }
            `}</style>
          </div>
          <div className="absolute inset-0 bg-black/20 z-10"></div>

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
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: slideDirection === 'next' ? 80 : -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: slideDirection === 'next' ? -80 : 80 }}
                transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
                className="sm:w-1/2 w-full text-white sm:pr-8 relative"
                style={{ backdropFilter: 'blur(8px)' }}
              >
                <h2 className="text-2xl sm:text-5xl font-extrabold leading-tight mb-4 drop-shadow-xl">
                  {slides[currentSlide].title.split("\n").map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                {slides[currentSlide].description && (
                  <p className="text-yellow-200 text-lg sm:text-xl mb-6 drop-shadow-lg">{slides[currentSlide].description}</p>
                )}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
                >
                  <Button className="bg-white text-[#C14B53] hover:bg-gray-100 font-bold py-6 px-8 rounded-full shadow-2xl transition-all hover:scale-105 text-lg">
                    {slides[currentSlide].buttonText}
                  </Button>
                </motion.div>
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
              </motion.div>
            </AnimatePresence>

            {/* Image container - hidden on mobile, visible on desktop */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide + '-img'}
                initial={{ opacity: 0, x: slideDirection === 'next' ? 80 : -80, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: slideDirection === 'next' ? -80 : 80, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
                className="hidden sm:flex sm:w-1/2 items-center justify-center relative"
              >
                <img
                  src={slides[currentSlide].imageUrl}
                  alt=""
                  className="max-h-[300px] sm:max-h-[380px] w-auto rounded-2xl drop-shadow-2xl border-4 border-white bg-white/40 object-contain"
                  style={{ objectFit: 'contain' }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Introduction Section - Improved Responsiveness */}
        <section className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="grid sm:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(193,75,83,0.10)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-6 items-start text-left cursor-pointer"
            >
              <div className={`bg-red-100 p-4 rounded-full min-w-[80px] ${expandedIndex === 0 ? "animate-pulse" : ""}`}>
                <img
                  src={vector1}
                  alt="Buổi hiến máu đầu tiên"
                  className="w-12 h-12 object-contain"
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
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(193,75,83,0.10)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-6 items-start text-left cursor-pointer"
            >
              <div className={`bg-red-100 p-4 rounded-full min-w-[80px] ${expandedIndex === 1 ? "animate-pulse" : ""}`}>
                <img
                  src={vector2}
                  alt="Quy trình hiến máu"
                  className="w-12 h-12 object-contain"
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
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-bold mb-6 relative inline-block"
            >
              <span className="relative z-10">
                Một giọt <span className="text-red-600">máu</span> ngàn yêu thương
              </span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-red-100 z-0"></span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-gray-700 text-base sm:text-lg leading-relaxed"
            >
              Cơ sở Hiến máu Nhân đạo - nơi kết nối những tấm lòng nhân ái vì cộng đồng. Chúng tôi là đơn vị y tế chuyên
              tiếp nhận, quản lý và điều phối nguồn máu từ người hiến tới những bệnh nhân cần truyền máu kịp thời. Với
              đội ngũ y bác sĩ tận tâm, hệ thống lưu trữ máu hiện đại cùng nền tảng công nghệ hỗ trợ hiệu quả, chúng tôi
              cam kết mang lại quy trình hiến máu an toàn, nhanh chóng và minh bạch.
            </motion.p>
          </motion.div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <UrgentEvents/>
        </motion.div>

        {/* Blood Donation Criteria Section - Responsive Improvements */}
        <section className="bg-[#a83a42] py-12 sm:py-16 px-6">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
                <span className="text-yellow-300">Tiêu chuẩn</span> hiến máu
              </h2>
              <p className="text-red-100 max-w-2xl mx-auto text-base sm:text-lg">
                Mỗi giọt máu bạn trao đi là một cơ hội sống bạn mang lại cho người khác
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {criterias.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(193,75,83,0.10)' }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white rounded-xl shadow-xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 hover:transform hover:-translate-y-2 transition-transform duration-300"
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${item.iconColor} bg-opacity-20 flex items-center justify-center`}
                  >
                    <img src={item.image} alt="" className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="font-medium text-gray-800 text-sm sm:text-base">{item.text}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Important Notes Section - Responsive Improvements */}
        <section className="container mx-auto px-6 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-red-700">Lưu ý quan trọng</h2>
            <p className="text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto text-base sm:text-lg">
              Những điều cần biết trước khi tham gia hiến máu nhân đạo
            </p>

            <div className="space-y-3 sm:space-y-4">
              {importantNotes.map((note, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
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
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 sm:px-6 pb-4 pt-2 bg-white text-left"
                    >
                      <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                        {note.content.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <Link
              to="/blogs"
              className="inline-block mt-6 sm:mt-8 text-red-600 font-medium hover:text-red-800 group transition-colors text-sm sm:text-base"
            >
              Xem thêm thông tin
              <span className="block h-0.5 bg-red-600 group-hover:bg-red-800 transition-colors w-0 group-hover:w-full duration-300"></span>
            </Link>
          </motion.div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
