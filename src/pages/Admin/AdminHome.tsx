import { Outlet } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"

function AdminHome() {
  return (
    <div className="flex">
      <div className="w-[250px] min-h-screen">
        <AdminSidebar activeItem="" setActiveItem={() => { }} />
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminHome
