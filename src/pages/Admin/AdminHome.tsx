import { Outlet } from "react-router-dom"

function AdminHome() {
  return (
    <div className="flex">
      <Outlet />
    </div>
  )
}

export default AdminHome
