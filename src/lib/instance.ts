import axios from 'axios';

// this instance uses for authentication such as: login, register, update profile
export const authApi = axios.create({
    baseURL: "",
    timeout: 5000,
    headers: {'Content-Type': 'Application/json'}
})