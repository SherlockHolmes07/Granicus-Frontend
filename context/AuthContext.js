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
            const token = data.token;
            setToken(token);
            await SecureStore.setItemAsync('token', token);    
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
            const token = data.token;
            setToken(token);
            await SecureStore.setItemAsync('token', token);
    
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const logout = async () => {
        // Clear the token from the state and secure storage
        setToken(null);
        await SecureStore.deleteItemAsync('token');
        
    };

    return (
        <AuthContext.Provider value={{ token, login, register, logout, callOTP }}>
            {children}
        </AuthContext.Provider>
    );
};