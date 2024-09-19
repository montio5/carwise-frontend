import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { callForgotPassword } from '../../api/Authentication';
import CustomButton from '../../general/customButtonComponent'; // Ensure this path is correct
import { strings } from '../../utils/strings';
import Toast from '../../general/Toast';  // Ensure this path is correct

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const toastRef = useRef();

  const isValidEmail = (email) => {
    // Regular expression to check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      // Check if the email field is empty
      toastRef.current.error(strings.resetPasswordProcess.emailRequired); // Ensure this string exists in your strings file
      return;
    }

    if (!isValidEmail(email)) {
      // Check if the email format is invalid
      toastRef.current.error(strings.resetPasswordProcess.emailInvalid); // Ensure this string exists in your strings file
      return;
    }

    try {
      // Proceed with the forgot password API call if the email is valid
      await callForgotPassword({ email });
      toastRef.current.success(strings.resetPasswordProcess.emailSubmitSuccess);
      navigation.navigate('VarifyCode', { toastMessage: strings.resetPasswordProcess.emailSubmitSuccess }); // Navigate to the VerifyCodeScreen
    } catch (error) {
        console.log("---------------",error)
      toastRef.current.error(error.message)//strings.resetPasswordProcess.emailError);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{strings.resetPasswordProcess.emailPrompt}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        textAlign="center" // Center align the text and placeholder
      />
      <CustomButton text={strings.carSetupScreenStrings.updateButtonTitle} onPress={handleSubmit} />
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
    textAlign: 'center', // Center align the label
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    textAlign: 'center', // Center align the input text and placeholder
  },
});

export default ForgotPasswordScreen;
