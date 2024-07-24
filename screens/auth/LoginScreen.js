import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { login } from '../../api/Authentication'; // Ensure this path is correct
import { strings } from '../../utils/strings'; // Ensure this path is correct
import CustomButton from '../../general/customButtonComponent'; // Ensure this path is correct
import Toast from '../../general/Toast';  // Ensure this path is correct

const LoginScreen = ({ navigation, setIsLoggedIn }) => {
  const [email, setEmail] = useState('mont@gmail.com');
  const [password, setPassword] = useState('1234test');
  const toastRef = useRef();

  const handleLogin = async () => {
    const result = await login(email, password);

    if (result.success) {
      navigation.navigate('Home');
      setIsLoggedIn(true);
    } else {
      toastRef.current.error(result.message || 'Error message');
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
      <CustomButton
        text={strings.login.loginButton}
        onPress={handleLogin}
      />
      <Pressable onPress={() => navigation.navigate('Registration')}>
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>{strings.login.noAccount}</Text>
          <Text style={[styles.signupText, styles.signupLink]}>{strings.login.signupLink}</Text>
        </View>
      </Pressable>
      <Toast ref={toastRef} />
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
