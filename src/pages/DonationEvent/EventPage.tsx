import Events from "@/pages/DonationEvent/Events";
import Footer from "@/components/layout/Footer";
import BloodDonationNavbar from "@/components/layout/Navbar";

function EventPage() {
  return (
    <>
      <BloodDonationNavbar />
      <div className="mb-5">
        <Events />
      </div>
      <Footer />
    </>
  );
}

export default EventPage;
