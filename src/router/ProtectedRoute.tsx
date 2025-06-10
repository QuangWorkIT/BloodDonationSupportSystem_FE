import { useAuth } from "@/authen/AuthContext"
import type { JSX } from "react"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
    element: JSX.Element
    allowRole: string[]
}

function ProtectedRoute({element, allowRole}: ProtectedRouteProps) {
    const {role} = useAuth()

    if(role === null) return <Navigate to={'/login'} replace />

    if(!allowRole.includes(role)) return <Navigate to={'/unauthorized'} replace />
    return element
}

export default ProtectedRoute
