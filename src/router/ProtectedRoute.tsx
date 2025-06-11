import { useAuth } from "@/hooks/authen/AuthContext"
import type { JSX } from "react"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
    element: JSX.Element
    allowRole?: string[]
}

function ProtectedRoute({element, allowRole}: ProtectedRouteProps) {
    // const {user} = useAuth()
    const user = {id:"1", role: "admin"}

    if(user === null) return <Navigate to={'/login'} replace />

    if(!allowRole?.includes(user.role)) return <Navigate to={'/unauthorized'} replace />
    return element
}

export default ProtectedRoute
