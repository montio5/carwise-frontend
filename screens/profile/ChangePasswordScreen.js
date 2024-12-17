import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { changePassword } from '../../api/Authentication'; // Import the changePassword function
import { strings } from '../../utils/strings'; // Adjust the path as per your project structure
import CustomButton from '../../general/customButtonComponent';
import Toast from '../../general/Toast';
import {useTranslation} from 'react-i18next'

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const toastRef = useRef(null);
  const { t } = useTranslation();

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toastRef.current.error(t("profileString.newPasswordAndConfirmationError") || 'Error');
      return;
    }
    else if (!newPassword.trim()){
      toastRef.current.error(t("resetPasswordProcess.passwordRequired"));
      return;
    }
    else if (!currentPassword.trim()){
      toastRef.current.error(t("resetPasswordProcess.currentPasswordRequired"));
      return;
    }
    changePassword({
      current_password: currentPassword,
      new_password: newPassword,
      confirm_new_password: confirmPassword,
    })
      .then(() => {
        navigation.navigate('Setting', { toastMessage: strings.savedSuccessfully });
      })
      .catch((error) => {
        toastRef.current.error(
          error.message || strings.addEditCarInfoSecondScreenStrings.errorInSavingCar
        );
      });
  };

  return (
    <View style={styles.container}>
      <Toast ref={toastRef} />

      {/* Input fields in the center */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("profileString.oldPassword")}</Text>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder={t("profileString.oldPassword")}
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("profileString.newPassword")}</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder={t("profileString.newPassword")}
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("profileString.repeatNewPassword")}</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t("profileString.repeatNewPassword")}
            secureTextEntry
          />
        </View>
      </View>

      {/* Button stick to the bottom */}
      <CustomButton
        text={t("carSetupScreenStrings.updateButtonTitle")}
        onPress={handleChangePassword}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: '#24292F',
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center', // Center the input fields vertically
  },
  inputContainer: {
    marginBottom: 35,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    position: 'absolute',
    bottom: 20, // Adds spacing above the bottom edge
    left: 20,
    right: 20,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default ChangePasswordScreen;
