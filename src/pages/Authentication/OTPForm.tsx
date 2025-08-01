import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth'
import { auth } from '@/configs/firsbase'
import { formatPhoneRegister, hiddenPhone } from "@/utils/format";
import { useNavigate } from "react-router-dom";
import api from "@/lib/instance";
import { type FormData } from '@/pages/Authentication/RegisterForm'
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

export default function OTPForm() {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)
  const [phone, setPhone] = useState<string>('')
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [registerUser, setRegisterUser] = useState<FormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate()
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

  // handle the invisible recaptcha
  useEffect(() => {
    const recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible'
    })
    setRecaptchaVerifier(recaptcha)
    return () => {
      recaptchaVerifier?.clear()
    }
  }, [auth])

  // send OTP
  useEffect(() => {
    const sendOtp = async () => {
      const temp = localStorage.getItem('tempUser')

      if (!temp) {
        console.log('temp user not found')
        return
      }
      if (!recaptchaVerifier) {
        console.log('Fail to verify recaptcha')
        return
      }

      const registerUser = JSON.parse(temp)
      setRegisterUser(registerUser)
      setPhone(registerUser.phone)
      console.log(registerUser)
      try {
        const result = await signInWithPhoneNumber(auth, registerUser.phone, recaptchaVerifier)
        setConfirmationResult(result)
      } catch (error) {
        console.log('OTP send failed ', error)
      }
    };

    if (recaptchaVerifier) {
      sendOtp()
    }
  }, [recaptchaVerifier])

  // verify otp
  const verifyOtp = async () => {
    const enteredOtp = otp.join('')
    if (enteredOtp.length !== 6 || !recaptchaVerifier) {
      console.log("Invalid OTP input or recaptchar verifier failed")
      return
    }
    try {
      setIsSubmitting(true)
      const credential = await confirmationResult?.confirm(enteredOtp)
      console.log("otp correct: ", credential)
      if (!registerUser) {
        console.log('Regiter user not found')
        return
      }

      registerUser.phone = formatPhoneRegister(registerUser.phone)
      console.log(registerUser)
      // only proceed if OTP is correct
      await api.post("/api/auth/register", registerUser)
      localStorage.removeItem('tempUser')
      toast.success('Đăng ký thành công!')
      navigate('/login', { replace: true })
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      const errMsg = err.response?.data?.message

      if (errMsg) {
        console.log('Register failed', errMsg)
        toast.error('Tài khoản đã tồn tại!')
      } else {
        console.log('OTP verify failed', error)
        toast.error('OTP không khớp')
      }
    }finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#F0EFF4]">
      {confirmationResult ? (
        <div className="max-w-sm mx-auto mb-10 p-6 rounded-md border bg-white shadow">
          <h2 className="text-2xl font-bold text-center mb-2">Nhập mã OTP</h2>
          <p className="text-sm text-gray-500 text-center mb-4">Một mã OTP đã được gửi đến số điện thoại <span className="font-semibold">{hiddenPhone(phone)}</span></p>

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

          <Button
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-red-700 hover:bg-red-800"
            onClick={verifyOtp}>
            Xác nhận
          </Button>

          <p className="text-center text-sm mt-4 text-muted-foreground">
            Không nhận được OTP?{" "}
            <a href="#" className="text-blue-500 underline">
              Gửi lại bằng email
            </a>
          </p>
        </div>
      ) : <>
        Loading...
      </>}

      <div id="recaptcha-container"></div>
    </div>
  );
}
