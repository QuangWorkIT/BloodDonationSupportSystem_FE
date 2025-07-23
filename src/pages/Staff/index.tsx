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
        <div className="w-[280px] min-h-screen pt-[125px]">
          <StaffSidebar activeItem= {activeItem} setActiveItem={setActiveItem} />
        </div>
        <main className="flex-1 p-8 pt-[125px]">
        <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Staffhome
