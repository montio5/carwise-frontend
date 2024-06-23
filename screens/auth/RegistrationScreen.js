// RegistrationScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { strings } from '../../utils/strings';

const RegistrationScreen = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  const navigation = useNavigation();

  const handleRegister = () => {
    if (!email || !password || !firstName || !lastName || password !== passwordRepeat) {
      Alert.alert(strings.registration.alertTitle, strings.registration.alertMessage);
      return;
    }

    fetch('https://carwise.pythonanywhere.com/user/register/', {
      method: 'POST',
      headers: {
        'Content-Type': strings.ContentType,
      },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
    })
      .then((response) => {
        if (response.ok) {
          Alert.alert(strings.registration.alertTitle, strings.registration.registrationSuccess);
          navigation.navigate('Login');
        } else {
          Alert.alert(strings.registration.alertTitle, strings.registration.registrationFailed);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Alert.alert(strings.registration.errorTitle, strings.registration.errorMessage);
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
        value={passwordRepeat}
        onChangeText={setPasswordRepeat}
        secureTextEntry
        style={styles.input}
      />
      <Button
        style={styles.button}
        title={strings.registration.registerButton}
        onPress={handleRegister}
      />
      <Pressable onPress={() => navigation.navigate('Login')}>
        <View style={{ flexDirection: 'row' }}>
          <Text>{strings.registration.haveAccount}</Text>
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
    margin: 20,
    fontSize: 20,
    backgroundColor: 'red',
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
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default RegistrationScreen;
