import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authToken, setAuthToken] = useState(null);

    //Load user data on app start
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            const token = await AsyncStorage.getItem('authToken');
            const type = await AsyncStorage.getItem('userType');

            if (userData && token) {
                setUser(JSON.parse(userData));
                setAuthToken(token);
                setUserType(type);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (userData, type) => {
        try {
            setIsLoading(true);
            const response = await api.post('/user/register', userData)
            console.log("Response object", response);
            const data = await response.data;
            console.log(data);
            if (data.success) {
                // Store user data
                // await AsyncStorage.setItem('user', JSON.stringify(data.user));
                // await AsyncStorage.setItem('authToken', data.token);
                await AsyncStorage.setItem('userType', type);

                // setUser(data.user);
                // setAuthToken(data.token);
                setUserType(type);

                return { success: true, data: data };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.response.data.message };
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (emailOrPhone, password) => {
        try {
            setIsLoading(true);

            // Replace with your actual API endpoint
            const response = await api.post('/user/login', { emailOrPhone, password })

            // console.log('Auth Login in response', response);

            const data = await response.data;
            console.log('Login data', data)

            if (data.success) {
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                await AsyncStorage.setItem('authToken', data.token);
                await AsyncStorage.setItem('userType', data.user.role);

                setUser(data.user);
                setAuthToken(data.token);
                setUserType(data.user.userType);

                return { success: true, data };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.response.data.message };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userType');

            setUser(null);
            setAuthToken(null);
            setUserType(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const sendOTP = async (phone) => {
        try {

            const response = await axios.post('/send-otp', { phone });
            console.log(response);
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Send OTP error:', error);
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        userType,
        authToken,
        isLoading,
        signUp,
        login,
        logout,
        sendOTP,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}