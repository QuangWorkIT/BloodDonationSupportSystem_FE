import DonorCard from "./DonorCard"
import { motion, AnimatePresence } from "framer-motion";
"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { authenApi } from "@/lib/instance";
import type { DonorCardProps } from '@/pages/Staff/ManageReceipt/DonorCard'
import LoadingSpinner from "@/components/layout/Spinner";
import HealthCheckForm from "./HealthCheckForm";

const searchSchema = z.object({
    searchContent: z.string()
})

function DonorReceiptList() {
    const { eventId } = useParams()
    const [listOfDonor, setListOfDonor] = useState<DonorCardProps[]>([])
    const [eventTime, setEventTime] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isHeathCheckout, setIsHealthCheckout] = useState(false)
    const [currentDonor, setCurrentDonor] = useState<DonorCardProps | null>(null)
    // fetch registration
    useEffect(() => {
        const getDonors = async () => {
            try {
                const response = await authenApi.get(`/api/events/${eventId}/blood-registrations`)
                const data = response.data
                if (data.isSuccess) {
                    console.log('data ', data)
                    setEventTime(data.data.eventTime)
                    setListOfDonor(data.data.items)
                } else {
                    console.log('Donor list status failed')
                }
            } catch (error) {
                console.log('Fail to fetch donors', error)
            } finally {
                setIsLoading(false)
            }
        }
        getDonors()
    }, [])

    const searchForm = useForm<z.infer<typeof searchSchema>>({
        resolver: zodResolver(searchSchema),
    })
    return (
        <div className="container flex flex-col gap-4 bg-gray-200 rounded-xl px-4 py-8 m-4">
            <div className="flex justify-between items-center pb-4">
                <p className="text-[26px] font-bold">Sự kiện ngày <span className="italic font-semibold">{eventTime}</span></p>

                {/* search donor */}
                <Form {...searchForm}>
                    <form className="w-100">
                        <FormField
                            control={searchForm.control}
                            name="searchContent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                className="h-[45px] bg-white border-2 border-[#C14B53] shadow-md"
                                                placeholder="Tìm kiếm người hiến" {...field} />

                                            <Button
                                                className="absolute right-3 top-1 bg-transparent hover:bg-transparent hover:cursor-pointer transition duration-150 hover:scale-120"
                                                type="submit">
                                                <svg
                                                    width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M25.8222 28L16.0222 18.2C15.2444 18.8222 14.35 19.3148 13.3389 19.6778C12.3278 20.0407 11.2519 20.2222 10.1111 20.2222C7.28519 20.2222 4.89378 19.2433 2.93689 17.2853C0.980001 15.3274 0.00103786 12.936 8.23045e-07 10.1111C-0.00103621 7.28622 0.977927 4.89481 2.93689 2.93689C4.89585 0.978963 7.28726 0 10.1111 0C12.935 0 15.3269 0.978963 17.2869 2.93689C19.2469 4.89481 20.2253 7.28622 20.2222 10.1111C20.2222 11.2519 20.0407 12.3278 19.6778 13.3389C19.3148 14.35 18.8222 15.2444 18.2 16.0222L28 25.8222L25.8222 28ZM10.1111 17.1111C12.0556 17.1111 13.7086 16.4308 15.0702 15.0702C16.4319 13.7096 17.1122 12.0566 17.1111 10.1111C17.1101 8.16563 16.4298 6.51311 15.0702 5.15356C13.7107 3.794 12.0576 3.11319 10.1111 3.11111C8.16459 3.10904 6.51208 3.78985 5.15356 5.15356C3.79504 6.51726 3.11422 8.16978 3.11111 10.1111C3.108 12.0524 3.78882 13.7055 5.15356 15.0702C6.5183 16.435 8.17082 17.1153 10.1111 17.1111Z" fill="#C14B53" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </form>
                </Form>
            </div>

            {/* waiting for fetching data */}
            {isLoading && <LoadingSpinner />}

            {/* display list of donor fetched */}
            {
                !isLoading && !isHeathCheckout && (
                    <AnimatePresence>
                        {listOfDonor.length > 0 ? (
                            listOfDonor.map((donor, index) => (
                                <motion.div
                                    key={donor.id}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <DonorCard key={donor.id}
                                        id={donor.id}
                                        memberName={donor.memberName}
                                        phone={donor.phone}
                                        dob= {donor.dob}
                                        type="B+"
                                        eventTime={eventTime}
                                        handleHeathCheckout={() => {
                                            setCurrentDonor(donor)
                                            setIsHealthCheckout(true)
                                        }}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <div className="w-full flex justify-center text-[20px] mt-10">Chưa có đơn đăng ký nào!</div>
                        )}
                    </AnimatePresence>
                )
            }

            {isHeathCheckout && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <HealthCheckForm currentDonor =  {currentDonor} handleCancle={() => setIsHealthCheckout(false)} />
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    )
}

export default DonorReceiptList
