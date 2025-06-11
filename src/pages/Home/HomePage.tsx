import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import BloodDonationNavbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const slides = [
    {
      title: "Tham gia hiến máu lần đầu tiên, bạn cần biết những gì?",
      description: "",
      buttonText: "Xem tại đây",
      imageUrl: "src/assets/images/image7.png",
    },
    {
      title: "Tham gia hiến máu KHẨN",
      description: "Để phục vụ cho nhu cầu truyền máu của người bệnh",
      buttonText: "Tham gia ngay",
      imageUrl: "src/assets/images/image6.png",
    },
    {
      title: "TP.HCM hiện đang cần\n2000+ ĐƠN VỊ MÁU",
      description: "Để phục vụ cho cấp cứu và điều trị",
      buttonText: "Đăng kí hiến máu tại đây",
      imageUrl: "src/assets/images/image5.png",
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
        "Bạn sẽ được thông báo kết quả, được giữ kín và được tư vấn (miễn phí) khi phát hiện ra các bệnh nhiễm trùng nói trên.",
      ],
    },
  ];

  const criterias = [
    { text: "Cân nặng: Nam > 45 kg và Nữ > 42 kg", image: "src/assets/images/Frame1.png" },
    { text: "Không nghiện ma túy, rượu bia và các chất kích thích", image: "src/assets/images/Frame2.png" },
    { text: "Người khỏe mạnh trong độ tuổi từ 18 đến 60 tuổi", image: "src/assets/images/18+.png" },
    { text: "Không mắc bệnh mãn tính hoặc cấp tính về tim mạch, huyết áp, hô hấp, dạ dày...", image: "src/assets/images/heart.png" },
    { text: "Thời gian tối thiểu giữa 2 lần hiến máu là 12 tuần đối với cả Nam và Nữ", image: "src/assets/images/schedule.png" },
    {
      text: "Không mắc hoặc không có các hành vi nguy cơ lây nhiễm HIV, viêm gan B, viêm gan C, và các virus lây qua đường truyền máu",
      image: "src/assets/images/virus.png",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <BloodDonationNavbar />

      <div className="flex flex-col gap-[100px]">
        {/* Hero Slider */}
        <section className="h-[450px] bg-red-300 flex justify-center items-center gap-12 pl-28">
          <div className="w-1/2 flex flex-col justify-center gap-4 mb-24">
            <h2 className="text-[45px]/[1.3] font-bold text-red-800 whitespace-pre-line">{slides[currentSlide].title}</h2>
            {slides[currentSlide].description && (
              <p className="text-yellow-300 text-[25px] font-medium whitespace-pre-line">{slides[currentSlide].description}</p>
            )}
            <Button className="bg-red-700 hover:bg-red-800 text-white text-lg w-fit h-fit cursor-pointer">{slides[currentSlide].buttonText}</Button>
            <span className="flex gap-8 mt-[360px] absolute">
              {slides && slides.length
                ? slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={
                        currentSlide === index
                          ? "bg-white h-[10px] w-[10px] p-[10px] rounded-full cursor-pointer"
                          : "bg-gray-300 h-[10px] w-[10px] p-[10px] rounded-full cursor-pointer"
                      }
                    ></button>
                  ))
                : null}
            </span>
          </div>
          <div className="w-1/2">
            <img src={slides[currentSlide].imageUrl} alt="" className="h-[450px] w-full object-cover" />
          </div>
        </section>

        {/* Introduction Section */}
        <section className="text-center px-6 max-w-4xl mx-auto ">
          <div className="flex gap-7.5 justify-between">
            <div className="flex gap-4 items-center max-w-[45%]">
              <img src="src/assets/images/Vector1.png" alt="" className="w-[64px] h-[80px]" />
              <div className="flex flex-col gap-3 text-left">
                <h2 className="text-blue-600 font-semibold text-2xl">Buổi hiến máu đầu tiên</h2>
                <p>Những gì bạn cần biết cho lần đầu tiên hiến máu</p>
                <span className="relative inline-block group w-max">
                  <Link to="#" className="text-xl text-red-700 font-semibold hover:text-[#a83a42]">
                    Tìm hiểu thêm
                  </Link>
                  <span className="absolute left-0 -bottom-2 h-2 bg-red-700 rounded-full w-[65%] group-hover:w-[100%] transition-all duration-300 ease-in-out"></span>
                </span>
              </div>
            </div>

            <div className="flex gap-4 items-center max-w-[45%]">
              <img src="src/assets/images/Vector2.png" alt="" className="w-[64px] h-[80px]" />
              <div className="flex flex-col gap-3 text-left">
                <h2 className="text-blue-600 font-semibold text-2xl">Quy trình hiến máu</h2>
                <p>Tìm hiểu về quy trình hiến máu một cách an toàn và hiệu quả</p>
                <span className="relative inline-block group w-max">
                  <Link to="#" className="text-xl text-red-700 font-semibold hover:text-[#a83a42]">
                    Tìm hiểu thêm
                  </Link>
                  <span className="absolute left-0 -bottom-2 h-2 bg-red-700 rounded-full w-[65%] group-hover:w-[100%] transition-all duration-300 ease-in-out"></span>
                </span>
              </div>
            </div>
          </div>
          <h2 className="mt-14 text-3xl font-semibold mb-4">
            Một giọt <span className="text-red-700">máu</span> ngàn yêu thương
          </h2>
          <p className="text-gray-600 text-lg">
            Cơ sở Hiến máu Nhân đạo - nơi kết nối những tấm lòng nhân ái vì cộng đồng. Chúng tôi là đơn vị y tế chuyên tiếp nhận, quản lý và điều phối nguồn máu
            từ người hiến tới những bệnh nhân cần truyền máu kịp thời. Với đội ngũ y bác sĩ tận tâm, hệ thống lưu trữ máu hiện đại cùng nền tảng công nghệ hỗ
            trợ hiệu quả, chúng tôi cam kết mang lại quy trình hiến máu an toàn, nhanh chóng và minh bạch.
          </p>
        </section>

        {/* Blood Donation Criteria Section */}
        <section className="bg-red-300 py-8 px-12">
          <div className="grid grid-cols-3 gap-x-16">
            <div className="flex items-center">
              <h1 className="text-[33px] text-white font-semibold">Mỗi giọt máu bạn trao đi là một cơ hội sống bạn mang lại cho người khác</h1>
            </div>
            <div className="col-span-2">
              <h2 className="text-[40px] font-semibold text-center mb-6 text-white">Tiêu chuẩn hiến máu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {criterias.map((item, idx) => (
                  <div className="bg-white rounded-xl shadow-md shadow-gray-500 p-4 flex flex-col gap-2">
                    <img src={item.image} alt="" width={50} />
                    <div key={idx} className="text-md">
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Important Notes Section */}
        <section className="text-center px-6">
          <h2 className="text-3xl font-semibold font-serif mb-8">Lưu ý quan trọng</h2>
          <div className="max-w-3xl mx-auto space-y-4 mb-8">
            {importantNotes.map((note, index) => (
              <div key={index} className="border border-red-200 rounded-lg">
                <button
                  className="w-full flex justify-between items-center px-4 py-3 text-left text-red-600 font-medium"
                  onClick={() => setExpandedIndex(index === expandedIndex ? null : index)}
                >
                  {note.title}
                  <ChevronDown className={`w-5 h-5 cursor-pointer transition-transform duration-200 ${expandedIndex === index ? "rotate-180" : ""}`} />
                </button>
                {expandedIndex === index &&
                  note.content.map((item, index) => (
                    <div key={index} className="text-left px-4 pb-4 text-gray-700 text-sm transition-discrete">
                      {item}
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <Link to="/" className="text-sm text-blue-500 underline">
            Xem thêm...
          </Link>
        </section>
        <Footer />
      </div>
    </div>
  );
}
