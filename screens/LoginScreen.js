import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable,Alert } from 'react-native';
import apiUrl from '../utils/apiConfig'; // Import the apiUrl from apiConfig.js
import { strings } from '../utils/strings';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/token/fa`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Token data:', data); // Log the received data to inspect its structure
        const accessToken = data.access;
        console.log('Received access token:', accessToken); // Log the received access token to ensure it's not undefined
        if (accessToken) {
          navigation.navigate("Home");
          await AsyncStorage.setItem('token', accessToken);
          // Navigate to the next screen or do something else
          // For example, navigation.navigate('Home');
        } else {
          Alert.alert('Login failed', 'Access token not received from server');
        }
      } else {
        // Handle authentication failure
        Alert.alert('Login failed', 'Please check your credentials');
      }
    } catch (error) {
      // Handle other errors like network issues
      console.error('Error during login:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again later.');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.login.title}</Text>
      <TextInput
        placeholder={strings.login.emailPlaceholder}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder={strings.login.passwordPlaceholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title={strings.login.loginButton} onPress={handleLogin} />
      <Pressable onPress={() => navigation.navigate('Registration')}>
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>{strings.login.noAccount}</Text>
          <Text style={[styles.signupText, styles.signupLink]}>{strings.login.signupLink}</Text>
        </View>
      </Pressable>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginVertical: 10,
    width: 300,
  },
  signupContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    marginRight: 5,
  },
  signupLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
