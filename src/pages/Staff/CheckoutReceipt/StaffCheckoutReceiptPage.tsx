import BloodDonationNavbar from "@/components/layout/Navbar";
import StaffCheckoutReceiptForm from "./StaffCheckoutReceiptForm";
import Footer from "@/components/layout/Footer";

export default function StaffCheckoutReceiptPage() {
  return (
    <div className="flex flex-col gap-[56px] bg-linear-to-b from-[#F24333] to-[#DEA2A4]">
      <BloodDonationNavbar />
      <StaffCheckoutReceiptForm />
      <Footer />
    </div>
  );
}
