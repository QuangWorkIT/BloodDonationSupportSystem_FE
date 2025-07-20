import Footer from "@/components/layout/Footer";
import BloodDonationNavbar from "@/components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaPaperPlane, FaArrowLeft, FaUser, FaCalendar, FaEdit, FaHeart, FaShare, FaBookmark } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import api from "@/lib/instance";
import LoadingSpinner from "@/components/layout/Spinner";
import { useAuth } from "@/hooks/authen/AuthContext";
import { toast } from "react-toastify";
import { format } from "date-fns";
import image from "@/assets/images/event1.png";
import avatar from "@/assets/images/avatar.png";

interface Blog {
  id: number;
  title: string;
  content: string;
  createAt: string;
  lastUpdate: string;
  author: string;
}

interface Comment {
  userId: number;
  text: string;
  createdAt: string;
  member: string;
}

// Helper function to safely format dates
function safeFormatDate(dateString: string | undefined, formatStr: string) {
  if (!dateString) return "Ngày không hợp lệ";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Ngày không hợp lệ";
  return format(date, formatStr);
}

export default function BlogContent() {
  const { id } = useParams();
  const blogId = Number(id);
  const { user, accessToken } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`api/blogs/${id}`);
        setBlog(response.data);
      } catch (e) {
        console.error("Error fetching blog:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const fetchComments = async (blogId: number) => {
    try {
      const res = await api.get(`/api/${blogId}/comments`);
      setComments(res.data.data);
    } catch (e) {
      console.error("Failed to fetch comments", e);
    }
  };

  const postComment = async (blogId: number, text: string) => {
    if (!user || !accessToken) {
      toast.error("Bạn cần đăng nhập để bình luận.");
      return;
    }

    try {
      const res = await api.post(
        `/api/${blogId}/comments`,
        {
          text,
          userId: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setComments((prev) => [...prev, res.data.data]);
      setNewComment("");
      toast.success("Bình luận đã được đăng thành công!");
    } catch (err) {
      console.error("Failed to post comment", err);
      toast.error("Có lỗi xảy ra khi đăng bình luận.");
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const blogRes = await api.get(`/api/blogs/${id}`);
        setBlog(blogRes.data);

        const commentsRes = await api.get(`/api/${blogId}/comments`);
        setComments(commentsRes.data.data);
      } catch (err) {
        console.error("Error fetching blog or comments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePost = async (blogId: number) => {
    if (newComment.trim()) {
      await postComment(blogId, newComment);
      await fetchComments(blogId);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Đã bỏ thích bài viết" : "Đã thích bài viết");
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Đã bỏ lưu bài viết" : "Đã lưu bài viết");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.content.substring(0, 100) + "...",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép liên kết bài viết!");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!blog)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col justify-center items-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUser className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bài viết không tồn tại</h1>
          <p className="text-gray-600 mb-8">Bài viết này có thể đã bị xóa hoặc không tồn tại.</p>
          <Link to="/blogs">
            <Button className="bg-[#C14B53] hover:bg-[#a83a42] text-white px-6 py-3 rounded-xl">
              <FaArrowLeft className="mr-2" />
              Quay lại trang blog
            </Button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <BloodDonationNavbar />

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/blogs">
            <Button variant="ghost" className="text-gray-600 hover:text-[#C14B53] mb-6 cursor-pointer">
              <FaArrowLeft className="mr-2" />
              Quay lại trang blog
            </Button>
          </Link>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img 
              src={image} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#C14B53] text-white mb-4">
                Tin tức
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                {blog.title}
              </h1>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-6 md:p-8">
            {/* Article Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <img src={avatar} alt="Author" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900">{blog.author}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaCalendar className="w-3 h-3" />
                        <span>{safeFormatDate(blog.createAt, "dd/MM/yyyy")}</span>
                      </div>
                      {blog.lastUpdate && (
                        <div className="flex items-center gap-1">
                          <FaEdit className="w-3 h-3" />
                          <span>Cập nhật: {safeFormatDate(blog.lastUpdate, "dd/MM/yyyy")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-500'} cursor-pointer`}
                >
                  <FaHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''} cursor-pointer`} />
                  <span className="hidden sm:inline cursor-pointer">Thích</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 ${isBookmarked ? 'text-blue-500' : 'text-gray-500'} cursor-pointer`}
                >
                  <FaBookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''} cursor-pointer`} />
                  <span className="hidden sm:inline cursor-pointer">Lưu</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center gap-2 text-gray-500 cursor-pointer"
                >
                  <FaShare className="w-4 h-4 cursor-pointer" />
                  <span className="hidden sm:inline cursor-pointer">Chia sẻ</span>
                </Button>
              </div>
            </div>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed text-base md:text-lg space-y-6">
                {blog.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </motion.article>

        {/* Comments Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#C14B53] rounded-full flex items-center justify-center">
              <FaUser className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {comments.length} bình luận
            </h2>
          </div>

          {/* Comment Form */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm bình luận</h3>
            <div className="flex gap-4">
              <img src={avatar} alt="Your avatar" className="w-12 h-12 rounded-full flex-shrink-0 cursor-pointer" />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
                  className="w-full min-h-[100px] p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C14B53] focus:border-transparent resize-none"
                />
                <div className="flex justify-end mt-3">
                  <Button
                    onClick={() => handlePost(blogId)}
                    disabled={!newComment.trim()}
                    className="bg-[#C14B53] hover:bg-[#a83a42] text-white px-6 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <FaPaperPlane className="w-4 h-4" />
                    Đăng bình luận
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <img src={avatar} alt="User avatar" className="w-10 h-10 rounded-full flex-shrink-0 cursor-pointer" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{comment.member}</h4>
                      <span className="text-sm text-gray-500">
                        {safeFormatDate(comment.createdAt, "dd/MM/yyyy HH:mm")}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có bình luận nào</h3>
                <p className="text-gray-600">Hãy là người đầu tiên chia sẻ suy nghĩ của bạn!</p>
              </div>
            )}
          </div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
}
