import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authenApi } from "@/lib/instance";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import StaffNavbar from "@/pages/Staff/StaffNavbar";
import Footer from "@/components/layout/Footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Calendar, User, Search, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import image from "@/assets/images/event1.png";

interface Blog {
  id: number;
  title: string;
  content: string;
  createAt: string;
  lastUpdate: string;
  author: string;
  isActived: boolean;
}

export default function StaffBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [form, setForm] = useState({ id: 0, title: "", content: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Add search and sort state
  const [sort, setSort] = useState<"latest" | "earliest">("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await authenApi.get("/api/blogs?pageNumber=1&pageSize=100");
      setBlogs(res.data.items);
    } catch (err) {
      toast.error("Không thể tải blog");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Add filtering and sorting logic
  useEffect(() => {
    let result = [...blogs];
    if (sort === "latest") {
      result = result.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());
    } else {
      result = result.sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime());
    }
    setFilteredBlogs(result.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [blogs, sort, searchTerm]);

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Create or update blog
  const handleSubmit = async () => {
    try {
      if (editingId) {
        await authenApi.put(`/api/blogs/${editingId}`, {
          title: form.title,
          content: form.content,
        });
        toast.success("Cập nhật blog thành công");
      } else {
        await authenApi.post("/api/blogs/create", {
          title: form.title,
          content: form.content,
        });
        toast.success("Tạo blog mới thành công");
      }
      setForm({ id: 0, title: "", content: "" });
      setEditingId(null);
      fetchBlogs();
    } catch (err) {
      toast.error("Lỗi khi gửi dữ liệu blog");
    }
  };

  // Delete blog
  const handleDelete = async (id: number) => {
    if (!deleteId) return;
    try {
      await authenApi.put(`/api/blogs/${id}/delete`);
      toast.success("Xóa blog thành công");
      fetchBlogs();
    } catch (err) {
      toast.error("Xóa blog thất bại");
    } finally {
      setShowConfirmModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <StaffNavbar />
      <div className="mt-[50px]">
        {/* Form Section */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-lg space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{editingId ? "Chỉnh sửa Blog" : "Tạo Blog mới"}</h2>
            <Input placeholder="Tiêu đề blog" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl" />
            <textarea
              rows={6}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#C14B53] focus:border-transparent bg-white shadow-sm"
              placeholder="Nội dung blog"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
            <Button onClick={handleSubmit} className="bg-[#C14B53] text-white hover:bg-[#a83a42] cursor-pointer rounded-xl px-6 py-3 font-medium">
              {editingId ? "Cập nhật" : "Tạo mới"}
            </Button>
          </motion.div>
        </section>
        {/* Search and Filter Bar above Blog Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
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
            <Select onValueChange={(value) => setSort(value as "latest" | "earliest") }>
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
        </div>
        {/* Blog Grid Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              {filteredBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredBlogs.map((blog, index) => (
                    <motion.article
                      key={blog.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                    >
                      {/* Image Container */}
                      <div className="relative overflow-hidden h-40">
                        <img 
                          src={image} 
                          alt={blog.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#C14B53] text-white">
                            Tin tức
                          </span>
                        </div>
                      </div>
                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#C14B53] transition-colors duration-300 line-clamp-2">
                          {blog.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {truncateContent(blog.content)}
                        </p>
                        {/* Metadata */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{blog.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(blog.createAt), "dd/MM/yyyy")}</span>
                          </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-auto">
                          <Button
                            variant="outline"
                            className="flex items-center gap-1 border-[#C14B53] text-[#C14B53] hover:bg-[#C14B53]/10 hover:text-[#a83a42] rounded-xl px-4 py-2 font-medium"
                            onClick={() => {
                              window.scrollTo({ top: 0, behavior: "smooth" });
                              setForm({ id: blog.id, title: blog.title, content: blog.content });
                              setEditingId(blog.id);
                            }}
                          >
                            <Edit className="w-4 h-4" /> Sửa
                          </Button>
                          <Button
                            variant="destructive"
                            className="flex items-center gap-1 bg-[#C14B53] text-white hover:bg-[#a83a42] rounded-xl px-4 py-2 font-medium"
                            onClick={() => {
                              setDeleteId(blog.id);
                              setShowConfirmModal(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" /> Xóa
                          </Button>
                        </div>
                      </div>
                    </motion.article>
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
                    className="mt-4 bg-[#C14B53] hover:bg-[#a83a42] text-white cursor-pointer rounded-xl px-6 py-3 font-medium"
                  >
                    Xem tất cả bài viết
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
        {/* Confirm Delete Modal */}
        {showConfirmModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-red-700 mb-4">Xác nhận xóa</h2>
              <p className="text-gray-700 mb-6">
                Bạn có chắc chắn muốn xóa blog này không? <span className="text-red-800">Hành động này không thể hoàn tác.</span>
              </p>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  className="px-4 py-2 text-gray-700 border border-gray-300 cursor-pointer rounded-xl"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setDeleteId(null);
                  }}
                >
                  Hủy
                </Button>
                <Button className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 cursor-pointer rounded-xl" onClick={() => handleDelete(deleteId!)}>
                  Xóa
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
        <Footer />
      </div>
    </div>
  );
}
