import apiUrl from '../utils/apiConfig'; 
import { getHeaders } from './headers';


// ______________ Get Car Models ____________
export const getCarModels = async () => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/car-models`, { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching car models:', error);
    throw error;
  }
};

// ______________ Get User Cars ____________
export const fetchUserCars = async () => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/user-cars/`, { headers });
    const data = await response.json();
    console.log("_____________________",data)

    return data;
  } catch (error) {
    console.error('Error fetching user cars:', error);
    throw error;
  }
};

// ______________ Get User Car Detail ____________
export const getUserCar = async (carUniqueKey) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/user-cars/${carUniqueKey}`, { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user car:', error);
    throw error;
  }
};

// ______________ Update User Car ____________
export const updateUserCar = async (carUniqueKey, newData,t) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/user-cars/${carUniqueKey}/`, {
      method: 'PUT',
      headers: {
        ...headers},
      body: JSON.stringify(newData),
    });

    const responseText = await response.text();
    if (!response.ok) {
      let errorMessage = t('addEditCarInfoSecondScreenStrings.errorInSavingCar');
      try {
        const errorData = JSON.parse(responseText);
        let detail = errorData.detail;
        if (detail) {
          errorMessage = detail["mileage_info"][0].msg;
        }
      } catch (parseError) {}
      throw new Error(errorMessage);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    throw error;
  }
};

// ______________ Create User Car ____________
export const createUserCar = async (newData, t) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/user-cars/new/`, {
      method: 'POST',
      headers: {
        ...headers
      },
      body: JSON.stringify(newData),
    });

    const responseText = await response.text();
    if (!response.ok) {
      let errorMessage = t("addEditCarInfoSecondScreenStrings.errorInSavingCar");
      console.log("_____________", response);

      try {
        const errorData = JSON.parse(responseText);
        const detail = errorData.detail;
        console.log("_____________", detail);

        // Check if 'non_field_errors' exists
        if (detail && detail["non_field_errors"] && detail["non_field_errors"][0] && detail["non_field_errors"][0].msg) {
          errorMessage = detail["non_field_errors"][0].msg;
        }
        // Otherwise, check for 'mileage_info' error
        else if (detail && detail["mileage_info"] && detail["mileage_info"][0] && detail["mileage_info"][0].msg) {
          errorMessage = detail["mileage_info"][0].msg;
        }
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
      }

      throw new Error(errorMessage);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    throw error;
  }
};

// ______________ Delete User Car ____________
export const deleteUserCar = async (uniqueKey) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/user-cars/${uniqueKey}/`, {
      method: 'DELETE',
      headers: {
        ...headers
      },
    });
    if (response.status !== 204) {
      throw new Error('Network response was not ok');
    }
    return true;
  } catch (error) {
    throw error;
  }
};

// ______________ Get Notification List ____________
export const getNotificationlist = async () => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/notifications/`, { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// ______________ Get Custom Field List ____________
export const getCustomFieldList = async (carUniqueKey) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/custom-field/${carUniqueKey}`, { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching custom fields:', error);
    throw error;
  }
};

// ______________ Delete Custom Field ____________
export const deleteCustomFieldCar = async (carUniqueKey, id) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/custom-field/${carUniqueKey}/${id}/`, {
      method: 'DELETE',
      headers: {
        ...headers
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting custom field: ${response.status} ${response.statusText}`);
    }
    return true;
  } catch (error) {
    console.error('Error deleting custom field:', error);
    throw error;
  }
};

// ______________ Get Custom Field ____________
export const getCustomField = async (carUniqueKey, id) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/custom-field/${carUniqueKey}/${id}`, { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching custom field:', error);
    throw error;
  }
};

// ______________ Update Custom Field ____________
export const updateCustomField = async (uniqueKey, customFieldKey, customFieldData,t) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/custom-field/${uniqueKey}/${customFieldKey}/`, {
      method: 'PUT',
      headers: {
        ...headers
      },
      body: JSON.stringify(customFieldData),
    });

    const responseText = await response.text();
    if (!response.ok) {
      let errorMessage = t("customFieldScreenStrings.errorUpdatingCustomField");
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.detail && errorData.detail.non_field_errors && errorData.detail.non_field_errors.length > 0) {
          errorMessage = errorData.detail.non_field_errors[0].msg;
        } else {
          errorMessage = Object.values(errorData.detail)[0][0].msg;
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Error updating custom field:', error.message);
    throw error;
  }
};

// ______________ Create Custom Field ____________
export const createCustomField = async (uniqueKey, customFieldData,t) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/custom-field/${uniqueKey}/new/`, {
      method: 'POST',
      headers: {
        ...headers
      },
      body: JSON.stringify(customFieldData),
    });

    const responseText = await response.text();
    if (!response.ok) {
      let errorMessage = t("customFieldScreenStrings.errorDavingCustomField");
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.detail && errorData.detail.non_field_errors && errorData.detail.non_field_errors.length > 0) {
          errorMessage = errorData.detail.non_field_errors[0].msg;
        }
      } catch (parseError) {}
      throw new Error(errorMessage);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    throw error;
  }
};

// ______________ Get Car Mileage ____________
export const getCarMileage = async (carUniqueKey) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/mileage/${carUniqueKey}`, { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// ______________ Update Car Mileage ____________
export const updateCarMileage = async (carUniqueKey, newData) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${apiUrl}api/mileage/${carUniqueKey}/`, {
      method: 'POST',
      headers: {
        ...headers
      },
      body: JSON.stringify(newData),
    });

    const responseText = await response.text();
    if (!response.ok) {
      let errorMessage = t("carSetupScreenStrings.errorMessage");
      try {
        const errorData = JSON.parse(responseText);
        let detail = errorData.non_field_errors[0];
        if (detail) {
          errorMessage = detail;
        }
      } catch (parseError) {}
      throw new Error(errorMessage);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    throw error;
  }
};
