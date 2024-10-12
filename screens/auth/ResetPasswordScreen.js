import React, { useState,useCallback,useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { resetPassword } from '../../api/Authentication';
import CustomButton from '../../general/customButtonComponent'; // Ensure this path is correct
import Toast from '../../general/Toast';  // Ensure this path is correct
import { useFocusEffect } from '@react-navigation/native';
import {useTranslation} from 'react-i18next'

const ResetPasswordScreen = ({ navigation,route }) => {
  const [code, setCode] =  useState(route.params.code);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const toastRef = useRef();
  const { t } = useTranslation();

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
        toastRef.current.error(t("resetPasswordProcess.passwordMismatchError"));
      return;
    }
    else if (!newPassword.trim()) {
        toastRef.current.error(t("resetPasswordProcess.passwordRequired"));
      return;
    }

    try {
      const response = await resetPassword({ code:code, new_password: newPassword , confirm_new_password: confirmPassword },t);
      navigation.navigate('Login' ,{toastMessage:t("resetPasswordProcess.passwordResetSuccess")});
    } catch (error) {
      toastRef.current.error(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{ t("resetPasswordProcess.newPasswordPrompt")}</Text>
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
      
                  <CustomButton text={t("resetPasswordProcess.resetPassword")}
                      onPress={handleResetPassword}/>
                                  <Toast ref={toastRef} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#24292F',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    color: 'white',
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
