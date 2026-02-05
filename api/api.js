import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';


const api = axios.create({
    baseURL: "https://hunter-xpress-backend.vercel.app/api",
});

// Attach token automatically if logged in
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers.Accept = "application/json";
    return config;
});

export default api;
