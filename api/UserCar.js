import AsyncStorage from '@react-native-async-storage/async-storage';
import apiUrl from '../utils/apiConfig'; 
import { strings } from '../utils/strings';

// ______________ Get Car Models ____________

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

// ______________ Get User Cars ____________

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

// ______________ Get User Car ____________

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
// ______________ Update User Car ____________

export const updateUserCar = async (carUniqueKey, newData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    const response = await fetch(`${apiUrl}api/user-cars/${carUniqueKey}/`, {
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
      let errorMessage = strings.addEditCarInfoSecondScreenStrings.errorInSavingCar;
      try {
        const errorData = JSON.parse(responseText);
        let detail =errorData.detail
        if (detail) {
          errorMessage = detail["mileage_info"][0].msg;
        }
      } catch (parseError) {
      }
      throw new Error(errorMessage);
    }

    // Attempt to parse JSON only if response is OK
    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    throw error;
  }
};

// ______________ Create User Car ____________

export const createUserCar = async (newData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}api/user-cars/new/`, {
      method: 'POST',
      headers: {
        'Content-Type': strings.ContentType, // Ensure the Content-Type is set
        'Accept': strings.ContentType,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newData),
    });
    const responseText = await response.text(); // Get raw response text
    if (!response.ok) {

      // Handle non-2xx HTTP responses
        let errorMessage = strings.addEditCarInfoSecondScreenStrings.errorInSavingCar;
        try {
          const errorData = JSON.parse(responseText);
          let detail =errorData.detail
          if (detail) {
            errorMessage = detail["mileage_info"][0].msg;
          }
        } catch (parseError) {
        }
        throw new Error(errorMessage);
      
    }

    // Attempt to parse JSON only if response is OK
    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    throw error;
  }
};

// ______________ Delete User Car ____________

export const deleteUserCar = async (uniqueKey) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}api/user-cars/${uniqueKey}/`, {
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
    throw error;
  }
};

// ______________ Get Notification List ____________

export const getNotificationlist = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}api/notifications/`, {
      headers: {
        Accept: strings.ContentType,
        Authorization: `Bearer ${token}`,
        'Accept-Language':'fa'
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user car:', error);
    throw error;
  }
};

// ______________ Get Custom Field List ____________

export const getCustomFieldList = async (carUniqueKey) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}api/custom-field/${carUniqueKey}`, {
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

// ______________ Delete Custom Field ____________

export const deleteCustomFieldCar = async (carUniqueKey, id) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}api/custom-field/${carUniqueKey}/${id}/`, {
      method: 'DELETE',
      headers: {
        'Accept-Language' : "fa",
        Accept: strings.ContentType,
        Authorization: `Bearer ${token}`,
        'Content-Type': strings.ContentType,
      },
    });

    if (!response.ok) {
      // Handle non-2xx HTTP responses
      throw new Error(`Error deleting custom field: ${response.status} ${response.statusText}`);
    }
    // Deletion was successful
    return true;
  } catch (error) {
    console.error('Error deleting custom field:', error);
    throw error;
  }
};
// ______________ Get Custom Field ____________

export const getCustomField = async (carUniqueKey,id) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}api/custom-field/${carUniqueKey}/${id}`, {
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

export const updateCustomField = async (uniqueKey, customFieldKey, customFieldData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}api/custom-field/${uniqueKey}/${customFieldKey}/`, {
      method: 'PUT', // Use 'PATCH' if you only want to update certain fields
      headers: {
        'Content-Type': strings.ContentType,
        'Accept': strings.ContentType,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(customFieldData),
    });
    const responseText = await response.text();

    if (!response.ok) {
      // Attempt to parse the response text as JSON to extract the error message
      let errorMessage = strings.customFieldScreenStrings.errorUpdatingCustomField;
      try {
        const errorData = JSON.parse(responseText);

        if (errorData.detail && errorData.detail.non_field_errors && errorData.detail.non_field_errors.length > 0) {
          errorMessage = errorData.detail.non_field_errors[0].msg;
        }
        else{
          errorMessage = Object.values(errorData.detail)[0][0].msg;
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    // Attempt to parse JSON only if response is OK
    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Error updating custom field:', error.message);
    throw error;
  }
};
// ______________ Create Custom Field ____________

export const createCustomField = async (uniqueKey, customFieldData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}api/custom-field/${uniqueKey}/new/`, {
      method: 'POST',
      headers: {
        'Content-Type': strings.ContentType, // Ensure the Content-Type is set
        'Accept': strings.ContentType,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(customFieldData),
    });
    const responseText = await response.text(); // Get raw response text

    if (!response.ok) {
      // Attempt to parse the response text as JSON to extract the error message
      let errorMessage = strings.customFieldScreenStrings.errorDavingCustomField;
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.detail && errorData.detail.non_field_errors && errorData.detail.non_field_errors.length > 0) {
          errorMessage = errorData.detail.non_field_errors[0].msg;
        }
      } catch (parseError) {
      }
      throw new Error(errorMessage);
    }

    // Attempt to parse JSON only if response is OK
    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    throw error;
  }
};

// ______________ Get User Car ____________

export const getCarMileage = async (carUniqueKey) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${apiUrl}api/mileage/${carUniqueKey}`, {
      headers: {
        Accept: strings.ContentType,
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {    throw error;
  }
};

// ______________ Update User Car ____________

export const updateCarMileage = async (carUniqueKey, newData) => {

  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    const response = await fetch(`${apiUrl}api/mileage/${carUniqueKey}/`, {
      method: 'POST',
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
      let errorMessage = strings.carSetupScreenStrings.errorMessage;
      try {
        const errorData = JSON.parse(responseText);
        let detail =errorData
        if (detail) {
          errorMessage = detail["non_field_errors"][0];
        }
      } catch (parseError) {
      }
      throw new Error(errorMessage);
    }

    // Attempt to parse JSON only if response is OK
    const data = JSON.parse(responseText);

    return data;
  } catch (error) {
    throw error;
  }
};

// ______________ Get Notification  ____________

// export const getNotification = async () => {
//   try {
//     const token = await AsyncStorage.getItem('token');
//     const response = await fetch(`${apiUrl}api/notification`, {
//       headers: {
//         Accept: strings.ContentType,
//         Authorization: `Bearer ${token}`,
//         'Accept-Language':'fa'
//       },
//     });
//     const data = await response.json();
//           console.log("__________________________",response)
//     console.log("__________________________",data);
//     return data;
//   } catch (error) {
//     console.error('Error fetching user car:', error);
//     throw error;
//   }
// };