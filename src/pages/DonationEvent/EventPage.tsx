import Events from "@/pages/DonationEvent/Events";
import Footer from "@/components/layout/Footer";
import BloodDonationNavbar from "@/components/layout/Navbar";

function EventPage() {
  return (
    <div className="overflow-x-hidden bg-gray-50">
      <BloodDonationNavbar />
      <div className="mb-5 mt-[120px]">
        <Events />
      </div>
      <Footer />
    </div>
  );
}

export default EventPage;
