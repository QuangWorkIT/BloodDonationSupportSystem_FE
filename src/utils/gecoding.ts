import { geoApi } from '@/lib/instance';

type geoAddress = {
    longitude: number,
    latitude: number
}

const geoApiKey = import.meta.env.VITE_GEOCODING_ID
export const getLongLat = async (address: string): Promise<geoAddress | null> => {
    if (!address) return null
    console.log("getLongLat address ", address)
    try {
        const response = await geoApi.get(`https://api.geoapify.com/v1/geocode/search`, {
            params: {
                text: address,
                apiKey: geoApiKey
            }
        })

        const data = response.data.features
        console.log("getLongLat response", data)
        if (!data || data.length === 0)
            throw new Error("Invalid address")
        return {
            longitude: data?.[0]?.properties?.lon,
            latitude: data?.[0]?.properties?.lat
        }

    } catch (error) {
        console.log("Failed to get lat lng", error)
        return null
    }
}

export const reverseGeoCode = async (lat: number, lon: number): Promise<string> => {
    if (!lat || !lon) return ""
    console.log("reverseGeoCode lat, lon ", lat, lon)
    try {
        const response = await geoApi.get(`https://api.geoapify.com/v1/geocode/reverse`, {
            params: {
                lat: lat,
                lon: lon,
                format: 'json',
                apiKey: geoApiKey
            }
        })
        const data = response.data
        console.log("rever address ", data.results?.[0]?.formatted)
        return data.results?.[0]?.formatted
    } catch (error) {
        console.log("Failed to reverse geocode", error)
        return ""
    }
}