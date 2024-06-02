
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../utils/apiConfig'; 

  // ______________ Delete Car Setup ____________

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