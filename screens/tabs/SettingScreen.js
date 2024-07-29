import React, { useEffect, useState, useCallback,useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { logout as apiLogout, getUserProfile } from '../../api/Authentication'; // Import the logout and getUserProfile functions
import { strings } from '../../utils/strings'; // Import the strings object
import Toast from '../../general/Toast'
import { AuthProvider, useAuth } from '../../general/AuthContext';


const SettingScreen = ({ navigation, route }) => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState();
  const toastRef = useRef(null);
  const { logout } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.refresh) {
        fetchData();
      }
      if (route.params?.toastMessage) {
        toastRef.current.success(route.params.toastMessage);
        route.params.toastMessage = null;
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
    navigation.navigate('EditProfile', { profile });
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleLogout = async () => {
    try {
      await apiLogout(); // Ensure this properly logs out the user on the server
      logout(); // Use the logout method from AuthContext
    } catch (error) {
      Alert.alert(strings.settingScreenStrings.logoutErrorTitle, strings.settingScreenStrings.logoutErrorMessage);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{strings.settingScreenStrings.loadingText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Toast ref={toastRef} />

      <View style={styles.profileContainer}>
        <Ionicons name="person-circle-outline" size={100} color="#007BFF" />
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={24} color="#fff" style={styles.icon} />
          <View style={styles.textWrapper}>
            <Text style={styles.buttonText}>{strings.settingScreenStrings.editProfileButton}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Ionicons name="lock-closed-outline" size={24} color="#fff" style={styles.icon} />
          <View style={styles.textWrapper}>
            <Text style={styles.buttonText}>{strings.settingScreenStrings.changePasswordButton}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" style={styles.icon} />
          <View style={styles.textWrapper}>
            <Text style={styles.buttonText}>{strings.settingScreenStrings.logoutButton}</Text>
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
