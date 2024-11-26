import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import { login as apiLogin } from '../../api/Authentication'; // Ensure this path is correct
import CustomButton from '../../general/customButtonComponent'; // Ensure this path is correct
import Toast from '../../general/Toast'; // Ensure this path is correct
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../general/AuthContext';
import { useTranslation } from 'react-i18next';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toastRef = useRef();
  const route = useRoute();
  const { login } = useAuth();
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      if (route.params?.toastMessage) {
        toastRef.current.success(route.params.toastMessage);
        route.params.toastMessage = null; // Reset the message
      }
    }, [route.params?.toastMessage]) // Depend only on the specific value
  );

  const handleLogin = async () => {
    const result = await apiLogin(email, password, t);
    if (result.success) {
      login(result.accessToken);
    } else {
      toastRef.current.error(result.message || 'Error message');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/Car-wise.png')}
        style={styles.logo}
      />
      
      {/* Email Field */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
          placeholder={t('login.emailPlaceholder')}
          placeholderTextColor="#888"
          value={email}
          onChangeText={(x) => setEmail(x)}
          style={styles.input}
        />
      </View>

      {/* Password Field */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
          placeholder={t('login.passwordPlaceholder')}
          placeholderTextColor="#888"
          value={password}
          onChangeText={(x) => setPassword(x)}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <CustomButton
        text={t('login.loginButton')}
        onPress={handleLogin}
        style={styles.button}
      />
      
      <Pressable onPress={() => navigation.navigate('Registration')}>
        <View style={styles.signupContainer}>
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>{t('login.noAccount')}</Text>
            <Text style={[styles.signupText, styles.signupLink]}>
              {t('login.signupLink')}
            </Text>
          </View>

          <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
            <View style={styles.forgotPasswordContainer}>
              <Text style={[styles.signupText, styles.signupLink]}>
                {t('login.forgotPasswordLink')}
              </Text>
            </View>
          </Pressable>
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
    backgroundColor: '#24292F',
    paddingHorizontal: 20,
  },
  logo: {
    width: 270,
    height: 250,
    marginBottom: 30,
    resizeMode: 'contain', // Ensures the SVG scales properly
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#3a3a42',
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 10,
    width: '80%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
  },
  button: {
    width: '80%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  signupContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    marginRight: 5,
    color: 'white',
  },
  signupLink: {
    color: '#1DFFA9',
    textDecorationLine: 'underline',
  },
  forgotPasswordContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default LoginScreen;
