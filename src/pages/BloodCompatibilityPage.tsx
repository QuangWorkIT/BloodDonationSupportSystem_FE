import BloodCompatibilityForm from "@/components/layout/BloodCompatibility";
import Footer from "@/components/layout/Footer";
import BloodDonationNavbar from "@/components/layout/Navbar";

export default function BloodCompatibilityPage() {
  return (
    <div className="h-screen w-screen flex flex-col justify-between">
      <BloodDonationNavbar />
      <BloodCompatibilityForm />
      <Footer />
    </div>
  );
}
