import BloodDonationNavbar from "@/components/layout/Navbar";
import StandardReceiptForm from "./StandardReceiptForm";
import Footer from "@/components/layout/Footer";

export default function StandardReceiptPage() {
  return (
    <div className="flex flex-col gap-[56px] bg-linear-to-b from-[#F24333] to-[#DEA2A4]">
      <BloodDonationNavbar />
      <StandardReceiptForm />
      <Footer />
    </div>
  );
}
