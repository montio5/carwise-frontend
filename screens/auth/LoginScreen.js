import React, { useState, useRef ,useCallback} from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { login as apiLogin } from '../../api/Authentication'; // Ensure this path is correct
import { strings } from '../../utils/strings'; // Ensure this path is correct
import CustomButton from '../../general/customButtonComponent'; // Ensure this path is correct
import Toast from '../../general/Toast';  // Ensure this path is correct
import { useRoute,useFocusEffect } from '@react-navigation/native';
import { AuthProvider, useAuth } from '../../general/AuthContext';


const LoginScreen = ({ navigation, setIsLoggedIn }) => {
  const [email, setEmail] = useState('mont@gmail.com');
  const [password, setPassword] = useState('1234test');
  const toastRef = useRef();
  const route = useRoute();
  const { login } = useAuth();

  
  useFocusEffect(
    useCallback(() => {
      if (route.params?.toastMessage) {
        toastRef.current.success(route.params.toastMessage);
        route.params.toastMessage=null;
      }
    }, [route.params])
  );
  
  const handleLogin = async () => {
    const result = await apiLogin(email, password);
    if (result.success) {
      login(result.accessToken);
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
    borderRadius:5
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
