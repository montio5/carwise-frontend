import { AsyncStorage } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';

import i18n from './utils/i18n'; // Import i18n from i18n.js

// Async function to set language from AsyncStorage

const setLanguageFromStorage = async () => {
  const language = await AsyncStorage.getItem('language');
  if (language) {
    i18n.changeLanguage(language);
  }
};
const Stack = createStackNavigator();

const App = () => {
  React.useEffect(() => {
    setLanguageFromStorage();
  }, []);
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
