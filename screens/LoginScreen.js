import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import apiUrl from '../utils/apiConfig'; // Import the apiUrl from apiConfig.js
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation(); // Initialize useTranslation hook

  const handleLogin = () => {
    // Call your login API using the apiUrl
    fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        // Handle login response
        console.log(data); // For example, you can log the response or set user state
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t('login.title')}</Text>
        <TextInput
          placeholder={t('login.emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder={t('login.passwordPlaceholder')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button title={t('login.loginButton')} onPress={handleLogin} />
        {/* Pressable to navigate to RegistrationScreen */}
        <Pressable onPress={() => navigation.navigate('Registration')}>
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>{t('login.noAccount')}</Text>
            {/* "Sign up here" link */}
            <Text style={[styles.signupText, styles.signupLink]}>{t('login.signupLink')}</Text>
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
