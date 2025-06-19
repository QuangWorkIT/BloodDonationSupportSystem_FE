import Footer from "@/components/layout/Footer";
import BloodDonationNavbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";

interface Comment {
  name: string;
  content: string;
}

export default function BlogContent() {
  //Demo content
  const contents = {
    title: "MỘT SỐ CÂU HỎI THƯỜNG GẶP",
    imageUrl: "src/assets/images/event2.png",
    author: "admin",
    date: "4/5/2025",
    lastModify: "14/5/2025",
    content: [
      {
        subtitle: "1. Ai có thể tham gia hiến máu?",
        text: [
          "- Tất cả mọi người từ 18 - 60 tuổi, thực sự tình nguyện hiến máu của mình để cứu chữa người bệnh.",
          "- Cân nặng ít nhất là 45kg đối với phụ nữ, nam giới. Lượng máu hiến mỗi lần không quá 9ml/kg cân nặng và không quá 500ml mỗi lần.",
          "- Không bị nhiễm hoặc không có các hành vi lây nhiễm HIV và các bệnh lây nhiễm qua đường truyền máu khác.",
          "- Thời gian giữa 2 lần hiến máu là 12 tuần đối với cả Nam và Nữ.",
        ],
      },
      {
        subtitle: "2. Máu của tôi sẽ được làm những xét nghiệm gì?",
        text: [
          "- Tất cả những đơn vị máu thu được sẽ được kiểm tra nhóm máu (hệ ABO, hệ Rh), HIV, virus viêm gan B, virus viêm gan C, giang mai, sốt rét. ",
          "- Bạn sẽ được thông báo kết quả, được giữ kín và được tư vấn (miễn phí) khi phát hiện ra các bệnh nhiễm trùng nói trên.",
        ],
      },
      {
        subtitle: "3. Máu gồm những thành phần và chức năng gì?",
        text: [
          "Máu là một chất lỏng lưu thông trong các mạch máu của cơ thể, gồm nhiều thành phần, mỗi thành phần làm nhiệm vụ khác nhau:",
          "- Hồng cầu làm nhiệm vụ chính là vận chuyển oxy.",
          "- Bạch cầu làm nhiệm vụ bảo vệ cơ thể.",
          "- Tiểu cầu tham gia quá trình đông cầm máu.",
          "- Huyết tương: gồm nhiều thành phần (kháng thể, các yếu tố đông máu, các chất dinh dưỡng...)",
        ],
      },
    ],
    initialComments: [
      {
        name: "Nguyễn Văn A",
        content: "(Any comment content here...)",
      },
      {
        name: "Nguyễn Văn B",
        content: "(Any comment content here...)",
      },
    ],
  };

  const [comments, setComments] = useState<Comment[]>(contents.initialComments || []);
  const [newComment, setNewComment] = useState<string>("");

  const handlePost = () => {
    if (newComment.trim()) {
      setComments([...comments, { name: "Tên người dùng", content: newComment }]);
      setNewComment("");
    }
  };

  return (
    <div className="min-w-screen flex flex-col gap-[40px] bg-linear-to-b from-[#F24333] to-[#DEA2A4]">
      <BloodDonationNavbar />

      <div className="flex justify-center gap-[40px]">
        <motion.div
          className="w-[970px] p-6 bg-white rounded-xl shadow-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Blog Header */}
          <h1 className="text-3xl font-bold font-serif text-red-800 text-center mb-6">{contents.title}</h1>

          {/* Image */}
          <img src={contents.imageUrl} alt="Blog visual" className="w-full h-auto mb-6 rounded-lg shadow" />

          {/* Content */}
          <div className="space-y-5 text-gray-800 leading-relaxed px-4">
            {contents.content.map((section, idx) => (
              <div key={idx}>
                <h2 className="text-xl text-red-700 font-semibold mb-2.5">{section.subtitle}</h2>
                {section.text.map((para, pIdx) => (
                  <p key={pIdx} className="text-lg mb-2.5">
                    {para}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Comment Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">{comments.length} bình luận</h2>
            <div className="space-y-4">
              {comments.map((comment, idx) => (
                <div key={idx} className="flex items-start gap-4 p-2 rounded-md">
                  <div className="bg-gray-300 rounded-full w-12 h-12 flex items-center justify-center font-bold">{comment.name.charAt(0)}</div>
                  <div>
                    <p className="font-medium">{comment.name}</p>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <h4 className="text-2xl font-semibold mb-5">Bình luận</h4>
              <div className="flex gap-4">
                <img src="src/assets/images/avatar.png" alt="user-avatar" className="size-[60px]" />
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Để lại bình luận của bạn ở đây"
                  className="w-full min-h-[80px] border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-gray-400"
                />
              </div>
              <div className="flex w-full justify-end">
                <FaPaperPlane className="mr-4 -mt-8 text-gray-400 hover:text-gray-600 cursor-pointer" onClick={handlePost} />
              </div>
              <p className="text-lg text-gray-500 mt-5">
                <Link to="/login" className="text-blue-600">
                  Đăng nhập
                </Link>{" "}
                để có thể để lại bình luận
              </p>
            </div>
          </div>
        </motion.div>

        {/* Metadata */}
        <motion.div
          className="text-gray-500 mb-6 bg-white p-6 rounded-xl shadow-md w-[300px] h-fit flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <img src="src/assets/images/avatar.png" alt="user-avatar" className="w-[180px]" />
          <p>
            Được đăng bởi: <span className="text-red-700 text-lg font-medium">{contents.author}</span>
          </p>
          <p>Ngày đăng: {contents.date}</p>
          <p>Chỉnh sửa lần cuối: {contents.lastModify}</p>
          <button onClick={() => {}} className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-lg cursor-pointer">
            Xem hồ sơ
          </button>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
