import Events from "@/pages/DonationEvent/Events";
import Footer from "@/components/layout/Footer";
import BloodDonationNavbar from "@/components/layout/Navbar";

function EventPage() {
  return (
    <>
      <BloodDonationNavbar />
      <div className="my-[30px]">
        <Events />
      </div>
      <Footer />
    </>
  );
}

export default EventPage;
