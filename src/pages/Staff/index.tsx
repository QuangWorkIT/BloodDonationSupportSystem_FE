import { Outlet } from "react-router-dom"
import StaffNavbar from "./StaffNavbar"
import StaffSidebar from "./StaffSidebar"

function Staffhome() {
  return (
    <div>
      <StaffNavbar />
      <div className="flex">
        <StaffSidebar activeItem="" setActiveItem={() => {}} />
        <Outlet />
      </div>
    </div>
  )
}

export default Staffhome
