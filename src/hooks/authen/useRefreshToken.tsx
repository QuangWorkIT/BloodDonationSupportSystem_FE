import { useAuth } from "./AuthContext"
import type { User } from "@/types/User"

interface DataResponse {
    user: User,
    token: string
}
function useRefreshToken(): () => Promise<string | null> {
    const { setUser, setToken } = useAuth()

    const refresh = async (): Promise<string | null> => {
        try {
            // call refresh api
            const res = await fetch("api/auth/refresh", {
                method: "Post",
                credentials: "include"
            })
            if (res.ok) {
                const data: DataResponse = await res.json()
                setToken(data.token)
                setUser(data.user)
                return data.token
            } else {
                console.log("refresh fail")
                setToken('')
                setUser(null)
                return null
            }
        } catch (error) {
            console.log("Error refreshing token", error)
            setToken('')
            setUser(null)
            return null
        }
    }

    return refresh // call this function when need refresh token
}

export default useRefreshToken
