import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';


const api = axios.create({
    // baseURL: "https://hunterxpress-backend.onrender.com/api", 
    baseURL: "https://6728-102-88-113-142.ngrok-free.app/api", 
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers.Accept = "application/json";
    return config;
});

export default api;
