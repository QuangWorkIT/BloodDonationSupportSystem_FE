import axios from 'axios';

// this instance uses for authentication such as: login, register, update profile
const api = axios.create({
    baseURL: "https://blood-donation-support-system.somee.com/",
    timeout: 5000, // time out 5s
    headers: { 'Content-Type': 'Application/json' },
    withCredentials: true, // send cookies
})

export default api