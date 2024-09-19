import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { varifyCode } from '../../api/Authentication';
import { strings } from '../../utils/strings';
import CustomButton from '../../general/customButtonComponent'; // Ensure this path is correct
import Toast from '../../general/Toast';  // Ensure this path is correct
import { useFocusEffect } from '@react-navigation/native';

const VerifyCodeScreen = ({ navigation, route }) => {
  const [code, setCode] = useState('');
  const textInputRef = useRef(null);
  const toastRef = useRef();

  // Check for toast message passed through navigation
  useFocusEffect(
    useCallback(() => {
      if (route.params?.toastMessage) {
        toastRef.current.success(route.params.toastMessage);
        route.params.toastMessage = null;  // Clear the message after showing it
      }
    }, [route.params])
  );

  // Validation and submission logic
  const handleVerify = async () => {
    // Check if code is empty
    if (!code) {
      toastRef.current.error(strings.resetPasswordProcess.emptyCodeError || "Code cannot be empty.");
      return;
    }

    // Check if code length is not 6 digits
    if (code.length !== 6) {
      toastRef.current.error(strings.resetPasswordProcess.codeError || "Code must be 6 digits.");
      return;
    }

    try {
      const response = await varifyCode({ code });
      // Navigate to ResetPassword on successful verification
      navigation.navigate('ResetPassword', { code, toastMessage: strings.resetPasswordProcess.emailSubmitSuccess });
    } catch (error) {
      toastRef.current.error(error.message);
    }
  };

  // Handle focus when tapping on the boxes
  const handlePress = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{strings.resetPasswordProcess.codePrompt}</Text>

      {/* Touchable to focus the hidden input */}
      <TouchableOpacity onPress={handlePress} style={styles.codeContainer} activeOpacity={1}>
        {
          // Display 6 boxes for the code
          [...Array(6)].map((_, index) => (
            <View key={index} style={styles.codeBox}>
              <Text style={styles.codeText}>{code[index] || ''}</Text>
            </View>
          ))
        }
      </TouchableOpacity>

      {/* Hidden TextInput to handle the actual input */}
      <TextInput
        ref={textInputRef}
        style={styles.hiddenInput}
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
        maxLength={6}
        autoFocus={true}
      />

      <CustomButton text="Verify Code" onPress={handleVerify} />
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
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  codeBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  codeText: {
    fontSize: 24,
    color: '#333',
  },
  hiddenInput: {
    position: 'absolute',
    width: 300, // Ensures the input is wide enough to handle all 6 digits
    height: 50,
    opacity: 0, // Fully transparent input but keeps it in the layout
    zIndex: 1, // Ensure it's above the other components
  },
});

export default VerifyCodeScreen;
