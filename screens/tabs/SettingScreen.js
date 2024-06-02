// SettingScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { logout, getUserProfile } from '../../api/Authentication'; // Import the logout and getUserProfile functions

const SettingScreen = ({ navigation, route }) => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.refresh) {
        fetchData();
      }
    }, [route.params])
  );

  const fetchData = async () => {
    try {
      const profile = await getUserProfile();
      setProfile(profile);
      const { first_name, last_name, email } = profile;
      const name = first_name || last_name ? `${first_name} ${last_name}`.trim() : email;
      setUserName(name);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { profile: profile });
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Logged Out', 'You have been logged out.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingScreen;
