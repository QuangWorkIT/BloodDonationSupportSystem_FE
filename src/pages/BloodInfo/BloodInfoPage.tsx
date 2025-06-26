import { useEffect } from 'react'
import BloodInformation from './BloodInformation'
import BloodDonationNavbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

function BloodInfoPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <BloodDonationNavbar />
      <BloodInformation />
      <Footer />
    </>
  )
}

export default BloodInfoPage
