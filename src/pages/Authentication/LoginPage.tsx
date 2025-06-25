import LoginForm from "@/pages/Authentication/LoginForm";
import BloodDonationNavbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function LoginPage() {
  return (
    <div className="relative min-h-screen">
      <div className="max-sm:hidden">
        <BloodDonationNavbar />
      </div>
      <LoginForm />
      <div className="absolute bottom-0 w-full max-sm:hidden">
        <Footer />
      </div>
    </div>
  );
}

export default LoginPage;
