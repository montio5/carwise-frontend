import AsyncStorage from '@react-native-async-storage/async-storage';
import { strings } from '../utils/strings'; // Make sure to import strings properly

// Helper function to get headers including language and token for authenticated requests
export const getHeaders = async () => {
  const language = await AsyncStorage.getItem('appLanguage') || 'fa'; 
  
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': strings.ContentType,
    'Authorization': `Bearer ${token}`,
    'Accept-Language': language,
  };
};

// Helper function to get headers only with language (no token) for unauthenticated requests
export const getPublicHeaders = async () => {
  const language = await AsyncStorage.getItem('appLanguage') || 'fa'; 
  return {
    'Content-Type': 'application/json',
    'Accept': strings.ContentType,
    'Accept-Language': language,
  };
};
