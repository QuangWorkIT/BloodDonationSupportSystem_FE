import LoadingSpinner from "@/components/layout/Spinner"
import { useAuth } from "@/hooks/authen/AuthContext"
import type { JSX } from "react"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
    element: JSX.Element
    allowRole?: string[]
}

function ProtectedRoute({ element, allowRole }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth()
    if (isLoading) {
        return (

            <div className="w-full h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    if (!user) return <Navigate to={'/login'} replace />

    if (!allowRole?.includes(user.role)) return <Navigate to={'/unauthorized'} replace />
    return element
}

export default ProtectedRoute
