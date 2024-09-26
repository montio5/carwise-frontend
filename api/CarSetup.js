import apiUrl from '../utils/apiConfig'; 
import { strings } from '../utils/strings';
import { getHeaders } from './headers';


// ______________ Get Car Setup ____________
export const getCarSetup = async (carUniqueKey) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/custom-setup/${carUniqueKey}`, {
      headers,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching car setup:', error);
    throw error;
  }
};

// ______________ Get Car Dashboard ____________
export const getCarDashboard = async (carUniqueKey) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/car-dashboard/${carUniqueKey}`, {
      headers: {
        ...headers,
        'Content-Type': 'application/json', // Ensure the Content-Type is set
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching car dashboard:', error);
    throw error;
  }
};

// ______________ Update Car Setup ____________
export const updateCarSetup = async (carUniqueKey, newData) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/custom-setup/${carUniqueKey}/`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': strings.ContentType, // Ensure the Content-Type is set
      },
      body: JSON.stringify(newData), // Stringify the request body
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Error updating user car: ${response.status} ${response.statusText}`);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    throw error;
  }
};

// ______________ Delete Car Setup ____________
export const deleteCarSetup = async (uniqueKey) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/custom-setup/${uniqueKey}/`, {
      method: 'DELETE',
      headers: {
        ...headers,
        'Content-Type': strings.ContentType,
      },
    });

    if (response.status !== 204) { // 204 No Content is a typical response for successful delete
      throw new Error('Network response was not ok');
    }

    return true; // Deletion was successful
  } catch (error) {
    console.error('Error deleting car setup:', error);
    throw error;
  }
};
