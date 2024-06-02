
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../utils/apiConfig'; 
import { strings } from '../utils/strings';

// ______________ Logout ____________________


export const logout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${apiUrl}user/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status !== 204) { // 204 No Content is a typical response for successful delete
        throw new Error('Network response was not ok');
      }
      return true; // logout was successful
    } catch (error) {
      console.error('Error deleting car:', error);
      throw error;
    }
  };

// ______________ Get User Profile ____________

export const getUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${apiUrl}user/profile/`, {
        headers: {
          Accept: strings.ContentType,
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user car:', error);
      throw error;
    }
  };

// ______________ Update Custom Field ____________

export const updateUserProfile = async (newData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}user/profile/`, {
      method: 'PUT', // Use 'PATCH' if you only want to update certain fields
      headers: {
        'Content-Type': 'application/json',
        'Accept': strings.ContentType,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newData),
    });
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      console.error('Error response from server:', responseText);
      throw new Error(`Error updating custom field: ${response.status} ${response.statusText}`);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Error updating custom field:', error);
    throw error;
  }
};

// ______________ Change Password ____________


export const changePassword = async (newData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}user/change-password/`, {
      method: 'PUT', // Use 'PATCH' if you only want to update certain fields
      headers: {
        'Content-Type': 'application/json',
        'Accept': strings.ContentType,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newData),
    });
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      console.error('Error response from server:', responseText);
      throw new Error(`Error updating custom field: ${response.status} ${response.statusText}`);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Error updating custom field:', error);
    throw error;
  }
};
