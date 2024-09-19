import React, { useState,useCallback,useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { ResetPassword } from '../../api/Authentication';
import { strings } from '../../utils/strings';
import CustomButton from '../../general/customButtonComponent'; // Ensure this path is correct
import Toast from '../../general/Toast';  // Ensure this path is correct
import { useFocusEffect } from '@react-navigation/native';

const ResetPasswordScreen = ({ navigation,route }) => {
  const [code, setCode] =  useState(route.params.code);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const toastRef = useRef();

    useFocusEffect(
    useCallback(() => {
      if (route.params?.toastMessage) {
        toastRef.current.success(route.params.toastMessage);
        route.params.toastMessage=null;
      }
    }, [route.params])
  );

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
        toastRef.current.error(strings.resetPasswordProcess.passwordMismatchError);
      return;
    }
    else if (!newPassword.trim()) {
        toastRef.current.error(strings.resetPasswordProcess.passwordRequired);
      return;
    }

    try {
      const response = await ResetPassword({ code:code, new_password: newPassword , confirm_new_password: confirmPassword });
      navigation.navigate('Login' ,{toastMessage:strings.resetPasswordProcess.passwordResetSuccess});
    } catch (error) {
      toastRef.current.error(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{ strings.resetPasswordProcess.newPasswordPrompt}</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
                  <CustomButton text="Reset Password"
                      onPress={handleResetPassword}/>
                                  <Toast ref={toastRef} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
});

export default ResetPasswordScreen;
