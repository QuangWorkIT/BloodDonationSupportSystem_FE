import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import {authApi} from '@/lib/instance'
import { useAuth } from "@/hooks/authen/AuthContext";

const formSchema = z.object({
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

type CredentialResponse = {
  clientId: string;
  credential: string;
  select_by: string;
};

declare global {
  interface Window {
    google: any;
  }
}

const clientID = "359043283189-gvumkk8gmenj0j2skbcr9jl6h28gk2hb.apps.googleusercontent.com";

export default function LoginForm() {
  const {setToken} = useAuth()
  const [error,setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    const res = await authApi.post('/api/Auth/login', {
      phone: values.phone,
      password: values.password,
    });

    const data = res.data;

    if (!data?.isSuccess || !data?.token) {
      setError("Login failed!");
      console.warn("Login unsuccessful:", data);
      return;
    }

    setToken(data.token);
    navigate('/', { replace: true });
  } catch (error) {
    console.log("Login error:", error);
    setError("Login failed! Please try again.");
  }
};

  useEffect(() => {
    const handleCredentialResponse = (response: CredentialResponse) => {
      console.log("Google JWT Token:", response.credential);
    };

    window.google?.accounts.id.initialize({
      client_id: clientID,
      callback: handleCredentialResponse,
    });

    window.google?.accounts.id.renderButton(document.getElementById("googleSignInDiv"), { theme: "outline", size: "large", width: 400 });
  }, []);

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
            <Link to = "/register" className="text-blue-600">
              Đăng kí
            </Link>
          </div>
        </form>
      </Form>
      {error && <span className="text-red-500 text-[20px]">{error}</span>}
    </div>
  );
}
