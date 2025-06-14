import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import api from '@/lib/instance'
import { useAuth } from "@/hooks/authen/AuthContext";
import { getRole } from "@/utils/jwt"

const formSchema = z.object({
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

declare global {
  interface Window {
    google?: typeof google;
  }
}

const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export default function LoginForm() {
  const { setToken } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
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
      const res = await api.post('/api/Auth/login', values);

      const data = res.data;

      if (!data?.isSuccess || !data?.token) {
        setError("Login failed!");
        console.warn("Login unsuccessful:", data);
        return;
      }

      setToken(data.token);
      const role = getRole(data.token)
      if (role.length === 0) {
        setError('Something wrong')
        return
      }

      if (role === 'Member') navigate('/', { replace: true })
      if (role === 'Staff') navigate('/staff', { replace: true })
      if (role === 'Admin') navigate('/admin', { replace: true })

    } catch (error) {
      console.log("Login error:", error);
      setError("Login failed! Please try again.");
    }
  };

  // login by google
  useEffect(() => {
    const handleCredentialResponse = async (response: google.accounts.id.CredentialResponse) => {
      console.log("Google JWT Token:", response.credential);
      try {
        const res = await api.post('/api/Auth/google', { credential: response.credential })
        const data = res.data

        setToken(data.token); // store token
        const role = getRole(data.token)
        if (!role) {
          setError('Role is wrong')
          return
        }

        if (role === 'Member') navigate('/', { replace: true })
        if (role === 'Staff') navigate('/staff', { replace: true })
        if (role === 'Admin') navigate('/admin', { replace: true })

      } catch (error) {
        console.log("google error ", error)
        setError('Login failed! Please try again.')
      }
    };

    const container = document.getElementById("googleSignInDiv");
    if (!container || !window.google.accounts.id) {
      console.log("Google SDK not loaded or container not found")
    } else {
      window.google.accounts.id.initialize({
        client_id: clientID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        container,
        { theme: "outline", size: "large", width: 400, type: "standard", logo_alignment: "center" }
      );
    }

  }, [clientID]);

  return (
    <div className="max-w-md mx-auto mt-10 border rounded-lg shadow p-6 space-y-6 bg-white">
      <h2 className="text-2xl font-semibold text-red-600">Đăng nhập</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số điện thoại" {...field} />
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
                  <Input type="password" placeholder="Mật khẩu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 cursor-pointer">
            Đăng nhập
          </Button>
          <div className="text-center text-sm text-muted-foreground">Hoặc tiếp tục với</div>
          <div id="googleSignInDiv" className="flex justify-center" />
          <div className="text-center text-sm">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-blue-600">
              Đăng kí
            </Link>
          </div>
        </form>
      </Form>
      {error && <span className="text-red-500 text-[20px]">{error}</span>}
    </div>
  );
}
