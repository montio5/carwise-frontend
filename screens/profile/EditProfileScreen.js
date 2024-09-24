// EditProfileScreen.js
import React, { useEffect, useState,useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import {updateUserProfile } from '../../api/Authentication'; // Import API functions
import { strings } from '../../utils/strings'; // Adjust the path as per your project structure
import CustomButton from '../../general/customButtonComponent'
import Toast from '../../general/Toast';

const EditProfileScreen = ({ route, navigation }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);
  const toastRef = useRef();

  const profile = route.params.profile;

  const fetchUserProfile = async () => {
    try {
      // const profile = await getUserProfile();
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
      updateUserProfile({ email, first_name: firstName, last_name: lastName })
    .then(() => {
      navigation.navigate('Setting', { refresh: true, toastMessage: strings.savedSuccessfully});
    })
    .catch((error) => {
      toastRef.current.error(strings.profileString.errorInUpdatingProfile );
    })
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{strings.loadingText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Toast ref={toastRef} />
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{strings.profileString.Email}</Text>
        <TextInput
          style={styles.input}
          value={email}
          editable={false} // Assuming email is not editable
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{strings.profileString.firstNamePlaceholder}</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{strings.profileString.lastNamePlaceholder}</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />
      </View>
      <CustomButton 
      text={strings.profileString.save}
      onPress={handleSaveProfile}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfileScreen;
