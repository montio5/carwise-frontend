// SettingScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { logout } from '../../api/Authentication'; // Import the logout function

const SettingScreen = ({ navigation }) => {
  const userName = "John Doe"; // This should be fetched from your user data

  const handleEditProfile = () => {
    // Navigate to the Edit Profile screen
    navigation.navigate('EditProfile');
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Logged Out', 'You have been logged out.');
      // Optionally, navigate to the login screen or another screen
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handleChangePassword = () => {
    // Navigate to the Change Password screen
    navigation.navigate('ChangePassword');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Ionicons name="person-circle-outline" size={100} color="#007BFF" />
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
          <Ionicons name="notifications-outline" size={24} color="#fff" style={styles.icon} />
          <View style={styles.textWrapper}>
            <Text style={styles.buttonText}>Notification</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={24} color="#fff" style={styles.icon} />
          <View style={styles.textWrapper}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Ionicons name="lock-closed-outline" size={24} color="#fff" style={styles.icon} />
          <View style={styles.textWrapper}>
            <Text style={styles.buttonText}>Change Password</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" style={styles.icon} />
          <View style={styles.textWrapper}>
            <Text style={styles.buttonText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  textWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  icon: {
    width: 24,
  },
});

export default SettingScreen;
