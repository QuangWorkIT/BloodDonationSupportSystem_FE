import BloodDonationNavbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UrgencyReceiptForm from "./UrgencyReceiptForm";

export default function UrgencyReceiptPage() {
  return (
    <div className="flex flex-col gap-[56px] bg-linear-to-b from-[#F24333] to-[#DEA2A4]">
      <BloodDonationNavbar />
      <UrgencyReceiptForm />
      <Footer />
    </div>
  );
}
