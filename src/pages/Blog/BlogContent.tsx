import Footer from "@/components/layout/Footer";
import BloodDonationNavbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
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

export default function BlogContent() {
  const { id } = useParams();
  const blogId = Number(id);
  const { user, accessToken } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

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
    console.log(comments);
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
    } catch (err) {
      console.error("Failed to post comment", err);
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

  if (loading) return <LoadingSpinner />;

  if (!blog)
    return (
      <div className="min-w-screen h-screen flex flex-col justify-center items-center sm:gap-[40px] bg-linear-to-b from-indigo-900 to-indigo-950">
        <div className="text-white font-semibold text-4xl">Bài viết không tồn tại hoặc đã bị xóa.</div>
        <Link to="/blogs" className="p-4 bg-black rounded-md text-white cursor-pointer">
          Quay lại trang blog
        </Link>
      </div>
    );

  return (
    <div className="min-w-screen flex flex-col sm:gap-[40px] bg-linear-to-b from-[#F24333] to-[#DEA2A4]">
      <BloodDonationNavbar />

      <div className="flex justify-center sm:gap-[40px]">
        <motion.div
          className="sm:w-[970px] w-full p-6 bg-white sm:rounded-xl shadow-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Blog Header */}
          <h1 className="sm:text-3xl text-xl font-bold font-serif text-red-800 text-center mb-6">{blog.title}</h1>

          {/* Image */}
          <img src={image} alt="Blog visual" className="w-full h-auto mb-6 rounded-lg shadow" />

          {/* Content */}
          <div className="space-y-5 text-gray-800 leading-relaxed px-4">
            <p className="sm:text-lg text-sm">{blog.content}</p>
          </div>

          {/* Metadata */}
          <motion.div
            className="text-gray-500 mb-6 bg-white sm:hidden p-6 rounded-xl shadow-md w-full h-fit flex items-center justify-between gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <img src={avatar} alt="user-avatar" className="w-[40px]" />
            <div className="flex flex-col gap-2">
              <p className="text-sm">
                Được đăng bởi: <span className="text-red-700 font-medium">{blog.author}</span>
              </p>
              <p className="text-sm">Ngày đăng: {format(new Date(blog.createAt), "dd/MM/yyyy")}</p>
              <p className="text-sm">Chỉnh sửa lần cuối: {blog.lastUpdate ? format(new Date(blog.lastUpdate), "dd/MM/yyyy") : ""}</p>
            </div>
            <button onClick={() => {}} className="bg-red-700 hover:bg-red-800 text-white text-sm px-2 py-2 rounded-lg cursor-pointer">
              Xem hồ sơ
            </button>
          </motion.div>

          {/* Comment Section */}
          <div className="mt-10">
            <h2 className="sm:text-2xl text-lg font-semibold sm:mb-4 mb-2">{comments.length} bình luận</h2>
            <div className="sm:space-y-4 space-y-2">
              {comments.map((comment, idx) => (
                <div key={idx} className="flex items-start gap-4 p-2 rounded-md">
                  <img src={avatar} alt="user-avatar" className="size-10 sm:size-12" />
                  <div>
                    <p className="font-medium max-sm:text-sm">{comment.member}</p>
                    <p className="text-gray-700 max-sm:text-sm">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <h4 className="sm:text-2xl text-lg font-semibold mb-5">Bình luận</h4>
              <div className="flex gap-4">
                <img src={new URL("@/assets/images/avatar.png", import.meta.url).href} alt="user-avatar" className="sm:size-[60px] size-10" />
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Để lại bình luận của bạn ở đây"
                  className="w-full min-h-[80px] border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-gray-400 max-sm:placeholder-shown:text-sm"
                />
              </div>
              <div className="flex w-full justify-end">
                <FaPaperPlane
                  className="mr-4 -mt-8 text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => {
                    handlePost(blogId);
                  }}
                />
              </div>
              <p className="sm:text-lg text-sm text-gray-500 mt-5">
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
          className="text-gray-500 mb-6 bg-white max-sm:hidden p-6 rounded-xl shadow-md w-[300px] h-fit flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <img src={avatar} alt="user-avatar" className="w-[180px]" />
          <p>
            Được đăng bởi: <span className="text-red-700 text-lg font-medium">{blog.author}</span>
          </p>
          <p>Ngày đăng: {format(new Date(blog.createAt), "dd/MM/yyyy")}</p>
          <p>Chỉnh sửa lần cuối: {blog.lastUpdate ? format(new Date(blog.lastUpdate), "dd/MM/yyyy") : ""}</p>
          <button onClick={() => {}} className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-lg cursor-pointer">
            Xem hồ sơ
          </button>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
