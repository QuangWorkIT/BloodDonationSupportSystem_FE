"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { z } from "zod"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import BloodTypeSelect, { BloodTypeSelectRh } from "../../components/layout/BloodTypeSelect"
import { authenApi } from "@/lib/instance"
import { useAuth } from "@/hooks/authen/AuthContext"
import AlertBanner from "@/components/layout/AlerBanner"
import type { AxiosError } from "axios"
import { getBloodTypeRh } from "@/types/BloodCompatibility"


interface VolunteerFormProps {
  setActiveTab: () => void
}
const formSchema = z.object({
  donorName: z.string(),
  address: z.string(),
  bloodType: z.string(),
  bloodTypeRh: z.string(),

  lastDonation: z.coerce.date({
    required_error: "Thông tin bắt buộc",
    invalid_type_error: "Thông tin không phù hợp"
  }),

  startDonation: z.coerce.date({
    required_error: "Thông tin bắt buộc"
  }),

  endDonation: z.coerce.date({
    required_error: "Thông tin bắt buộc"
  })
})
type formType = z.infer<typeof formSchema>
function VolunteerForm({ setActiveTab }: VolunteerFormProps) {
  const { user } = useAuth()
  const nav = useNavigate()
  const [warning, setWarning] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => {
    if (!user) {
      setWarning('Hãy đăng nhập để tiếp tục!')
      return
    }

    if (user.phone === null) {
      setWarning('Hãy cập nhật thông tin tài khoản để tiếp tục !')
      return
    }
  }, [])

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      donorName: user?.unique_name,
      address: user?.address,
      lastDonation: user?.lastDonation || undefined,
      startDonation: undefined,
      endDonation: undefined,
      bloodType: getBloodTypeRh(user?.bloodType || "").bloodType || "",
      bloodTypeRh: getBloodTypeRh(user?.bloodType || "").rh || ""
    }
  })
  const onSubmit = async (values: formType) => {
    const payload = {
      lastDonation: values.lastDonation.toLocaleString('sv-SE').split(' ').join('T'),
      startVolunteerDate: values.startDonation.toLocaleString('sv-SE').split(' ').join('T'),
      endVolunteerDate: values.endDonation.toLocaleString('sv-SE').split(' ').join('T')
    }
    console.log('payload ', payload)
    try {
      setIsSubmitting(true)
      const response = await authenApi.post('/api/Volunteers',
        payload
      )
      const data = response.data
      if (data.isSuccess) {
        toast.success('Đăng ký tình nguyện viên thành công!')
        nav('/', { replace: true })
      } else {
        console.log("Error volunteer submitting ", data)
        toast.error('Đăng ký tình nguyện viên thất bại. Vui lòng thử lại sau!')
      }
    } catch (error) {
      toast.error('Đăng ký tình nguyện viên thất bại. Vui lòng thử lại sau!')
      const err = error as AxiosError
      if (err) console.log('Error axios volunteer register ', err)
      else console.log('Error volunteer register ', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="w-full">
      {warning.length > 0 && (
        <AlertBanner warning={warning} />
      )

      }
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-[750px] mx-auto border border-gray-200 p-5 rounded-lg shadow-lg bg-white">

          <div className="flex gap-2 items-center mb-5">
            <h1 className="font-semibold text-[25px]">Đơn đăng ký tình nguyện</h1>
            <Tooltip>
              <TooltipTrigger>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.0003 18.3334C14.6027 18.3334 18.3337 14.6025 18.3337 10.0001C18.3337 5.39771 14.6027 1.66675 10.0003 1.66675C5.39795 1.66675 1.66699 5.39771 1.66699 10.0001C1.66699 14.6025 5.39795 18.3334 10.0003 18.3334Z" stroke="black" stroke-width="1.5" />
                  <path d="M8.4375 7.39603C8.43754 7.1224 8.50943 6.85357 8.64599 6.61645C8.78255 6.37933 8.97899 6.18223 9.21565 6.04487C9.45231 5.90751 9.72089 5.83471 9.99452 5.83375C10.2682 5.83279 10.5372 5.90371 10.7749 6.0394C11.0125 6.1751 11.2103 6.37082 11.3485 6.60698C11.4867 6.84313 11.5605 7.11145 11.5625 7.38508C11.5644 7.6587 11.4945 7.92804 11.3596 8.16615C11.2248 8.40426 11.0298 8.60279 10.7942 8.74186C10.3983 8.97603 10 9.33186 10 9.79186V10.8335" stroke="black" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M10.0003 14.1667C10.4606 14.1667 10.8337 13.7936 10.8337 13.3333C10.8337 12.8731 10.4606 12.5 10.0003 12.5C9.54009 12.5 9.16699 12.8731 9.16699 13.3333C9.16699 13.7936 9.54009 14.1667 10.0003 14.1667Z" fill="black" />
                </svg>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-200">
                <p className="text-black">Thông tin cá nhân sẽ được cập nhật sau khi hiến máu</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <FormField
            control={form.control}
            name="donorName"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-5 mb-10 md:flex-row">
                <FormLabel className="text-[16px] w-[150px]">Tên người hiến</FormLabel>
                <div className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Nhập tên người hiến"
                      {...field}
                      readOnly
                      className="cursor-default hover:bg-gray-100 transition-all duration-200 ease-in-out" />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="flex flex-col md:flex-row gap-5 mb-10">
                <FormLabel className="text-[16px] w-[150px]">Địa chỉ</FormLabel>
                <div className="flex-1">
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Nhập địa chỉ"
                      readOnly
                      className="cursor-default w-full border-2 border-gray-200 rounded-lg p-2 resize-none shadow-sm focus:shadow-lg
                        focus:border-primary-500 transition-all duration-300 ease-in-out" />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastDonation"
            render={({ field }) => (
              <FormItem className="flex flex-col md:flex-row mb-10 md:mb-10 gap-5">
                <FormLabel className="w-full md:w-[150px] text-base md:text-[16px] md:mb-0 whitespace-nowrap">
                  Lần cuối hiến máu
                </FormLabel>
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="w-full shadow-sm font-semibold"
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: vi })
                          ) : (
                            <span>mm/dd/yyyy</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-75" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: Date) => {
                          if (!user?.lastDonation) {
                            return date >= new Date() || date < new Date("2000-01-01")
                          } else {
                            return date >= new Date() || date < new Date()
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />


          <div className="flex flex-col md:flex-row md:gap-5 mb-10">
            <FormLabel className="flex flex-col items-start w-[200px] 
            mb-5 md:mb-0 md:w-[150px] justify-center text:sm md:text-[16px]">
              <p>Ngày có thể hiến</p>
              <p className="text-red-500">*Tối đa 1 năm</p>
            </FormLabel>

            <div className="flex flex-col md:flex-row gap-9 flex-1">
              <FormField
                control={form.control}
                name="startDonation"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>
                      Từ
                    </FormLabel>
                    <div className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="w-full md:min-w-[250px] shadow-sm font-semibold"
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: vi })
                              ) : (
                                <span>mm/dd/yyyy</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-75" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date: Date) => {
                              return date >= new Date('2100-01-01') || date < new Date()
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="endDonation"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>
                      Đến
                    </FormLabel>
                    <div className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="w-full md:min-w-[250px] shadow-sm font-semibold"
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: vi })
                              ) : (
                                <span>mm/dd/yyyy</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-75" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date: Date) => {
                              return date >= new Date('2100-01-01') || date < new Date()
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5 mb-10">
            <FormLabel className="w-[150px] text-[16px]">Nhóm máu</FormLabel>
            <div className="flex flex-1 gap-10">
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <div className="font-bold">
                      <FormControl>
                        <BloodTypeSelect
                          onValueChange={field.onChange}
                          defaultVal={field.value}
                          disabled={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bloodTypeRh"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <div className="font-bold">
                      <FormControl>
                        <BloodTypeSelectRh
                          onValueChange={field.onChange}
                          defaultVal={field.value}
                          disabled={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5 md:justify-end">
            <Button
              disabled={isSubmitting}
              onClick={setActiveTab}
              type="button"
              variant='ghost'
              className="w-full md:w-30 border border-gray-500/20 shadow-md font-bold"
            >
              Hủy
            </Button>

            <Button
              disabled={warning.length > 0 || isSubmitting}
              type="submit"
              variant='destructive'
              className="w-full md:w-30 shadow-md bg-[#C14B53] font-bold"
            >
              Gửi
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default VolunteerForm
