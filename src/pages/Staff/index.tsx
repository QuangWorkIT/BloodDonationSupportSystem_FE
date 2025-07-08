import { Outlet } from "react-router-dom"
import StaffNavbar from "./StaffNavbar"
import StaffSidebar from "./StaffSidebar"

function Staffhome() {
  return (
    <div>
      <StaffNavbar />
      <div className="flex">
        <div className="w-[250px] min-h-screen">
          <StaffSidebar activeItem="" setActiveItem={() => { }} />
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default Staffhome
