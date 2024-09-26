import apiUrl from '../utils/apiConfig'; 
import { strings } from '../utils/strings';
import { getHeaders, getPublicHeaders } from './headers';


// ______________ Logout ____________________
export const logout = async () => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}user/logout/`, {
      method: 'POST',
      headers,
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
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}user/profile/`, { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// ______________ Update User Profile ____________
export const updateUserProfile = async (newData) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}user/profile/`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(newData),
    });
    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(`Error updating profile: ${response.status} ${response.statusText}`);
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
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}user/change-password/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newData),
    });
    const responseText = await response.text();
    if (!response.ok) {
      const errorData = JSON.parse(responseText);
      let msg = errorData['current_password'][0];
      throw new Error(msg);
    }
    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

//______________ Login (no token required) ____________
export const login = async (email, password) => {
  try {
    const headers = await getPublicHeaders(); // No token for login
    const response = await fetch(`${apiUrl}api/token/`, {
      method: 'POST',
      headers,
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
      return { success: false, message: strings.login.alertMessage };
    }
  } catch (error) {
    return { success: false, message: strings.login.errorMessage };
  }
};

//______________ Register User (no token required) ____________
export const registerUser = async (newData) => {
  try {
    const headers = await getPublicHeaders(); // No token for registration
    const response = await fetch(`${apiUrl}user/register/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newData),
    });
    const responseText = await response.text();
    if (!response.ok) {
      const errorData = JSON.parse(responseText);
      let msg = errorData['detail']['email'][0]['msg'];
      throw new Error(msg);
    }
    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    throw error;
  }
};

//______________ Send FCM Token (token required) ____________
export const sendFCMTokenToServer = async (newData) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}user/fcm-token/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newData),
    });
    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(responseText);
    }
    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    throw error;
  }
};

// ______________ Forgot Password (no token required) ____________
export const callForgotPassword = async (newData) => {
  try {
    const headers = await getPublicHeaders(); // No token for forgot password
    const response = await fetch(`${apiUrl}user/forgot-password/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newData),
    });

    const responseText = await response.text();
    if (!response.ok) {
      const errorData = JSON.parse(responseText);
      let msg = errorData?.detail?.email?.[0]?.msg || strings.resetPasswordProcess.emailError;
      throw new Error(msg);
    }
    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Error in sending email:', error.message);
    throw error;
  }
};

// ______________ Verify Code (no token required) ____________
export const verifyCode = async (newData) => {
  try {
    const headers = await getPublicHeaders(); // No token for verify code
    const response = await fetch(`${apiUrl}user/verify-code/`, {
      method: 'POST',
      headers,
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
    console.error('Error verifying the code:', error);
    throw error;
  }
};

// ______________ Reset Password (no token required) ____________
export const resetPassword = async (newData) => {
  try {
    const headers = await getPublicHeaders(); // No token for reset password
    const response = await fetch(`${apiUrl}user/reset-password/`, {
      method: 'POST',
      headers,
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
    console.error('Error resetting password:', error);
    throw error;
  }
};
