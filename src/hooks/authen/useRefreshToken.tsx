import authenApi from "@/lib/instance"

function useRefreshToken(): () => Promise<string | null> {

    const refresh = async (): Promise<string | null> => {
        try {
            const res = await authenApi.post('/api/refresh-token');
            if(res.data){
                console.log("Refresh token successfully", res.data);
                return res.data;
            } 
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
