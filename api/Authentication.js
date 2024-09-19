
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
      console.error('Error in logout:', error);
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
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
        'Accept': strings.ContentType,
        'Authorization': `Bearer ${token}`,
        'Accept-Language':'fa'
      },
      body: JSON.stringify(newData),
    });
    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Error updating custom field: ${response.status} ${response.statusText}`);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    throw error;
  }
};

// ______________ Change Password ____________


export const changePassword = async (newData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}user/change-password/`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Accept': strings.ContentType,
        'Authorization': `Bearer ${token}`,
        'Accept-Language':'fa'

      },
      body: JSON.stringify(newData),
    });
    const responseText = await response.text();

    if (!response.ok) {
      const errorData = JSON.parse(responseText);
      let msg = errorData['current_password'][0]
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
      const accessToken = data.access;
      if (accessToken) {
        return { success: true, accessToken };
      } else {
        return { success: false, message: strings.login.alertMessage };
      }
    } else {
      const errorData = await response.json();
      return { success: false, message: strings.login.alertMessage };
    }
  } catch (error) {
    return { success: false, message: strings.login.errorMessage };
  }
};

//______________ Register User ____________

export const registerUser = async (newData) => {
  try {
    const response = await fetch(`${apiUrl}user/register/`, {
      method: 'POST', 
      headers: {
        'Content-Type': strings.ContentType,
        'Accept': strings.ContentType,
        // 'Authorization': `Bearer ${token}`,
        'Accept-Language':'fa'

      },
      body: JSON.stringify(newData),
    });
    const responseText = await response.text();

    if (!response.ok) {
      const errorData = JSON.parse(responseText);
      let msg = errorData['detail']['email'][0]['msg']
      throw new Error(msg);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    throw error;
  }
};

//______________ Send FCM Token ____________

export const sendFCMTokenToServer  = async (newData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}user/fcm-token/`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Accept': strings.ContentType,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newData),
    });
    const responseText = await response.text();
    if (!response.ok) {
      const errorData = JSON.parse(responseText);
      let msg = errorData
      throw new Error(msg);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('error adding fcm token', error);
    throw error;
  }
};

// ______________ Forgot Password ____________


export const callForgotPassword = async (newData) => {
  try {
    const response = await fetch(`${apiUrl}user/forgot-password/`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Accept': strings.ContentType,
        'Accept-Language': 'fa'
      },
      body: JSON.stringify(newData),
    });
    
    const responseText = await response.text();

    if (!response.ok) {
      // Parse the responseText as JSON to access the data
      const errorData = JSON.parse(responseText);

      // Safely extract the error message
      let msg = errorData?.detail?.email?.[0]?.msg || strings.resetPasswordProcess.emailError;

      // Throw the extracted message as the error
      throw new Error(msg);
    }

    // If the request was successful, parse the response
    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Error in sending email:', error.message);
    throw error;
  }
};


// ______________ varify Code ____________


export const varifyCode = async (newData) => {
  try {
    const response = await fetch(`${apiUrl}user/varify-code/`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Accept': strings.ContentType,
        'Accept-Language':'fa'

      },
      body: JSON.stringify(newData),
    });
    const responseText = await response.text();

    if (!response.ok) {
      const errorData = JSON.parse(responseText);
      let msg = errorData?.detail?.code?.[0]?.msg || strings.resetPasswordProcess.codeError;
      throw new Error(msg);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Error varifing the code:', error);
    throw error;
  }
};

// ______________ Reset Password ____________


export const ResetPassword = async (newData) => {
  try {
    const response = await fetch(`${apiUrl}user/reset-password/`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Accept': strings.ContentType,
        'Accept-Language':'fa'

      },
      body: JSON.stringify(newData),
    });
    const responseText = await response.text();
    if (!response.ok) {
      const errorData = JSON.parse(responseText);
      let msg = errorData?.detail?.code?.[0]?.msg || strings.resetPasswordProcess.passwordError;
      throw new Error(msg);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Error in reseting password:', error);
    throw error;
  }
};