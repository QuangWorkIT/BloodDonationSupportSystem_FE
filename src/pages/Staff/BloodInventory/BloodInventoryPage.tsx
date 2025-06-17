import StaffNavbar from "../StaffNavbar";
import StaffSidebar from "../StaffSidebar";
import Inventory from "./Inventory";

export default function BloodInventoryPage() {
  return (
    <>
      <StaffNavbar />
      <div className="flex">
        <StaffSidebar activeItem="inventory" setActiveItem={() => {}} />
        <Inventory />
      </div>
    </>
  );
}
