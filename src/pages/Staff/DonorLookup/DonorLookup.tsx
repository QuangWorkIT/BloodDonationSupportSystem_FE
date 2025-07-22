"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ListFilter, Users, Crosshair } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import maleImg from '@/assets/images/male icon.png';
import { useState, useEffect, useRef } from "react";
import { authenApi } from "@/lib/instance";
import UrgencyReceiptForm from "../UrgencyReceiptRequest/UrgencyReceiptForm";
import LoadingSpinner from "@/components/layout/Spinner";
import DonorMap from "./DonorMap";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface VolunteerProps {
  id: number;
  fullName: string;
  bloodTypeName: string;
  phone: string;
  gmail: string;
  distance: number;
  startVolunteerDate: Date;
  endVolunteerDate: Date;
  latitude: number;
  longitude: number;
}

const formSchema = z.object({
  facility: z.string().max(200, "Tên cơ sở không phù hợp"),
});

const bloodGroups = ["A", "B", "AB", "O"];

function DonorLookup() {
  const [filterList, setFilterList] = useState<string[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<VolunteerProps[]>([]);
  const [displayDonorList, setDisplayDonorList] = useState<VolunteerProps[]>([]);
  const [donorFound, setDonorFound] = useState<VolunteerProps[]>([]);
  const [isUrgentReceiptFormOpen, setIsUrgentReceiptFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [] = useState(true);
  const facilityInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { facility: "" },
  });

  const onSearchVolunteers = async (values: z.infer<typeof formSchema>) => {
    if (!values.facility) return;
    const facilityId = 1;
    setIsLoading(true);
    try {
      const response = await authenApi.get(`/api/Volunteers/${facilityId}/paged`);
      const data = response.data;
      if (data.isSuccess) {
        setDonorFound(data.data.items);
        setDisplayDonorList(data.data.items);
      }
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const foundDonor = () => {
      if (filterList.length === 0) {
        setDisplayDonorList(donorFound);
        return;
      }
      const criteriaSet = new Set(filterList.map((item) => item.toUpperCase()));
      const filtered = donorFound.filter((donor) => {
        const bloodPrefix = donor.bloodTypeName.startsWith("AB") ? "AB" : donor.bloodTypeName[0];
        return criteriaSet.has(bloodPrefix.toUpperCase());
      });
      setDisplayDonorList(filtered);
    };
    foundDonor();
  }, [filterList, donorFound]);

  const toggleSelectDonor = (donor: VolunteerProps) => {
    setSelectedDonor((prev) =>
      prev.some((d) => d.id === donor.id)
        ? prev.filter((d) => d.id !== donor.id)
        : [...prev, donor]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDonor.length === displayDonorList.length) {
      setSelectedDonor([]);
    } else {
      setSelectedDonor(displayDonorList);
    }
  };

  const handleCreateUrgent = () => {
    setIsUrgentReceiptFormOpen(true);
  };

  if (isUrgentReceiptFormOpen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <UrgencyReceiptForm
            volunteerIds={selectedDonor}
            setIsUrgentReceiptFormOpen={() => setIsUrgentReceiptFormOpen(false)}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="flex h-full bg-gray-50/50">
      {/* Left Panel */}
      <div className="w-full md:w-[450px] lg:w-[500px] flex flex-col bg-white shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Tìm kiếm tình nguyện viên</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSearchVolunteers)} className="mt-4 space-y-4">
              <FormField
                control={form.control}
                name="facility"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div>
                        <div className="relative flex items-center mb-2">
                          <input
                            ref={facilityInputRef}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#C14B53] text-sm"
                            placeholder="Nhập địa chỉ cơ sở y tế..."
                            value={field.value}
                            onChange={field.onChange}
                            name={field.name}
                            id={field.name}
                          />
                        </div>
                        {field.value === "" && (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 text-base font-normal cursor-pointer"
                            onClick={() => {
                              const address = "387 Đ. Lê Văn Việt, Tăng Nhơn Phú A, Thủ Đức, Hồ Chí Minh";
                              if (facilityInputRef.current) {
                                facilityInputRef.current.value = address;
                                field.onChange(address);
                              }
                            }}
                          >
                            <Crosshair className="w-5 h-5" />
                            Địa chỉ cơ sở y tế hiện tại
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <LoadingSpinner /> : "Tìm kiếm"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <ListFilter className="h-4 w-4 mr-2" />
                  Lọc ({filterList.length})
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Nhóm máu</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {bloodGroups.map((group) => (
                      <Button
                        key={group}
                        variant={filterList.includes(group) ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setFilterList((prev) =>
                            prev.includes(group)
                              ? prev.filter((g) => g !== group)
                              : [...prev, group]
                          );
                        }}
                      >
                        {group}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {filterList.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setFilterList([])}>
                Xóa lọc
              </Button>
            )}
          </div>
          <Button onClick={handleCreateUrgent} disabled={selectedDonor.length === 0}>
            Tạo yêu cầu ({selectedDonor.length})
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner />
            </div>
          ) : displayDonorList.length > 0 ? (
            <div className="divide-y divide-gray-100">
              <div className="p-4 flex justify-between items-center bg-gray-50/70">
                <h2 className="text-sm font-semibold text-gray-600 uppercase">
                  {displayDonorList.length} kết quả
                </h2>
                <div className="flex items-center">
                  <label htmlFor="select-all" className="text-sm mr-2">Chọn tất cả</label>
                  <Checkbox
                    id="select-all"
                    checked={selectedDonor.length === displayDonorList.length && displayDonorList.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </div>
              </div>
              {displayDonorList.map((donor) => (
                <motion.div
                  key={donor.id}
                  onClick={() => toggleSelectDonor(donor)}
                  className={`p-4 cursor-pointer transition-colors ${selectedDonor.some((d) => d.id === donor.id) ? "bg-red-50" : "hover:bg-gray-50"
                    }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 -ml-[7px]"> {/* Move icons 7px to the left */}
                      <img src={maleImg} alt="avatar" className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-semibold text-gray-800">{donor.fullName}</p>
                        <p className="text-sm text-gray-500">{donor.gmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-[#C14B53]">{donor.bloodTypeName}</p>
                      <p className="text-sm text-gray-500">~{donor.distance.toFixed(1)} km</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Users className="h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                Không tìm thấy tình nguyện viên
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Hãy thử một địa chỉ khác hoặc điều chỉnh bộ lọc.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="flex-1 hidden md:block relative">
        <DonorMap
          selectedDonor={selectedDonor}
          volunteers={displayDonorList}
          toggleSelectDonor={toggleSelectDonor}
        />
        <div className="absolute top-4 right-4 bg-white p-1.5 rounded-full shadow-lg">
          <Checkbox
            id="select-all-map"
            checked={selectedDonor.length === displayDonorList.length && displayDonorList.length > 0}
            onCheckedChange={toggleSelectAll}
            className="h-6 w-6"
          />
        </div>
      </div>
    </div>
  );
}

export default DonorLookup;
