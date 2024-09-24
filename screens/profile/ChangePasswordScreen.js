import React, { useState,useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { changePassword } from '../../api/Authentication'; // Import the changePassword function
import { strings } from '../../utils/strings'; // Adjust the path as per your project structure
import CustomButton from '../../general/customButtonComponent'
import Toast from '../../general/Toast';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const toastRef = useRef(null);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toastRef.current.error(strings.profileString.newPasswordAndConfirmationError || 'Error');
      return;
    }
    changePassword({current_password:currentPassword,new_password: newPassword,confirm_new_password:confirmPassword})
    .then(() => {
      navigation.navigate('Setting', { toastMessage: strings.savedSuccessfully});
    })
    .catch((error) => {
      toastRef.current.error(error.message || strings.addEditCarInfoSecondScreenStrings.errorInSavingCar );
    });
  };

  return (
    <View style={styles.container}>
      <Toast ref={toastRef} />
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{strings.profileString.oldPassword}</Text>
        <TextInput
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{strings.profileString.newPassword}</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{strings.profileString.repeatNewPassword}</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>
      <CustomButton
                text={strings.carSetupScreenStrings.updateButtonTitle}
                onPress={handleChangePassword}
                style={styles.button}

            />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#24292F',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
        color:'white'

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
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;
