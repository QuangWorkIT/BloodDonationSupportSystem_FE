import { useState, useEffect } from "react";
import Footer from "@/components/layout/Footer";
import BloodDonationNavbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Calendar, User, ArrowRight, Search, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/instance";
import { format } from "date-fns";
import image from "@/assets/images/event1.png";

interface Blog {
  id: number;
  title: string;
  content: string;
  createAt: string;
  lastUpdate: string;
  author: string;
  isActivated: boolean;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [sort, setSort] = useState<"latest" | "earliest">("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/api/blogs?pageNumber=1&pageSize=10");
        let result = response.data.items;
        if (sort === "latest") {
          result = result.sort((a: Blog, b: Blog) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());
        } else {
          result = result.sort((a: Blog, b: Blog) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime());
        }
        setBlogs(result);
        setFilteredBlogs(result);
      } catch (e) {
        console.error("Error fetching blogs:", e);
      }
    };
    fetchBlogs();
  }, [sort]);

  useEffect(() => {
    const filtered = blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <BloodDonationNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ backgroundPosition: '0% 50%', backgroundSize: '180% 180%' }}
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
              ]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-br from-[#C14B53] via-[#a83a42] to-[#7a2328] opacity-10"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-[#C14B53] rounded-full mb-6"
            >
              <BookOpen className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Tin tức & <span className="text-[#C14B53]">Thông tin</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Khám phá những bài viết mới nhất về hiến máu, sức khỏe và các hoạt động từ thiện
            </p>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-12">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C14B53] focus:border-transparent bg-white shadow-sm"
                />
              </div>
              <Select onValueChange={(value) => setSort(value as "latest" | "earliest")}>
                <SelectTrigger className="w-full sm:w-48 font-medium bg-white border border-gray-200 text-gray-700 flex items-center gap-2 cursor-pointer rounded-xl shadow-sm px-4 py-6">
                  <Filter size={16} />
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Mới nhất</SelectItem>
                  <SelectItem value="earliest">Cũ nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((blog, index) => (
                  <Link to={`/blogcontent/${blog.id}`} key={blog.id} className="block group cursor-pointer">
                    <motion.article
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                    >
                      {/* Image Container */}
                      <div className="relative overflow-hidden h-48 cursor-pointer">
                        <img 
                          src={image} 
                          alt={blog.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent cursor-pointer" />
                        <div className="absolute top-4 left-4 cursor-pointer">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#C14B53] text-white cursor-pointer">
                            Tin tức
                          </span>
                        </div>
                      </div>
                      {/* Content */}
                      <div className="p-6 cursor-pointer">
                        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#C14B53] transition-colors duration-300 line-clamp-2 cursor-pointer">
                          {blog.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed cursor-pointer">
                          {truncateContent(blog.content)}
                        </p>
                        {/* Metadata */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4 cursor-pointer">
                          <div className="flex items-center gap-2 cursor-pointer">
                            <User className="w-4 h-4 cursor-pointer" />
                            <span>{blog.author}</span>
                          </div>
                          <div className="flex items-center gap-2 cursor-pointer">
                            <Calendar className="w-4 h-4 cursor-pointer" />
                            <span>{format(new Date(blog.createAt), "dd/MM/yyyy")}</span>
                          </div>
                        </div>
                        {/* Read More Button */}
                        <span className="w-full bg-[#C14B53] hover:bg-[#a83a42] text-white font-medium py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2 select-none">
                          Đọc tiếp
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 cursor-pointer" />
                        </span>
                      </div>
                    </motion.article>
                  </Link>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài viết</h3>
                <p className="text-gray-600">Thử tìm kiếm với từ khóa khác hoặc xem tất cả bài viết</p>
                <Button 
                  onClick={() => setSearchTerm("")}
                  className="mt-4 bg-[#C14B53] hover:bg-[#a83a42] text-white cursor-pointer"
                >
                  Xem tất cả bài viết
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Load More Button */}
          {filteredBlogs.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12"
            >
              <Button className="bg-white border-2 border-[#C14B53] text-[#C14B53] hover:bg-[#C14B53] hover:text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
                Xem thêm bài viết
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
