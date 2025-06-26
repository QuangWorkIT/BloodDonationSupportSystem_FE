import BloodDonationNavbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import RegisterForm from "@/pages/Authentication/RegisterForm"
function RegisterPage() {
  return (
    <div className="min-h-screen relative">
      <BloodDonationNavbar />
      <div className="my-[50px]">
        <RegisterForm />
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </div>
  )
}

export default RegisterPage
