import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const bootstrapAsync = async () => {
          let userToken;
    
          try {
            userToken = await SecureStore.getItemAsync('token');
            console.log("token read succesfully", userToken);
          } catch (e) {
            // Restoring token failed
            console.log("token read", e);
          }
    
          // After restoring token, we may need to validate it in production apps
          // validateToken(userToken);
          setToken(userToken);
        };
    
        bootstrapAsync();
    }, []);


    const callOTP = async (mobileNumber) => {
        // Call your API here
    }

    const login = async (username, password) => {
        // Call your API here
        // On success, store the token in the state and secure storage
        const token = 'your-token';
        setToken(token);
        await SecureStore.setItemAsync('token', token);
    };

    const register = async (username, password) => {
        // Call your API here
        // On success, store the token in the state and secure storage
        const token = 'your-token';
        setToken(token);
        await SecureStore.setItemAsync('token', token);
    };

    const logout = async () => {
        // Clear the token from the state and secure storage
        setToken(null);
        await SecureStore.deleteItemAsync('token');
    };

    return (
        <AuthContext.Provider value={{ token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};