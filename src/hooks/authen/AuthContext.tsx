import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { isTokenExpired } from "@/utils/jwt"
import useRefreshToken from "./useRefreshToken";

interface AuthContextType {
    accessToken: string | null,
    setToken: (token: string | null) => void
}

interface AuthProviderProps {
    children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider = ({ children }: AuthProviderProps) => {

    // no user and access token when no login as default
    const [accessToken, setToken] = useState<string | null>(null)
    const refresh = useRefreshToken()

    useEffect(() => {

        // load access token from local storage
        const initAuth = async () => {
            const storedToken = localStorage.getItem("token");

            if (storedToken && isTokenExpired(storedToken)) {
                const newToken = await refresh()
                setToken(newToken)
            } else if (storedToken) {
                setToken(storedToken) // valid token
            }
        }
        
        initAuth()
    }, []);

    // store token
    useEffect(() => {
        if (accessToken) localStorage.setItem("token", accessToken)
        else localStorage.removeItem("token")
    }, [accessToken])


    return (
        <AuthContext.Provider value={{ accessToken, setToken }} >
            {children}
        </AuthContext.Provider>
    )
}

// get access token (reset if needed)
export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) throw new Error("useAuth must be used within AuthProvider")
    return context
}


export default AuthProvider