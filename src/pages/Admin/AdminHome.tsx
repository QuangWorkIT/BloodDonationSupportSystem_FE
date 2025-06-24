import { Outlet } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"

function AdminHome() {
  return (
    <div className="flex">
      <AdminSidebar activeItem="" setActiveItem={() => {}}/>
      <Outlet />
    </div>
  )
}

export default AdminHome
