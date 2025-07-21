import { Button } from '@/components/ui/button';
import { Phone, Check, X, ClipboardCheck, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import maleIcon from '@/assets/images/male icon.png';

export interface DonorCardProps {
    id: number;
    memberName: string;
    phone: string;
    dob: string;
    bloodType: string;
    eventTime: string;
    isApproved: boolean | null;
    handleHealthCheckout: () => void;
    setCurrentDonorId: (id: number) => void;
    setIsShowModal: (isShow:boolean) => void;
}

function DonorCard({ id, memberName, phone, dob, bloodType, isApproved, handleHealthCheckout, setCurrentDonorId, setIsShowModal }: DonorCardProps) {
    
    const getStatus = () => {
        if (isApproved === true) {
            return <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Đã duyệt</span>;
        }
        if (isApproved === false) {
            return <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Đã từ chối</span>;
        }
        return <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">Chờ duyệt</span>;
    };

    return (
        <motion.div 
            className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full cursor-pointer max-w-xs'
            whileHover={{ y: -5 }}
        >
            <div className="p-5 flex-grow">
                    <div className="flex items-center gap-4">
                        <img src={maleIcon} alt="avatar" className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className='text-lg font-bold text-gray-800'>{memberName}</p>
                            {getStatus()}
            </div>
                        <p className='text-sm text-gray-500 mt-0.5'>
                            Loại máu: <span className='font-semibold text-[#C14B53]'>{bloodType}</span>
                        </p>
                    </div>
                </div>
                <div className="mt-3 space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-blue-500" />
                        <a
                            href={`tel:${phone}`}
                            className="font-semibold text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-150"
                            title={`Gọi cho ${memberName}`}
                        >
                            {phone}
                        </a>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Ngày sinh: {dob}</span>
                    </div>
                </div>
            </div>
            
            <div className="bg-gray-50/70 p-3 flex gap-2 flex-wrap">
                {isApproved === null && (
                    <>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full cursor-pointer"
                            onClick={() => {
                                setIsShowModal(true);
                                setCurrentDonorId(id);
                            }}
                        >
                            <X className="h-4 w-4 mr-1.5" />
                            Từ chối
                        </Button>
                        <Button 
                            size="sm" 
                            className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
                            onClick={handleHealthCheckout}
                        >
                            <Check className="h-4 w-4 mr-1.5" />
                            Check-in
                        </Button>
                    </>
                )}
                 {isApproved === true && (
                     <Button variant="outline" size="sm" className="w-full text-green-600 border-green-200 bg-green-50 cursor-pointer" disabled>
                        <ClipboardCheck className="h-4 w-4 mr-1.5"/>
                        Đã check-in
                    </Button>
                )}
        </div>
        </motion.div>
    )
}

export default DonorCard;
