import { geoApi } from '@/lib/instance';

type geoAddress = {
    longitude: number,
    latitude: number
}

const geoApiKey = import.meta.env.VITE_GEOCODING_ID
export const getLongLat = async (address: string): Promise<geoAddress | null> => {
    try {
        const response = await geoApi.get(``, {
            params: {
                text: address,
                apiKey: geoApiKey
            }
        })
        
        const data = response.data.features
        if(!data || data.length === 0)
            throw new Error("Invalid address")
        return {
            longitude: data[0].properties.lon,
            latitude: data[0].properties.lat
        }

    } catch (error) {
        console.log("Failed to get lat lng", error)
        return null
    }
}