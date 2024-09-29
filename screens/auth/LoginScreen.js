import React, { useState, useRef ,useCallback} from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { login as apiLogin } from '../../api/Authentication'; // Ensure this path is correct
import CustomButton from '../../general/customButtonComponent'; // Ensure this path is correct
import Toast from '../../general/Toast';  // Ensure this path is correct
import { useRoute,useFocusEffect } from '@react-navigation/native';
import { AuthProvider, useAuth } from '../../general/AuthContext';
import {useTranslation} from 'react-i18next'

const LoginScreen = ({ navigation, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toastRef = useRef();
  const route = useRoute();
  const { login } = useAuth();
  const { t } = useTranslation();
  
  useFocusEffect(
    useCallback(() => {
      if (route.params?.toastMessage) {
        toastRef.current.success(route.params.toastMessage);
        route.params.toastMessage=null;
      }
    }, [route.params])
  );
  
  const handleLogin = async () => {
    const result = await apiLogin(email, password,t);
    if (result.success) {
      login(result.accessToken);
    } else {
      toastRef.current.error(result.message || 'Error message');
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>{i18n.t('title')}</Text> */}
      <TextInput
        placeholder={t("login.emailPlaceholder")}
        value={email}
        onChangeText={(x)=>{setEmail(x)}}
        style={styles.input}
      />
      <TextInput
        placeholder={t("login.passwordPlaceholder")}
        value={password}
        onChangeText={(x)=>{setPassword(x)}}
        secureTextEntry
        style={styles.input}
      />
      <CustomButton
        text={t("login.loginButton")}
        onPress={handleLogin}
      />
      <Pressable onPress={() => navigation.navigate('Registration')}>
        <View style={styles.signupContainer}>
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>{t("login.noAccount")}</Text>
            <Text style={[styles.signupText, styles.signupLink]}>{t("login.signupLink")}</Text>
          </View>
          
          {/* Wrap the "Forgot Password" link inside a Pressable */}
          <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
            <View style={styles.forgotPasswordContainer}>
              <Text style={[styles.signupText, styles.signupLink]}>{t("login.forgotPasswordLink")}</Text>
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

  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color:'white'
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginVertical: 10,
    width: 300,
    borderRadius: 5,
    backgroundColor:'white'

  },
  signupContainer: {
    marginTop: 50,
    
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  signupText: {
    marginRight: 5,
    color:'white'

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