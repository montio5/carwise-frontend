import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { registerUser } from '../../api/Authentication';
import CustomButton from '../../general/customButtonComponent';
import Toast from '../../general/Toast';
import {useTranslation} from 'react-i18next'
import LanguageSwitcher from '../../general/LanguageSwitcher';
const RegistrationScreen = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [errors, setErrors] = useState({});
  const toastRef = useRef();
  const { t } = useTranslation();

  const navigation = useNavigation();

  const validate = () => {
    let valid = true;
    let errors = {};

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email.trim()) {
      errors.email = t("registration.emailRequired");
      valid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = t("registration.emailInvalid");
      valid = false;
    }

    if (!firstName.trim()) {
      errors.firstName = t("registration.firstNameRequired");
      valid = false;
    }

    if (!lastName.trim()) {
      errors.lastName = t("registration.lastNameRequired");
      valid = false;
    }

    if (!password.trim()) {
      errors.password = t("registration.passwordCanNotJustBeSpace");
      valid = false;
    }
    if (!password) {
      errors.password = t("registration.passwordRequired");
      valid = false;
    }

    if (password !== passwordRepeat) {
      errors.passwordRepeat = t("registration.passwordMismatch");
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validate()) {
      return;
    }

    try {
      const response = await registerUser({ email: email.trim(), password: password, first_name: firstName, last_name: lastName });
      navigation.navigate('Login', { toastMessage: t("savedSuccessfully") });
      toastRef.current.success(t("registration.registrationSuccess"));
    } catch (error) {
      const errorMessage = typeof error.message === 'string' ? error.message : t("carSetupScreenStrings.errorMessage");
      toastRef.current.error(errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        {/* <Text style={styles.title}>{t("registration.title}</Text> */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={t("registration.firstNamePlaceholder")}
            onChangeText={setFirstName}
            style={[styles.input, errors.firstName && styles.errorInput]}
          />
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={t("registration.lastNamePlaceholder")}
            onChangeText={setLastName}
            style={[styles.input, errors.lastName && styles.errorInput]}
          />
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={t("registration.emailPlaceholder")}
            value={email}
            onChangeText={setEmail}
            style={[styles.input, errors.email && styles.errorInput]}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={t("registration.passwordPlaceholder")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={[styles.input, errors.password && styles.errorInput]}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={t("registration.rePasswordPlaceholder")}
            value={passwordRepeat}
            onChangeText={setPasswordRepeat}
            secureTextEntry
            style={[styles.input, errors.passwordRepeat && styles.errorInput]}
          />
          {errors.passwordRepeat && <Text style={styles.errorText}>{errors.passwordRepeat}</Text>}
        </View>


        <CustomButton 
          text={t("registration.registerButton")}
          onPress={handleRegister}
        />

        <Pressable onPress={() => navigation.navigate('Login')} style={styles.loginLinkContainer}>
          <Text style={styles.loginText}>{t("registration.haveAccount")}</Text>
          <Text style={styles.link}>{t("registration.loginLink")}</Text>
        </Pressable>

      </View>
      <LanguageSwitcher/>

      <Toast ref={toastRef} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Ensure the ScrollView fills the space
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#24292F',
    padding: 20, // Optional padding for the ScrollView content
  },
  formContainer: {
    width: '90%',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    
  },
  inputContainer: {
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    backgroundColor:"white"

  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    position: 'absolute',
    right: 10,
    top: -18,
  },
  loginLinkContainer: {
    marginTop: 45,
    alignItems: 'center',
  },
  link: {
    color: '#1DFFA9',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
    loginText: {
    marginRight: 5,
    color:'white'

  },
});

export default RegistrationScreen;
