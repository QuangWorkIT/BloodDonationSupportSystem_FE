import { geoApi } from '@/lib/instance';

type geoAddress = {
    longitude: number,
    latitude: number
}

type extractAddress = {
    province: string,
    district: string,
    address: string
}
const geoApiKey = import.meta.env.VITE_GEOCODING_ID
export const getLongLat = async (address: string): Promise<geoAddress | null> => {
    if (!address) return null
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
    console.log('long and lat ' + lon +" " + lat)
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
        const address = data.results?.[0]?.address_line1 || ""
        const suburb = data.results?.[0]?.suburb || ""
        const city = data.results?.[0]?.city || ""
        return address + "-" + suburb + "-" + city
    } catch (error) {
        console.log("Failed to reverse geocode", error)
        return ""
    }
}

export const extractAddress = (address: string): extractAddress | null=> {
    if(!address) return null
    const extract = address.split('-')
    return {
        address: extract[0].trim(),
        district: extract[1].trim(),
        province: extract[2].trim()
    }
}