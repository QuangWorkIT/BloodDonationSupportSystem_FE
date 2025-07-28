import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { isTokenExpired } from "@/utils/jwt"
import useRefreshToken from "./useRefreshToken";
import type { User } from "@/types/User";
import { getUserByToken } from "@/utils/permisson";

interface AuthContextType {
    accessToken: string | null,
    setToken: (token: string | null) => void,
    user: User | null
    setUser: (user: User | null) => void,
    isLoading: boolean,
    setIsLoading: (isLoading: boolean) => void
}

interface AuthProviderProps {
    children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider = ({ children }: AuthProviderProps) => {

    // no user and access token when no login as default
    const [accessToken, setToken] = useState<string | null>(localStorage.getItem('token'))
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const refresh = useRefreshToken()
    // fetch token
    useEffect(() => {
        const initAuth = async () => {

            if (!accessToken) {
                console.log('No token found', accessToken)
                setIsLoading(false)
                return
            };

            const validToken = isTokenExpired(accessToken)
                ? await refresh()
                : accessToken;

            setToken(validToken);
            if (validToken !== null) {
                const user = await getUserByToken(validToken);
                console.log("user ", user)
                setUser(user);
            } else {
                console.log("Token is wrong!")
            }

            setIsLoading(false)
        };

        initAuth();
    }, []);

    // store token
    useEffect(() => {
        if (accessToken) localStorage.setItem("token", accessToken)
        else localStorage.removeItem("token")
    }, [accessToken])


    return (
        <AuthContext.Provider value={{ accessToken, setToken, user, setUser, isLoading, setIsLoading }} >
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