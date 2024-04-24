import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { strings } from '../utils/strings';

const RegistrationScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Get navigation object

  const handleRegister = () => {
    // Your registration logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.registration.title}</Text>
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
      <Button title={strings.registration.registerButton} onPress={handleRegister} />
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signupText}>{strings.registration.loginLink}</Text>
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
});

export default RegistrationScreen;
