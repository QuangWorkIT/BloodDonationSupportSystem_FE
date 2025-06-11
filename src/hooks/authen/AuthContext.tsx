import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import type { User } from "@/types/User";

interface AuthContextType {
    user: User | null,
    accessToken: string,
    setUser: (user: User | null) => void,
    setToken: (token: string) => void
}

interface AuthProviderProps {
    children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider = ({ children }: AuthProviderProps) => {

    // no user and access token when no login as default
    const [user, setUser] = useState<User | null>(null)
    const [accessToken, setToken] = useState<string>('')

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);
    
    // store user and token in local storage
    useEffect(() => {
        if (accessToken) localStorage.setItem("token", accessToken)
        else localStorage.removeItem("token")
    }, [accessToken])


    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user))
        else localStorage.removeItem("user")
    }, [user])

    return (
        <AuthContext.Provider value={{ accessToken, user, setUser, setToken }} >
            {children}
        </AuthContext.Provider>
    )
}

// get user and access token (reset if needed)
export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) throw new Error("useAuth must be used within AuthProvider")
    return context
}


export default AuthProvider