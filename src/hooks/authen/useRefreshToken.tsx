import type { User } from "@/types/User"
import {authApi} from "@/lib/instance"
interface DataResponse {
    user: User,
    token: string
}
function useRefreshToken(): () => Promise<string | null> {

    const refresh = async (): Promise<string | null> => {
        try {
            const res = await authApi.post('/api/Auth/renew-token', null, {
                withCredentials: true, // send cookies
            });
            if(res.data)
                return res.data.token;
            else
                return null
        } catch (error) {
            console.log("Fail to refresh token", error);
            return null;
        }
    }

    return refresh // call this function when need refresh token
}

export default useRefreshToken
