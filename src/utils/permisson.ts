import type { Role, User } from "@/types/User"
import { decodeJwt } from "./jwt"

// get user by token
export const getUser = (token: string): User | null => {
    try {
        // decode token to get payload
        const decoded = decodeJwt(token)
        if (!decoded) return null

        return {
            id: decoded.UserId,
            unique_name: decoded.unique_name,
            role: decoded.role as Role
        }
    } catch (error) {
        console.log("Error fetching user", error);
        return null
    }
}