import Events from "@/pages/DonationEvent/Events";
import Footer from "@/components/layout/Footer";
import BloodDonationNavbar from "@/components/layout/Navbar";

function EventPage() {
  return (
    <div className="overflow-x-hidden">
      <BloodDonationNavbar />
      <div className="mb-5 mt-[120px]">
        <Events />
      </div>
      <Footer />
    </div>
  );
}

export default EventPage;
