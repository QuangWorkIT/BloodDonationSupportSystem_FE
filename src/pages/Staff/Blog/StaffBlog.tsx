import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authenApi } from "@/lib/instance";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

interface Blog {
  id: number;
  title: string;
  content: string;
  createAt: string;
  lastUpdate: string;
  author: string;
  isActivated: boolean;
}

export default function StaffBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [form, setForm] = useState({ id: 0, title: "", content: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
    <motion.div className="p-8 space-y-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-semibold text-red-700">Quản lý Blog</h1>

      {/* Form */}
      <motion.div
        className="bg-white p-6 rounded-lg shadow space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Input placeholder="Tiêu đề blog" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea
          rows={6}
          className="w-[1160px] border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
          placeholder="Nội dung blog"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <Button onClick={handleSubmit} className="bg-red-700 text-white hover:bg-red-800 cursor-pointer">
          {editingId ? "Cập nhật" : "Tạo mới"}
        </Button>
      </motion.div>

      {/* Blog List */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            className="flex flex-col bg-white p-4 rounded shadow space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-bold text-lg">{blog.title}</h2>
            <p className="text-sm text-gray-500">Tác giả: {blog.author}</p>
            <p className="text-sm line-clamp-3 mb-2">{blog.content}</p>
            <div className="mt-auto flex gap-2">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setForm({ id: blog.id, title: blog.title, content: blog.content });
                  setEditingId(blog.id);
                }}
              >
                Sửa
              </Button>
              <Button
                variant="destructive"
                className="bg-red-700 text-white hover:bg-red-800 cursor-pointer"
                onClick={() => {
                  setDeleteId(blog.id);
                  setShowConfirmModal(true);
                }}
              >
                Xóa
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

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
                className="px-4 py-2 text-gray-700 border border-gray-300 cursor-pointer"
                onClick={() => {
                  setShowConfirmModal(false);
                  setDeleteId(null);
                }}
              >
                Hủy
              </Button>
              <Button className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 cursor-pointer" onClick={() => handleDelete(deleteId!)}>
                Xóa
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
