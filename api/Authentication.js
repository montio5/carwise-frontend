
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
      if (response.status !== 205) { // 204 No Content is a typical response for successful delete
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

// ______________ Update user profile ____________

export const updateUserProfile = async (newData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}user/profile/`, {
      method: 'PUT', // Use 'PATCH' if you only want to update certain fields
      headers: {
        'Content-Type': 'application/json',
        'Accept': strings.ContentType,
        'Authorization': `Bearer ${token}`,
        'Accept-Language':'fa'
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
      method: 'POST', // Use 'PATCH' if you only want to update certain fields
      headers: {
        'Content-Type': 'application/json',
        'Accept': strings.ContentType,
        'Authorization': `Bearer ${token}`,
        'Accept-Language':'fa'

      },
      body: JSON.stringify(newData),
    });
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      const errorData = JSON.parse(responseText);
      let msg = errorData['current_password'][0]
      console.error('Error response from server:', responseText);
      console.error('Error response from server:',msg);
      throw new Error(msg);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Error updating custom field:', error);
    throw error;
  }
};

//______________ Login ____________


export const login = async (email, password) => {
  try {
    console.log('Sending request to API');
    const response = await fetch(`${apiUrl}api/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': strings.ContentType,
        'Accept': strings.ContentType,
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', data);
      const accessToken = data.access;
      if (accessToken) {
        return { success: true, accessToken };
      } else {
        return { success: false, message: strings.login.alertMessage };
      }
    } else {
      const errorData = await response.json();
      console.error('Error response data:', errorData);
      return { success: false, message: strings.login.alertMessage };
    }
  } catch (error) {
    console.error('Error during login:', error);

    return { success: false, message: strings.login.errorMessage };
  }
};


export const registerUser = async (newData) => {
  try {
    const response = await fetch(`${apiUrl}user/register/`, {
      method: 'POST', // Use 'PATCH' if you only want to update certain fields
      headers: {
        'Content-Type': strings.ContentType,
        'Accept': strings.ContentType,
        // 'Authorization': `Bearer ${token}`,
        'Accept-Language':'fa'

      },
      body: JSON.stringify(newData),
    });
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      const errorData = JSON.parse(responseText);
      let msg = errorData['detail']['email'][0]['msg']
      console.error('Error response from server:', responseText);
      console.error('Error response from server:',msg);
      throw new Error(msg);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Error updating custom field:', error);
    throw error;
  }
};