import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { isTokenExpired } from "@/utils/jwt"
import useRefreshToken from "./useRefreshToken";
import type { User } from "@/types/User";
import { getUser } from "@/utils/permisson";

interface AuthContextType {
    accessToken: string | null,
    setToken: (token: string | null) => void,
    user: User | null
    setUser: (user: User | null) => void
}

interface AuthProviderProps {
    children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider = ({ children }: AuthProviderProps) => {

    // no user and access token when no login as default
    const [accessToken, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const refresh = useRefreshToken()
    // fetch token
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem("token");
            if (!storedToken) return;

            const validToken = isTokenExpired(storedToken)
                ? await refresh()
                : storedToken;

            setToken(validToken);

            if (validToken !== null) {
                const user = getUser(validToken);
                setUser(user);
            } else {
                console.log("Token is wrong!")
            }
        };

        initAuth();
    }, []);

    // store token
    useEffect(() => {
        if (accessToken) localStorage.setItem("token", accessToken)
        else localStorage.removeItem("token")
    }, [accessToken])


    return (
        <AuthContext.Provider value={{ accessToken, setToken, user, setUser }} >
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