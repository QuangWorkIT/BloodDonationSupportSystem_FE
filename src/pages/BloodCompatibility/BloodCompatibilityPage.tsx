import Footer from "@/components/layout/Footer";
import BloodDonationNavbar from "@/components/layout/Navbar";
import BloodCompatibilityForm from "./BloodCompatibility";

export default function BloodCompatibilityPage() {
  return (
    <div className="h-screen w-screen flex flex-col justify-between">
      <BloodDonationNavbar />
      <BloodCompatibilityForm />
      <Footer />
    </div>
  );
}
