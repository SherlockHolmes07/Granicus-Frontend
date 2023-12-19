// screens/LoginScreen.js

import React, { useState, useContext } from 'react';
import { View, TextInput, Button } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { StyleSheet } from 'react-native';

const LoginScreen = () => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = () => {
        // Mobile number validation
        const mobileNumberPattern = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        if (!mobileNumberPattern.test(mobileNumber)) {
            alert('Please enter a valid mobile number');
            return;
        }
        if (!password) {
            alert('Please enter your password');
            return;
        }
        login(mobileNumber, password);
    };

    return (
        <View style={styles.container}>
            <TextInput placeholder="Mobile Number" onChangeText={setMobileNumber} style={styles.input}/>
            <TextInput placeholder="Password" onChangeText={setPassword} secureTextEntry style={styles.input}/>
            <Button title="Login" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      paddingTop: 50,
    },
    input: {
      height: 40,
      marginHorizontal: 8,
      borderRadius: 5,
      marginBottom: 12,
      padding: 8,
      backgroundColor: '#fff',
      color: '#000',
    }
});
  

export default LoginScreen;