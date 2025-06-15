import React from 'react'
import BloodInformation from './BloodInformation'
import BloodDonationNavbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

function BloodInfoPage() {
  return (
    <><BloodDonationNavbar />
    <BloodInformation />
    <Footer />
    </>
  )
}

export default BloodInfoPage
