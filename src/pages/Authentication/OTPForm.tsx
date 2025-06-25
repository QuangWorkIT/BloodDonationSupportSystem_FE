import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OTPForm() {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; //only number or null input

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically move to the next input if the current input is filled
    if (value && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const enteredOtp = otp.join("");
    console.log("Submitted OTP:", enteredOtp);
    // API and validation logic here
  };

  return (
    <div className="max-w-sm mx-auto p-6 rounded-md border bg-white shadow">
      <h2 className="text-2xl font-bold text-center mb-2">Nhập mã OTP</h2>
      <p className="text-sm text-gray-500 text-center mb-4">Một mã OTP đã được gửi đến số điện thoại 02xxxxxxxx</p>

      <div className="flex justify-center gap-3 mb-6">
        {otp.map((value, index) => (
          <Input
            key={index}
            type="text"
            maxLength={1}
            value={value}
            className="w-12 h-12 text-center text-xl font-medium border-2 rounded-md"
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
          />
        ))}
      </div>

      <Button className="w-full cursor-pointer bg-red-500 hover:bg-red-600" onClick={handleSubmit}>
        Xác nhận
      </Button>

      <p className="text-center text-sm mt-4 text-muted-foreground">
        Không nhận được OTP?{" "}
        <a href="#" className="text-blue-500 underline">
          Gửi lại bằng email
        </a>
      </p>
    </div>
  );
}
