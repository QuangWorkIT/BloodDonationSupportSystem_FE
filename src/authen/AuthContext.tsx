import { createContext, useContext, useState, type ReactNode } from "react";

import type { Role } from "@/types/User";

interface AuthContextType {
    role: Role,
    setRole: (role:Role) => void;
}
interface AuthProviderProps {
    children: ReactNode
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider = ({children}: AuthProviderProps) => {
    const [role, setRole] = useState<Role | null>(null) // default: not logged in

    return (
        <AuthContext.Provider value={{role, setRole}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if(!context) throw new Error("useAuth must be used within AuthProvider")
    return context
}


export default AuthProvider