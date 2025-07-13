import { Outlet } from "react-router-dom"
import StaffNavbar from "./StaffNavbar"
import StaffSidebar from "./StaffSidebar"
import { useState } from "react"

function Staffhome() {
  const [activeItem, setActiveItem] = useState("inventory")
  return (
    <div>
      <StaffNavbar/>
      <div className="flex">
        <div className="w-[250px] min-h-screen">
          <StaffSidebar activeItem= {activeItem} setActiveItem={setActiveItem} />
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default Staffhome
