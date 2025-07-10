import { useState, useEffect } from "react";
import Footer from "@/components/layout/Footer";
import BloodDonationNavbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Filter, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/instance";

interface Blog {
  id: number;
  title: string;
  content: string;
  createAt: string;
  lastUpdate: string;
  author: string;
  isActivated: boolean;
}

// export const blogs: Blog[] = [
//   {
//     id: 1,
//     title: "Khởi động tháng nhân đạo 2025",
//     summary: "Ngày 8-5, tại TPHCM, Trung ương Hội Chữ thập đỏ Việt Nam và UBND TPHCM phối hợp tổ chức lễ...",
//     date: "10/5/2025",
//     image: "src/assets/images/event1.png",
//   },
//   {
//     id: 2,
//     title: "Các câu hỏi thường gặp",
//     summary: "Các câu hỏi thường gặp đối với người hiến máu lần đầu và một số lưu ý quan trọng khác...",
//     date: "7/5/2025",
//     image: "src/assets/images/event2.png",
//   },
// ];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [sort, setSort] = useState<"latest" | "earliest">("latest");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/api/blogs?pageNumber=1&pageSize=10");
        let result = response.data;
        if (sort === "latest") {
          result = result.items.sort((a: Blog, b: Blog) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());
        } else {
          result = result.items.sort((a: Blog, b: Blog) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime());
        }
        setBlogs(result);
      } catch (e) {
        console.error("Error fetching blogs:", e);
      }
    };
    fetchBlogs();
  }, [sort]);

  return (
    <div className="min-h-screen flex flex-col gap-[50px] bg-linear-to-b from-[#F24333] to-[#DEA2A4]">
      <BloodDonationNavbar />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 justify-center items-center mb-8">
          <motion.h1
            className="sm:text-[34px] text-2xl text-center font-bold font-serif text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            THÔNG TIN & TIN TỨC
          </motion.h1>
          <Select onValueChange={(value) => setSort(value as "latest" | "earliest")}>
            <SelectTrigger className="sm:w-fit sm:h-[45px] font-medium bg-white text-black flex items-center gap-2 cursor-pointer">
              <Filter size={16} />
              <SelectValue placeholder="Phân loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">
                Xếp theo ngày đăng mới nhất <Layers size={16} />
              </SelectItem>
              <SelectItem value="earliest">
                Xếp theo ngày đăng cũ nhất <Layers size={16} />
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
          {blogs.map((blog, index) => (
            <motion.div
              key={index}
              className="bg-white sm:max-w-[600px] max-w-[360px] rounded-xl shadow-lg transition overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <h2 className="sm:text-2xl text-xl text-center font-semibold text-[#705c7d] m-4">{blog.title}</h2>
              <img src={new URL("@/assets/images/event2.png", import.meta.url).href} alt={blog.title} className="w-full h-48 object-cover" />
              <div className="p-5 flex flex-col justify-between min-h-[200px]">
                <p className="text-gray-400 sm:text-lg text-md mb-4 line-clamp-3">{blog.content}</p>
                <div className="flex flex-col items-center mt-auto space-y-3">
                  <Link to={`/blogcontent/${blog.id}`}>
                    <Button className="bg-red-700 hover:bg-red-800 text-lg text-white w-[200px] py-6 cursor-pointer">Đọc tiếp...</Button>
                  </Link>
                  <p className="text-gray-400 place-self-end">Đã đăng ngày {blog.createAt}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-10 flex justify-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Button className="bg-[#c14b53] hover:bg-[#a72828] text-white px-8 text-base cursor-pointer">Xem thêm...</Button>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
