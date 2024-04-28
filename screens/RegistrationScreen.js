import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { strings } from '../utils/strings';

const RegistrationScreen = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  const navigation = useNavigation(); // Get navigation object

  const handleRegister = () => {
    // Validate form fields
    if (!email || !password || !firstName || !lastName || password !== passwordRepeat) {
      Alert.alert('Error', 'Please fill out all fields correctly.');
      return;
    }

    // Call your API
    fetch('https://carwise.pythonanywhere.com/user/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName
      })
    })
    .then(response => {
      if (response.ok) {
        // Registration successful, navigate to login screen or perform any other action
        Alert.alert('Ok', 'Registered');
      
        navigation.navigate('Login');
        
      } else {
        // Handle registration error
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.registration.title}</Text>
        <TextInput
          placeholder={strings.registration.firstNamePlaceholder}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder={strings.registration.lastNamePlaceholder}
          onChangeText={setLastName}
          style={styles.input}
        />
      <TextInput
        placeholder={strings.registration.emailPlaceholder}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder={strings.registration.passwordPlaceholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder={strings.registration.rePasswordPlaceholder}
        // value={password}
        onChangeText={setPasswordRepeat}
        secureTextEntry
        style={styles.input}
      />
      <Button 
      style={styles.button} 
      title={strings.registration.registerButton} 
      onPress={handleRegister} />
      <Pressable onPress={() => navigation.navigate('Login')}>
        <View style={{ flexDirection: 'row' }}>
          <Text >{strings.registration.haveAccount}</Text>
          <Text style={styles.link}>{strings.registration.loginLink}</Text>
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
  button: {
    margin:20,
    fontSize: 20,
    backgroundColor: "red"

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
  languageContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    marginRight: 10,
  },
  languageButton: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default RegistrationScreen;
