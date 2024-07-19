import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { changePassword } from '../../api/Authentication'; // Import the changePassword function
import { strings } from '../../utils/strings'; // Adjust the path as per your project structure
import CustomButton from '../../general/customButtonComponent'

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirmation password do not match.');
      return;
    }

    try {
      await changePassword({currentPassword, newPassword,confirmPassword});
      Alert.alert('Password Changed', 'Your password has been changed successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{strings.profileString.changePassword}</Text>
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
            />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
