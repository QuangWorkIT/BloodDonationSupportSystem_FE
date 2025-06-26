import { useAuth } from "@/hooks/authen/AuthContext"
import { Navigate } from "react-router-dom"

export default function RoleBaseRedirect() {
    const {user} = useAuth()

    if(!user) return <Navigate to={'/home'} replace/>

    return user?.role === "Member" ? <Navigate to={'/home'} replace/>
     : user?.role === "Staff" ? <Navigate to={'/staff'} replace/>
     : <Navigate to={'/admin'} replace/>
}
