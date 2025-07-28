import type { Role, User } from "@/types/User"
import { decodeJwt } from "./jwt"
import { authenApi } from "@/lib/instance"
import { reverseGeoCode } from "./gecoding"

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

export const getUserByToken = async (token: string): Promise<User | null> => {
    try {
        const response = await authenApi.get('/api/users/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = response.data

        if (data.isSuccess) {
            const address = await reverseGeoCode(data.data.latitude, data.data.longitude)
            return {
                id: data.data?.id,
                unique_name: data.data?.name,
                phone: data.data?.phone,
                gender: data.data?.gender,
                gmail: data.data?.gmail,
                bloodType: data.data?.bloodType,
                dob: data.data?.dob && new Date(data.data?.dob),
                longitude: data.data?.longitude,
                latitude: data.data?.latitude,
                address: address,
                lastDonation: data.data?.lastDonation !== null ? new Date(data.data.lastDonation) : undefined,
                role: data.data?.role
            }
        } else {
            console.log('get profile unsuccess', data)
            return null
        }
    } catch (error) {
        console.log('Error fetching profile ', error)
        return null
    }
}