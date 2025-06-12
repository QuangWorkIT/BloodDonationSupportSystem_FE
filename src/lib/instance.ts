import axios from 'axios';

// this instance uses for authentication such as: login, register, update profile
export const authApi = axios.create({
    baseURL: "https://blood-donation-support-system.somee.com/",
    timeout: 5000, // time out 5s
    headers: {'Content-Type': 'Application/json'}
})