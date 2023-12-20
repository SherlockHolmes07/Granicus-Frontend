import React, { useState, useContext } from "react";
import { View, TextInput, Button, TouchableOpacity, Text } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { StyleSheet } from "react-native";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [displayOtp, setDisplayOtp] = useState(false);

  const { register, callOTP } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async () => {
    // Username validation
    if (!username) {
      alert("Please enter your username");
      return;
    }

    // Password validation
    if (!password) {
      alert("Please enter your password");
      return;
    }

    // Mobile number validation
    const mobileNumberPattern = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    if (!mobileNumberPattern.test(mobileNumber)) {
      alert("Please enter a valid mobile number");
      return;
    }

    // Email validation
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (email != "" && !emailPattern.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Display OTP field
    if (!displayOtp) {
      console.log(mobileNumber);
      callOTP(mobileNumber)
        .then(() => {
          setDisplayOtp(true);
        })
        .catch((error) => {
          console.error("Error calling OTP:", error);
        });
      setDisplayOtp(true);
      return;
    }

    // OTP validation
    const otpPattern = /^[0-9]{4}$/;
    if (!otpPattern.test(otp)) {
      alert("Please enter a valid OTP");
      return;
    }
    const data = { name: username, password, mobileNumber, otp };
    if (email) {
      data.email = email;
    }
    setIsLoading(true);
    await register(data);
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {!displayOtp && (
        <>
          <TextInput
            placeholder="Username"
            onChangeText={setUsername}
            style={styles.input}
            aria-hidden={displayOtp}
          />
          <TextInput
            placeholder="Mobile Number"
            onChangeText={setMobileNumber}
            style={styles.input}
            aria-hidden={displayOtp}
          />
          <TextInput
            placeholder="Email (optional)"
            onChangeText={setEmail}
            style={styles.input}
            aria-hidden={displayOtp}
          />
          <TextInput
            placeholder="Password"
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            aria-hidden={displayOtp}
          />
        </>
      )}

      {displayOtp && (
        <TextInput
          placeholder="Enter 4 Digit OTP"
          onChangeText={setOtp}
          style={styles.input}
        />
      )}

      <Button
        title={displayOtp ? "Submit OTP" : "Register"}
        onPress={handleSubmit}
        disabled={isLoading}
      />
      
      {!displayOtp && (
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      )}

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
    backgroundColor: "#fff",
    color: "#000",
  },
  loginLink: {
    color: '#007BFF',
    marginTop: 20,
    textAlign: 'center',
  },

});

export default RegisterScreen;
