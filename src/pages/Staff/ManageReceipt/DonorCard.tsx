import maleIcon from '@/assets/images/male icon.png'
import { Button } from '@/components/ui/button'

export interface DonorCardProps {
    id: number,
    memberName: string,
    phone: string,
    type: string,
    eventTime: string,
    handleHeathCheckout: () => void
}

function DonorCard({  memberName, phone, type, eventTime, handleHeathCheckout }: DonorCardProps) {
    return (
        <div className='w-full rounded-[7px] shadow-md flex bg-white p-5 gap-10'>
            <div className="p-3 mx-auto my-auto">
                <img src={maleIcon} alt="member img" />
            </div>
            <div className="flex-1 flex flex-col gap-2">
                <div className="flex justify-between">
                    <p className='text-[23px] font-bold'>{memberName}</p>

                    <div className="rounded-full bg-[#7F5ED9] p-2 hover:cursor-pointer hover:scale-110 transition duration-150">
                        <svg
                            width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M3.09836 1.21451C3.33836 0.974484 3.62666 0.788232 3.94412 0.668112C4.26159 0.547992 4.60097 0.49675 4.93975 0.517786C5.27853 0.538821 5.60896 0.631653 5.90913 0.790122C6.2093 0.948592 6.47234 1.16908 6.6808 1.43695L9.1408 4.60085C9.593 5.18037 9.75251 5.93695 9.57397 6.64963L8.82324 9.65402C8.7842 9.80992 8.78619 9.97327 8.82901 10.1282C8.87184 10.2831 8.95405 10.4242 9.06763 10.5379L12.4393 13.9082C12.553 14.0218 12.6942 14.104 12.8491 14.1468C13.004 14.1896 13.1673 14.1916 13.3232 14.1526L16.3262 13.4018C16.6784 13.3139 17.046 13.3071 17.4012 13.3822C17.7564 13.4572 18.0899 13.6121 18.3764 13.835L21.5403 16.295C22.6774 17.1789 22.7828 18.8604 21.7642 19.8774L20.3447 21.297C19.3306 22.3111 17.813 22.7574 16.3979 22.2599C12.778 20.9858 9.49137 18.913 6.78178 16.1955C4.06369 13.486 1.99048 10.1994 0.715922 6.57939C0.218361 5.16427 0.664703 3.64671 1.67885 2.6311L3.09836 1.21305V1.21451Z" fill="black" />
                        </svg>
                    </div>
                </div>
                <p className='text-[#7D7D7F] text-[18px]'>Số điện thoại:<span className='text-black font-semibold'> {phone}</span></p>
                <p className='text-[#7D7D7F] text-[18px]'>Loại máu:<span className='text-black font-semibold'> {type}</span></p>
                <div className="flex justify-between">
                    <p className='text-[#7D7D7F] text-[18px]'>Lịch hẹn: <span className='text-black font-semibold'> {eventTime}</span></p>
                    <div className="flex gap-3">
                        <Button 
                        className='bg-[#C14B53] hover:cursor-pointer hover:bg-[#C14B53] hover:scale-110 font-semibold text-[16px] w-[100px] transition duration-150 '>
                            Từ chối
                        </Button>

                        <Button 
                        onClick={handleHeathCheckout}
                        className='bg-[#FFC107] hover:cursor-pointer hover:bg-[#FFC107] hover:scale-110 text-black font-bold text-[16px] w-[100px] transition duration-150 '>
                            Check-in
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DonorCard
