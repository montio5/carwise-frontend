import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { updateUserProfile } from '../../api/Authentication'; // Import API functions
import { strings } from '../../utils/strings'; // Adjust the path as per your project structure
import CustomButton from '../../general/customButtonComponent';
import Toast from '../../general/Toast';
import {useTranslation} from 'react-i18next'

const EditProfileScreen = ({ route, navigation }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);
  const toastRef = useRef();
  const { t } = useTranslation();

  const profile = route.params.profile;

  const fetchUserProfile = async () => {
    try {
      setEmail(profile.email);
      setFirstName(profile.first_name);
      setLastName(profile.last_name);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!firstName.trim()){
      toastRef.current.error(t("registration.firstNameRequired"));
      return;
    }
    else if (!lastName.trim()){
      toastRef.current.error(t("registration.lastNameRequired"));
      return;
    }

    updateUserProfile({ email, first_name: firstName, last_name: lastName })
      .then(() => {
        navigation.navigate('Setting', {
          refresh: true,
          toastMessage: strings.savedSuccessfully,
        });
      })
      .catch((error) => {
        toastRef.current.error(strings.profileString.errorInUpdatingProfile);
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{t("loadingText")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Toast ref={toastRef} />

      {/* Input fields in the center */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("profileString.Email")}</Text>
          <TextInput
            style={styles.input}
            value={email}
            editable={false} // Assuming email is not editable
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("profileString.firstNamePlaceholder")}</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("profileString.lastNamePlaceholder")}</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
      </View>

      {/* Button stick to the bottom */}
      <CustomButton
        text={t("profileString.save")}
        onPress={handleSaveProfile}
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
    bottom: 20, // You can adjust this value to give some space above the button
    left: 20,
    right: 20,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfileScreen;
