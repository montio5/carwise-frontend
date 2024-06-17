// LoginScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable, Alert } from 'react-native';
import apiUrl from '../../utils/apiConfig';
import { strings } from '../../utils/strings';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation, setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${apiUrl}api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': strings.login.contentType, // Use content type from strings
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.access;

        if (accessToken) {
          await AsyncStorage.setItem('token', accessToken);
          navigation.navigate('Home');
          setIsLoggedIn(true);
        } else {
          Alert.alert(strings.login.alertTitle, strings.login.alertMessage);
        }
      } else {
        Alert.alert(strings.login.alertTitle, strings.login.alertMessage);
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert(strings.login.errorTitle, strings.login.errorMessage);
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
