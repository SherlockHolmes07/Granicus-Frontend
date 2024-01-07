import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: null,
        userId: null
    });

    useEffect(() => {
        const bootstrapAsync = async () => {
            let userToken;
            let userId;
            try {
                userToken = await SecureStore.getItemAsync('token');
                userId = await SecureStore.getItemAsync('userId');
                console.log("Token read successfully", userToken);
            } catch (e) {
                console.log("Token read failed", e);
            }
            setAuthState({ token: userToken, userId: userId });
        };
    
        bootstrapAsync();
    }, []);

    const callOTP = async (mobileNumber) => {
        console.log(mobileNumber);
        // Call your API here
        try {
            const response = await fetch('http://192.168.29.12:3000/auth/sendOTP', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber: mobileNumber }),
            });

            console.log(response);
        
            if (!response.ok) {
                throw new Error('HTTP status ' + response.status);
            }
        
            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const login = async (props) => {
        // Call your API here
        try {
            const response = await fetch('http://192.168.29.12:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(props),
            });
            console.log(response);
            if (!response.ok) {
                // log detailed error
                const errorData = await response.json();
                console.error('Error data:', errorData);
                throw new Error('HTTP status ' + response.status);
            }
            const data = await response.json();
            console.log('Success:', data);
            setAuthState({ token: data.token, userId: data.userId });
            await SecureStore.setItemAsync('token', data.token);
            await SecureStore.setItemAsync('userId', data.userId.toString()); // Store userId
        } catch (error) {
            console.log("error", error)
        }
    };

    const register = async (props) => {
        console.log("props",JSON.stringify(props));

        try {
            const response = await fetch('http://192.168.29.12:3000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(props),
            });

            console.log(response);
        
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error data:', errorData);            
                throw new Error('HTTP status ' + response.status);
            }
            const data = await response.json();
            console.log('Success:', data);
            setAuthState({ token: data.token, userId: data.userId });
            await SecureStore.setItemAsync('token', data.token);
            await SecureStore.setItemAsync('userId', data.userId.toString());
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const logout = async () => {
        // Clear the token from the state and secure storage
        setAuthState({ token: null, userId: null });
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('userId');
    };


    return (
        <AuthContext.Provider value={{ ...authState, login, register, logout, callOTP }}>
            {children}
        </AuthContext.Provider>
    );
};