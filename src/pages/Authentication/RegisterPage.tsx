import BloodDonationNavbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RegisterForm from "@/pages/Authentication/RegisterForm";
function RegisterPage() {
  return (
    <div className="min-h-screen relative">
      <div className="max-sm:hidden">
        <BloodDonationNavbar />
      </div>
      <div className="my-[50px]">
        <RegisterForm />
      </div>
      <div className="w-full max-sm:hidden">
        <Footer />
      </div>
    </div>
  );
}

export default RegisterPage;
