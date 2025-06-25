import type { User } from "@/types/User"
import api from "@/lib/instance"
interface DataResponse {
    user: User,
    token: string
}
function useRefreshToken(): () => Promise<string | null> {

    const refresh = async (): Promise<string | null> => {
        try {
            const res = await api.post('/api/refresh-token');
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
