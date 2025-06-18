import StaffNavbar from "../StaffNavbar";
import StaffSidebar from "../StaffSidebar";
import EventList from "./EventList";

export default function StaffManageBloodAnalysisPage() {
  return (
    <>
      <StaffNavbar />
      <div className="flex">
        <StaffSidebar activeItem="waiting-analysis" setActiveItem={() => {}} />
        <EventList />
      </div>
    </>
  );
}
