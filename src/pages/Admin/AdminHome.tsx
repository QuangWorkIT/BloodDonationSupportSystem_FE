import { Outlet } from "react-router-dom"

import AdminNavbar from "./AdminNavbar";

function AdminHome() {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col overflow-x-hidden">
      <AdminNavbar />
      
        
        <main className="">
          <Outlet />
        </main>
      
    </div>
  )
}

export default AdminHome
