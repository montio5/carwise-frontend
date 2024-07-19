// EditProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getUserProfile, updateUserProfile } from '../../api/Authentication'; // Import API functions
import { strings } from '../../utils/strings'; // Adjust the path as per your project structure
 
const EditProfileScreen = ({ route, navigation }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);
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
    try {
      await updateUserProfile({ email, first_name: firstName, last_name: lastName });
      navigation.navigate('Setting', { refresh: true });
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
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
      <Text style={styles.header}>{strings.mainStack.EditProfile}</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>{strings.profileString.save}</Text>
      </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfileScreen;
