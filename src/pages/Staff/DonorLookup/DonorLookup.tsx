"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import maleImg from '@/assets/images/male icon.png'
import { useState } from "react"
import { authenApi } from "@/lib/instance";
import type { AxiosError } from "axios";
import UrgencyReceiptForm from "../UrgencyReceiptRequest/UrgencyReceiptForm";
import LoadingSpinner from "@/components/layout/Spinner";
// import DonorMap from "./DonorMap";

export interface VolunteerProps {
    id: number,
    fullName: string,
    bloodTypeName: string,
    phone: string,
    gmail: string,
    distance: number,
    startVolunteerDate: Date,
    endVolunteerDate: Date,
    lat: number,
    lon: number
}
const formSchema = z.object({
    facility: z.string()
        .min(1, "Hãy nhập tên cơ sở y tế")
        .max(200, "Tên cơ sở không phù hợp")
})


function DonorLookup() {
    const [filterList, setFilterList] = useState<string[]>([])
    const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined)
    const [selectedDonor, setSelectedDonor] = useState<VolunteerProps[]>([])
    const [displayrDonorList, setDisplayrDonorList] = useState<VolunteerProps[]>([])
    const [donorFound, setDonorFound] = useState<VolunteerProps[]>([])
    const [isUrgentReceiptFormOpen, setIsUrgentReceiptFormOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            facility: ""
        }
    })

    const onSearchVolunteers = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
        const facilityId = 1
        try {
            setIsLoading(true)
            const response = await authenApi.get(`/api/Volunteers/${facilityId}/paged`)
            const data = response.data

            if (data.isSuccess) {
                setDonorFound(data.data.items)
                setDisplayrDonorList(data.data.items)
            }
        } catch (error) {
            const err = error as AxiosError
            if (err) console.log('Fail to fetch volunteers ', err)
            else console.log('Error fetching volunteers ', error)
        } finally {
            setIsLoading(false)
        }
    }

    const foundDonor = (filterCriterias: string[]) => {
        const filterListFound: VolunteerProps[] = []
        donorFound.forEach(donor => {
            if (filterCriterias.some(filter => filter === donor.bloodTypeName.substring(0, 1))) {
                filterListFound.push(donor)
            }
        })
        setDisplayrDonorList(filterListFound)
    }
    const handleSelectFilter = (item: string) => {
        const filterCriterias: string[] = filterList.includes(item)
            ? filterList
            : [...filterList, item];
        setFilterList(filterCriterias);
        setSelectedValue(undefined)

        foundDonor(filterCriterias)
    }

    const handleRemoveFilter = (item: string) => {
        const filterCriterias: string[] = filterList.filter(i => i !== item)
        setFilterList(filterCriterias)
        setSelectedValue(undefined)

        filterCriterias.length > 0 ? foundDonor(filterCriterias) : foundDonor(['A', 'B', 'AB', 'O'])
    }

    const toggleSelectDonor = (donor: VolunteerProps) => {
        if (selectedDonor.some(selected => selected.id === donor.id)) {
            setSelectedDonor(selectedDonor => selectedDonor.filter(selected => selected.id !== donor.id))
        } else {
            setSelectedDonor(prev => [...prev, donor])
        }
    }

    const toggleSelectAll = () => {
        const isSellectedAll = donorFound.every(donor =>
            selectedDonor.some(selected => selected.id === donor.id)
        )

        if (isSellectedAll) {
            setSelectedDonor(prev =>
                prev.filter(selected => !donorFound.some(donor => donor.id === selected.id))
            )
        } else {
            const newSelection = donorFound.filter(
                donor => !selectedDonor.some(selected => selected.id === donor.id)
            )

            setSelectedDonor(prev => [...prev, ...newSelection])
        }
    }

    const handleCreateUrgent = () => {
        setIsUrgentReceiptFormOpen(true)
    }
    return (
        <div className="flex flex-col items-center bg-gray-200 shadow-md rounded-xl w-full m-4 p-6">
            {
                isUrgentReceiptFormOpen ? (
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <UrgencyReceiptForm
                                volunteerIds={selectedDonor}
                                setIsUrgentReceiptFormOpen={() => setIsUrgentReceiptFormOpen(false)}
                            />
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <>
                        {/* search engine */}
                        <div className="flex flex-col  p-10 h-[190px]">
                            <Form {...form}>
                                <form className="w-[640px]" onSubmit={form.handleSubmit(onSearchVolunteers)}>
                                    <FormField
                                        control={form.control}
                                        name="facility"
                                        render={({ field }) => (
                                            <FormItem className="flex">
                                                <div className="flex-1">
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                className="h-[50px] bg-white border border-[#C14B53]"
                                                                placeholder="Nhập địa chỉ của cơ sở ý tế" {...field} />
                                                            <Button
                                                                type="submit"
                                                                className="absolute right-3 top-2 rounded-[10px] hover:cursor-pointer hover:bg-white hover:scale-110"
                                                                variant="ghost"
                                                            >

                                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M25.8222 28L16.0222 18.2C15.2444 18.8222 14.35 19.3148 13.3389 19.6778C12.3278 20.0407 11.2519 20.2222 10.1111 20.2222C7.28519 20.2222 4.89378 19.2433 2.93689 17.2853C0.980001 15.3274 0.00103786 12.936 8.23045e-07 10.1111C-0.00103621 7.28622 0.977927 4.89481 2.93689 2.93689C4.89585 0.978963 7.28726 0 10.1111 0C12.935 0 15.3269 0.978963 17.2869 2.93689C19.2469 4.89481 20.2253 7.28622 20.2222 10.1111C20.2222 11.2519 20.0407 12.3278 19.6778 13.3389C19.3148 14.35 18.8222 15.2444 18.2 16.0222L28 25.8222L25.8222 28ZM10.1111 17.1111C12.0556 17.1111 13.7086 16.4308 15.0702 15.0702C16.4319 13.7096 17.1122 12.0566 17.1111 10.1111C17.1101 8.16563 16.4298 6.51311 15.0702 5.15356C13.7107 3.794 12.0576 3.11319 10.1111 3.11111C8.16459 3.10904 6.51208 3.78985 5.15356 5.15356C3.79504 6.51726 3.11422 8.16978 3.11111 10.1111C3.108 12.0524 3.78882 13.7055 5.15356 15.0702C6.5183 16.435 8.17082 17.1153 10.1111 17.1111Z" fill="#C14B53" />
                                                                </svg>
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                    {!field.value && (
                                                        <AnimatePresence>
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -20 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <FormDescription>
                                                                    <Button
                                                                        variant="ghost"
                                                                        onClick={() => field.onChange('387 Đ. Lê Văn Việt, Tăng Nhơn Phú A, Thủ Đức, Hồ Chí Minh')}
                                                                        className="w-full text-left hover:cursor-pointer hover:bg-[#f2f2f2] transition-colors duration-200 ease-in-out flex items-center gap-2 bg-white p-2 mt-1 rounded-[10px] border-2">
                                                                        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M8.17808 18V16.3562C6.46575 16.1644 4.99644 15.4553 3.77014 14.229C2.54384 13.0027 1.83507 11.5337 1.64384 9.82192H0V8.17808H1.64384C1.83562 6.46575 2.54466 4.99644 3.77096 3.77014C4.99726 2.54384 6.4663 1.83507 8.17808 1.64384V0H9.82192V1.64384C11.5342 1.83562 13.0036 2.54466 14.2299 3.77096C15.4562 4.99726 16.1649 6.4663 16.3562 8.17808H18V9.82192H16.3562C16.1644 11.5342 15.4556 13.0036 14.2299 14.2299C13.0041 15.4562 11.5348 16.1649 9.82192 16.3562V18H8.17808ZM9 14.7534C10.589 14.7534 11.9452 14.1918 13.0685 13.0685C14.1918 11.9452 14.7534 10.589 14.7534 9C14.7534 7.41096 14.1918 6.05479 13.0685 4.93151C11.9452 3.80822 10.589 3.24658 9 3.24658C7.41096 3.24658 6.05479 3.80822 4.93151 4.93151C3.80822 6.05479 3.24658 7.41096 3.24658 9C3.24658 10.589 3.80822 11.9452 4.93151 13.0685C6.05479 14.1918 7.41096 14.7534 9 14.7534Z" fill="black" />
                                                                        </svg>
                                                                        Địa chỉ cơ sở y tế hiện tại
                                                                    </Button>
                                                                </FormDescription>
                                                            </motion.div>
                                                        </AnimatePresence>
                                                    )}
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>

                            <AnimatePresence>
                                <div className="flex gap-2 mt-2">
                                    {filterList.length > 0 && (
                                        filterList.map((item, index) => {
                                            return (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                    key={index}
                                                >
                                                    <Button
                                                        className="bg-[#14AF18] hover:bg-[#129916] relative group">
                                                        <div
                                                            onClick={() => handleRemoveFilter(item)}
                                                            className="hover:cursor-pointer hover:scale-110 absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100
                                                            backdrop-blur-sm bg-white/30 p-1.5 rounded-full transition-all duration-200"
                                                        >
                                                            <svg
                                                                className="w-4 h-4 text-black"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={2}
                                                                stroke="currentColor"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                            </svg>
                                                        </div>
                                                        Nhóm máu {item}
                                                    </Button>
                                                </motion.div>
                                            )
                                        })
                                    )}
                                </div>
                            </AnimatePresence>
                        </div>

                        {/* <div className="w-[200px] h-[200px]">
                            <DonorMap volunteers={donorFound}></DonorMap>
                        </div> */}
                        {/* Donor list */}
                        {
                            isLoading ? (<LoadingSpinner />) : (
                                <div className="">
                                    {displayrDonorList?.length > 0 ? (
                                        <AnimatePresence>
                                            <motion.div
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                {/* list header */}
                                                <section className="flex justify-between ">
                                                    <h1 className="text-[30px] font-semibold">Danh sách tìm được</h1>
                                                    <Select value={selectedValue} onValueChange={handleSelectFilter}>
                                                        <SelectTrigger className="bg-white hover:cursor-pointer hover:bg-[#f2f2f2] transition-colors duration-200 ease-in-out">
                                                            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M8.75273 20.5C8.39948 20.5 8.10359 20.38 7.86504 20.14C7.6265 19.9 7.50681 19.6033 7.50598 19.25V11.75L0.274804 2.5C-0.0368848 2.08333 -0.0834302 1.64583 0.135167 1.1875C0.353765 0.729167 0.732778 0.5 1.27221 0.5H18.7268C19.267 0.5 19.6464 0.729167 19.865 1.1875C20.0836 1.64583 20.0367 2.08333 19.7242 2.5L12.493 11.75V19.25C12.493 19.6042 12.3733 19.9012 12.1339 20.1412C11.8945 20.3812 11.5987 20.5008 11.2462 20.5H8.75273Z" fill="black" />
                                                            </svg>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="A">A</SelectItem>
                                                            <SelectItem value="B">B</SelectItem>
                                                            <SelectItem value="AB">AB</SelectItem>
                                                            <SelectItem value="O">O</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </section>
                                                {/* list found */}
                                                <section className="relative flex flex-col  items-end">
                                                    <div className="py-5 flex items-center gap-2">
                                                        <label htmlFor="selectall">Chọn tất cả</label>
                                                        <Input type="checkbox" className="w-[22px]" onChange={toggleSelectAll} checked={donorFound.length === selectedDonor.length} />
                                                    </div>
                                                    <div className="flex flex-col gap-10 pb-10 items-center">
                                                        {(
                                                            displayrDonorList.map((donor, index) => {
                                                                return (
                                                                    <div key={index} className="relative flex bg-white rounded-[7px] gap-10 items-center  w-[859px] p-5 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                                                                        <div className="">
                                                                            <img src={maleImg} alt="male avartar" />
                                                                        </div>
                                                                        <div className="flex flex-col gap-2">
                                                                            <div className="flex gap-5">
                                                                                <p className="text-[22px] font-bold">{donor.fullName}</p>
                                                                                <Button variant={"outline"}>
                                                                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path fillRule="evenodd" clipRule="evenodd" d="M2.25999 0.628316C2.40399 0.4843 2.57697 0.372548 2.76745 0.300477C2.95793 0.228405 3.16156 0.19766 3.36482 0.210281C3.56809 0.222902 3.76635 0.278601 3.94645 0.373683C4.12655 0.468764 4.28438 0.601055 4.40946 0.76178L5.88546 2.66012C6.15677 3.00783 6.25248 3.46178 6.14536 3.88939L5.69492 5.69202C5.67149 5.78556 5.67269 5.88357 5.69838 5.97651C5.72408 6.06945 5.77341 6.15415 5.84155 6.22236L7.86458 8.24451C7.9328 8.31266 8.0175 8.36198 8.11044 8.38768C8.20337 8.41338 8.30138 8.41457 8.39492 8.39114L10.1967 7.94071C10.408 7.88793 10.6286 7.8839 10.8417 7.92892C11.0548 7.97395 11.2549 8.06685 11.4268 8.20061L13.3252 9.67661C14.0074 10.2069 14.0706 11.2158 13.4595 11.8261L12.6078 12.6778C11.9993 13.2863 11.0888 13.5541 10.2397 13.2555C8.06777 12.4911 6.0958 11.2474 4.47004 9.6169C2.83919 7.99123 1.59526 6.01926 0.83053 3.84724C0.531993 2.99817 0.799798 2.08763 1.40829 1.47827L2.25999 0.627438V0.628316Z" fill="black" />
                                                                                    </svg>
                                                                                </Button>
                                                                            </div>
                                                                            <p><span className="text-[#7D7D7F]">Loại máu:</span> {donor.bloodTypeName}</p>
                                                                            <p><span className="text-[#7D7D7F]">Số điện thoại:</span> {donor.phone}</p>
                                                                            <p><span className="text-[#7D7D7F]">Gmail: </span>{donor.gmail}</p>
                                                                        </div>

                                                                        <div className="absolute right-5 top-5 flex flex-col items-center gap-2">
                                                                            <p>Khoảng {donor.distance} km</p>
                                                                            <Input
                                                                                type="checkbox"
                                                                                className="w-[20px]"
                                                                                checked={selectedDonor.some(selected => selected.id === donor.id)}
                                                                                onChange={() => toggleSelectDonor(donor)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        )}
                                                    </div>
                                                    <Button
                                                        disabled={selectedDonor.length === 0}
                                                        onClick={handleCreateUrgent}
                                                        className="bg-[#4F81E5] text-[16px] text-white rounded-[7px] h-[50px] hover:bg-[#2c54a3] hover:cursor-pointer">
                                                        Tạo yêu cầu cần máu
                                                    </Button>
                                                </section>
                                            </motion.div>
                                        </AnimatePresence>
                                    ) : <>Không tìm thấy tình nguyện viên phù hợp</>}
                                </div>
                            )
                        }
                    </>
                )
            }
        </div>
    )
}


export default DonorLookup
