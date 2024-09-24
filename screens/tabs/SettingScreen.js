import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { logout as apiLogout, getUserProfile } from '../../api/Authentication'; // Import the logout and getUserProfile functions
import { strings } from '../../utils/strings'; // Import the strings object
import Toast from '../../general/Toast';
import { useAuth } from '../../general/AuthContext';

const SettingScreen = ({ navigation, route }) => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Add state for refreshing
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
    setLoading(true); // Show loading while data is being fetched
    try {
      const profile = await getUserProfile();
      setProfile(profile);
      const { first_name, last_name, email } = profile;
      const name = first_name || last_name ? `${first_name} ${last_name}`.trim() : email;
      setUserName(name);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false); // Stop loading after data is fetched
    }
  };

  // Function to handle pull-to-refresh action
  const onRefresh = async () => {
    setRefreshing(true); // Show refreshing indicator
    await fetchData();
    setRefreshing(false); // Hide refreshing indicator after fetching data
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
    } catch (error) {
      Alert.alert(strings.settingScreenStrings.logoutErrorTitle, strings.settingScreenStrings.logoutErrorMessage);
    } finally {
      logout(); // Use the logout method from AuthContext
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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} // Center the content vertically
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } // Add RefreshControl here
      >
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#24292F',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'white',
  },
  buttonContainer: {
    width: '80%',
    alignSelf: 'center',
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
