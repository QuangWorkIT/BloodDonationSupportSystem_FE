import { useEffect } from 'react'
import BloodInformation from './BloodInformation'
import BloodDonationNavbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

function BloodInfoPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="overflow-x-hidden">
      <BloodDonationNavbar />
      <div className="mt-[120px]">
        <BloodInformation />
      </div>
      <Footer />
    </div>
  )
}

export default BloodInfoPage
