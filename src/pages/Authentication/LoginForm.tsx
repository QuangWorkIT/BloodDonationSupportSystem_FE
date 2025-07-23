import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/authen/AuthContext";
import { getUser } from "@/utils/permisson";
import api from "@/lib/instance";
import type { RecaptchaVerifier } from "firebase/auth";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import type { AxiosError } from "axios";

const formSchema = z.object({
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

declare global {
  interface Window {
    google?: typeof google;
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function LoginForm() {
  const { setToken, setUser } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  // login by phone number
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLogin(true);
      const res = await api.post("/api/login", values);

      const data = res.data;

      if (!data?.isSuccess || !data?.token) {
        console.warn("Login unsuccessful:", data);
        return;
      }
      setToken(data.token);

      const user = getUser(data.token);
      if (user === null) {
        return;
      }
      setUser(user);

      toast.success("Đăng nhập thành công!");
      const path =
        user.role === "Member"
          ? "/"
          : user.role === "Staff"
          ? "/staff"
          : "/admin";
      navigate(path, { replace: true });
    } catch (error) {
      console.log("Login error:", error);
      toast.error("Đăng nhập thất bại!");
    } finally {
      setIsLogin(false);
    }
  };

  // handle google response
  const handleCredentialResponse = async (
    response: google.accounts.id.CredentialResponse
  ) => {
    // console.log("Google JWT Token:", response.credential);
    try {
      const res = await api.post("/api/google", {
        credential: response.credential,
      });
      const data = res.data;
      setToken(data.token); // store token

      const user = getUser(data.token);
      if (user === null) {
        return;
      }
      setUser(user);

      toast.success("Đăng nhập thành công!");
      const path =
        user.role === "Member"
          ? "/"
          : user.role === "Staff"
          ? "/staff"
          : "/admin";
      navigate(path, { replace: true });
    } catch (error) {
      toast.error("Đăng nhập thất bại!");
      const err = error as AxiosError;
      if (err) console.error("Error details:", err);
      else console.log("Login error:", error);
    }
  };

  const loadSDK = () => {
    window.google.accounts.id.initialize({
      client_id: clientID,
      callback: handleCredentialResponse,
      auto_select: false,
    });
  };

  const rendeSignInButton = () => {
    const container = document.getElementById("googleSignInDiv");
    if (!container) {
      console.log("Sign in div not found");
      return;
    }

    window.google.accounts.id.renderButton(container, {
      theme: "outline",
      size: "large",
      width: Math.min(window.innerWidth - 64, 500),
      type: "standard",
      logo_alignment: "center",
    });
  };
  // login by google
  useEffect(() => {
    const loadGoogleSDK = async () => {
      if (!window.google?.accounts) {
        // Wait for the script to load
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.google?.accounts) {
            loadSDK();
            rendeSignInButton();
          }
        };
        script.onerror = () => console.error("Failed to load Google SDK");
        document.head.appendChild(script);
      } else {
        // SDK is already loaded
        loadSDK();
        rendeSignInButton();
      }
    };

    loadGoogleSDK();
  }, [clientID]);

  return (
    <div className="relative h-screen flex items-center bg-[#F0EFF4] max-sm:bg-white overflow-hidden">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: -20, y: 100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -20, y: 10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="hidden md:block  w-[430px] h-[393px] bg-[#d94545] absolute top-[-150px] left-[-150px]"
          style={{ borderRadius: "38% 62% 50% 50% / 58% 61% 39% 42%" }}
        ></motion.div>
      </AnimatePresence>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: -20, y: -100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -20, y: 10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="hidden md:block w-[430px] h-[393px] bg-[#d94545] absolute bottom-[-120px] right-[-150px]"
          style={{ borderRadius: "38% 62% 50% 50% / 58% 61% 39% 42%" }}
        ></motion.div>
      </AnimatePresence>
      {true && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: -20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: -10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full"
          >
            <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-white sm:rounded-lg sm:mt-10 sm:border sm:shadow-lg sm:h-auto h-screen flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl text-center font-semibold text-red-600">
                Đăng nhập
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập số điện thoại"
                            {...field}
                            className="bg-[#F0EFF4]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Mật khẩu"
                            {...field}
                            className="bg-[#F0EFF4]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-red-700 hover:bg-red-800 cursor-pointer"
                    disabled={isLogin}
                  >
                    Đăng nhập
                  </Button>
                  <div className="text-center text-black text-sm">
                    Hoặc tiếp tục với
                  </div>
                  <div className="px-4 py-2 flex justify-center">
                    <div id="googleSignInDiv" />
                  </div>
                  <div className="text-center text-sm">
                    Chưa có tài khoản?{" "}
                    <Link to="/register" className="text-blue-600">
                      Đăng kí
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
