import StaffNavbar from "../StaffNavbar";
import StaffSidebar from "../StaffSidebar";
import EventList from "./EventList";

export default function StaffManageBloodCollectionPage() {
  return (
    <>
      <StaffNavbar />
      <div className="flex">
        <StaffSidebar activeItem="waiting-receive" setActiveItem={() => {}} />
        <EventList />
      </div>
    </>
  );
}
