import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../utils/apiConfig'; 
import { strings } from '../utils/strings';

// ______________ Get user cars ____________
export const fetchUserCars = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}api/user-cars/`, {
      headers: {
        Accept: strings.ContentType,
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user cars:', error);
    throw error;
  }
};

// ______________ Get user car ____________

export const getUserCar = async (carUniqueKey) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}api/user-cars/${carUniqueKey}`, {
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
// ______________ update user car ____________

export const updateUserCar = async (carUniqueKey, newData) => {
  try {
    console.log("-------in method", newData);
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(`${apiUrl}api/user-cars/${carUniqueKey}/`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json', // Ensure the Content-Type is set
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newData), // Stringify the request body
    });

    const responseText = await response.text(); // Get raw response text
    console.log('Raw response:', responseText);

    if (!response.ok) {
      // Handle non-2xx HTTP responses
      console.error('Error response from server:', responseText);
      throw new Error(`Error updating user car: ${response.status} ${response.statusText}`);
    }

    // Attempt to parse JSON only if response is OK
    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Error updating user car:', error);
    throw error;
  }
};

// ______________ create user car ____________

export const createUserCar = async (newData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}api/user-cars/new/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Ensure the Content-Type is set
        'Accept': strings.ContentType,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newData),
    });
    const responseText = await response.text(); // Get raw response text
    console.log('Raw response:', responseText);

    if (!response.ok) {
      // Handle non-2xx HTTP responses
      console.error('Error response from server:', responseText);
      throw new Error(`Error adding user car: ${response.status} ${response.statusText}`);
    }

    // Attempt to parse JSON only if response is OK
    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Error creating user car:', error);
    throw error;
  }
};

export const getCarModels = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response =await fetch(`${apiUrl}api/car-models`,{
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


export const deleteUserCar = async (uniqueKey) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}api/user-cars/${uniqueKey}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
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


// ______________ Get Notifications ____________

export const getNotifications = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}api/check-data/`, {
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