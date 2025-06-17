import StaffNavbar from "../StaffNavbar";
import StaffSidebar from "../StaffSidebar";
import EventList from "./EventList";

export default function StaffManageReceiptPage() {
  return (
    <>
      <StaffNavbar />
      <div className="flex">
        <StaffSidebar activeItem="donation-management" setActiveItem={() => {}} />
        <EventList />
      </div>
    </>
  );
}
