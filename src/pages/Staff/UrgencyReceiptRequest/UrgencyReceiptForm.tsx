import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, ArrowLeft, Users } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { VolunteerProps } from "../DonorLookup/DonorLookup";
import { getComponentId, getTypeId } from "@/types/BloodCompatibility";
import { authenApi } from "@/lib/instance";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/authen/AuthContext";
import { useNavigate } from "react-router-dom";

interface UrgentFormProps {
  setIsUrgentReceiptFormOpen: () => void;
  volunteerIds: VolunteerProps[];
}

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tên sự kiện."),
  address: z.string().min(1, "Vui lòng nhập địa chỉ."),
  bloodType: z.string().min(1, "Vui lòng chọn nhóm máu."),
  bloodTypeRh: z.string().min(1, "Vui lòng chọn yếu tố Rh."),
  bloodComponent: z.string().min(1, "Vui lòng chọn thành phần máu."),
  bloodVolume: z.string().min(1, "Vui lòng chọn lượng máu."),
  donationDate: z.date({ required_error: "Vui lòng chọn ngày hiến." }),
  maxOfDonor: z.coerce.number().min(1, "Số lượng người hiến phải lớn hơn 0."),
  staffName: z.string().min(1, "Vui lòng nhập tên/ID nhân viên."),
});

type FormData = z.infer<typeof formSchema>;

const UrgencyReceiptForm = ({ volunteerIds, setIsUrgentReceiptFormOpen }: UrgentFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Sự kiện hiến máu khẩn cấp",
      address: "387 Đ. Lê Văn Việt, Tăng Nhơn Phú A, Thủ Đức, Hồ Chí Minh",
      bloodType: volunteerIds[0]?.bloodTypeName.slice(0, -1) || "",
      bloodTypeRh: volunteerIds[0]?.bloodTypeName.slice(-1) || "",
      maxOfDonor: volunteerIds.length,
      staffName: user?.unique_name || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const volunteerIDs: number[] = volunteerIds.map(selected => selected.id);
    const bloodTypeId = getTypeId(data.bloodType + data.bloodTypeRh);
    const componentId = getComponentId(data.bloodComponent);

    const payload = {
      title: data.title,
      maxOfDonor: data.maxOfDonor,
      estimatedVolume: data.bloodVolume,
      eventTime: data.donationDate.toLocaleString('sv-SE').split(' ')[0],
      bloodTypeId: bloodTypeId !== 0 ? bloodTypeId : 1,
      bloodComponentId: componentId !== -1 ? componentId : 0,
      volunteerIds: volunteerIDs,
    };

    try {
      const response = await authenApi.post('/api/Volunteers/find-donors', payload);
      if (response.data.isSuccess) {
        toast.success('Tạo sự kiện khẩn cấp và gửi yêu cầu thành công!');
        navigate('/staff/receipt', { replace: true });
      } else {
        toast.error(response.data.message || 'Tạo sự kiện khẩn cấp thất bại!');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
            <Button variant="ghost" onClick={setIsUrgentReceiptFormOpen} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại tìm kiếm
            </Button>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Đơn yêu cầu máu khẩn cấp</h1>
            <p className="text-gray-500 mt-1">Tạo một sự kiện mới và gửi yêu cầu đến các tình nguyện viên đã chọn.</p>
        </header>

        <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 mb-8">
                <Users className="h-6 w-6"/>
                <p className="font-semibold">Đã chọn {volunteerIds.length} tình nguyện viên để gửi yêu cầu.</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="md:col-span-2">
                            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Thông tin sự kiện</h2>
                        </div>
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên sự kiện</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Địa chỉ</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="donationDate" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày hiến máu</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline" className={cn("w-full text-left font-normal", !field.value && "text-muted-foreground")}>
                                                {field.value ? new Date(field.value).toLocaleDateString('vi-VN') : <span>Chọn ngày</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="maxOfDonor" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số lượng người hiến</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="md:col-span-2 mt-4">
                             <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Yêu cầu máu</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <FormField control={form.control} name="bloodType" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nhóm máu</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="ABO" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="A">A</SelectItem>
                                            <SelectItem value="B">B</SelectItem>
                                            <SelectItem value="AB">AB</SelectItem>
                                            <SelectItem value="O">O</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="bloodTypeRh" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Yếu tố Rh</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Rh" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="+">+</SelectItem>
                                            <SelectItem value="-">-</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="bloodComponent" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thành phần máu</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Chọn thành phần" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="wholeblood">Máu toàn phần</SelectItem>
                                        <SelectItem value="redbloodcell">Hồng cầu</SelectItem>
                                        <SelectItem value="platelet">Tiểu cầu</SelectItem>
                                        <SelectItem value="plasma">Huyết tương</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="bloodVolume" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lượng máu cần (ml)</FormLabel>
                                 <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Chọn lượng máu" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="250">250ml</SelectItem>
                                        <SelectItem value="350">350ml</SelectItem>
                                        <SelectItem value="450">450ml</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="staffName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nhân viên tạo</FormLabel>
                                <FormControl><Input {...field} disabled /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <Button type="button" variant="outline" onClick={setIsUrgentReceiptFormOpen} disabled={isSubmitting}>Hủy</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
      </div>
    </div>
  );
};

export default UrgencyReceiptForm;
