import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../utils/apiConfig'; 
import { strings } from '../utils/strings';

// ______________ Get Car Setup ____________

export const getCarSetup = async (carUniqueKey) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${apiUrl}api/custom-setup/${carUniqueKey}`, {
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
  
// ______________ Get Car Dashboard ____________

export const getCarDashboard = async (carUniqueKey) => {
  try {

    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }    
    const response = await fetch(`${apiUrl}api/car-dashboard/${carUniqueKey}`, {
      headers: {
        "Accept": "application/json",
        'Content-Type': "application/json", // Ensure the Content-Type is set
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      console.log("--------------------",response)

      throw new Error('Network response was not ok' + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching car dashboard data:', error);
    throw error;
  }
};

  // ______________ Update Car Setup ____________
  
  export const updateCarSetup = async (carUniqueKey, newData) => {
  
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await fetch(`${apiUrl}api/custom-setup/${carUniqueKey}/`, {
        method: 'PUT',
        headers: {
          'Accept': strings.ContentType,
          'Content-Type': strings.ContentType, // Ensure the Content-Type is set
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newData), // Stringify the request body
      });
  
      const responseText = await response.text(); // Get raw response text
  
      if (!response.ok) {
        // Handle non-2xx HTTP responses
        throw new Error(`Error updating user car: ${response.status} ${response.statusText}`);
      }
  
      // Attempt to parse JSON only if response is OK
      const data = JSON.parse(responseText);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // ______________ Delete Car Setup ____________

export const deleteCarSetup = async (uniqueKey) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${apiUrl}api/custom-setup/${uniqueKey}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': strings.ContentType,
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status !== 204) { // 204 No Content is a typical response for successful delete
        throw new Error('Network response was not ok');
      }
      return true; // Deletion was successful
    } catch (error) {
      console.error('Error deleting car:', error);
      throw error;
    }
  };