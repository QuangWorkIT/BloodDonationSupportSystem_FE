import axios from 'axios';

// this instance uses for calling api
const api = axios.create({
    baseURL: "https://blood-donation-support-system.somee.com/",
    timeout: 10000, // time out 10s
    headers: { 'Content-Type': 'Application/json' },
    // withCredentials: true, // send cookies
})

export const authenApi = axios.create({
    baseURL: "https://blood-donation-support-system.somee.com",
    timeout: 10000,
    headers: {
        'Authorization': localStorage.getItem('token')
    }
})

authenApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const geoApi = axios.create({
    baseURL: "https://api.geoapify.com/v1/geocode/search",
    timeout: 10000,
    headers: {}
})

export default api