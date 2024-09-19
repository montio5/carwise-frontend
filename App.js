import React, { useEffect,useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Alert,TouchableOpacity } from 'react-native';
import { deleteUserCar, deleteCustomFieldCar } from './api/UserCar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from './screens/auth/LoginScreen';
import RegistrationScreen from './screens/auth/RegistrationScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import VerifyCodeScreen from './screens/auth/VarifyCodeScreen';
import ResetPasswordScreen from './screens/auth/ResetPasswordScreen';

import SettingScreen from './screens/tabs/SettingScreen';
import NotificationScreen from './screens/tabs/NotificationScreen';
import CarsListScreen from './screens/tabs/CarsListScreen';
import CustomFiledListScreen from './screens/custom_field/CustomFiledListScreen';
import CarScreen from './screens/CarScreen';
import CustomFieldScreen from './screens/custom_field/CustomFieldScreen';
import AddEditCarInfoFirstScreen from './screens/car_add_edit/AddEditCarInfoFirstScreen';
import AddEditCarInfoSecondScreen from './screens/car_add_edit/AddEditCarInfoSecondScreen';
import CarSetupScreen from './screens/CarSetupScreen';
import UpdateCarToolScreen from './screens/UpdateCarToolScreen';
import EditProfileScreen from './screens/profile/EditProfileScreen';
import ChangePasswordScreen from './screens/profile/ChangePasswordScreen';
import { strings } from './utils/strings';
import { AuthProvider, useAuth } from './general/AuthContext';


import { 
  configureNotificationHandler, 
  registerForPushNotifications, 
  setupNotificationListener 
} from './general/notification'; // Import notification functions
import { varifyCode } from './api/Authentication';

const AuthStack = createStackNavigator();
const CarStack = createStackNavigator();
const SettingStack = createStackNavigator();
const MainStack = createBottomTabNavigator();

const AuthStackScreens = () => (
  <AuthStack.Navigator screenOptions={{
    headerTitleAlign: 'center',
    headerTintColor: 'black',
  }}>
    <AuthStack.Screen name="Login" options={{ title: strings.mainStack.Login }}>
      {props => <LoginScreen {...props} />}
    </AuthStack.Screen>
    <AuthStack.Screen name="Registration" component={RegistrationScreen} options={{ title: strings.mainStack.Registration }} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: strings.mainStack.Registration }} />
    <AuthStack.Screen name="VarifyCode" component={VerifyCodeScreen} options={{ title: strings.mainStack.Registration }} />
    <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: strings.mainStack.Registration }} />
    <AuthStack.Screen name="CarScreen" component={CarScreen} options={{ title: strings.mainStack.CarScreen }} />
  </AuthStack.Navigator>
);

const SettingStackScreens = () => (
  <SettingStack.Navigator screenOptions={{
    headerTitleAlign: 'center',
    headerTintColor: 'black',
  }}>
    <SettingStack.Screen name="Setting" component={SettingScreen} options={{ title: strings.mainStack.Setting }} />
    <SettingStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: strings.mainStack.EditProfile }} />
    <SettingStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: strings.mainStack.ChangePassword }} />
  </SettingStack.Navigator>
);

const confirmDeletion = (title, message, onDelete) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: strings.mainStack.noMessage,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: strings.mainStack.yesMessage,
        onPress: onDelete,
      },
    ],
    { cancelable: false },
  );
};

const CarStackScreens = () => (
  <CarStack.Navigator screenOptions={{
    headerTitleAlign: 'center',
    headerTintColor: 'black',
  }}>
      <CarStack.Screen 
        name="Home" 
        component={CarsListScreen} 
        options={({ navigation }) => ({
          title: strings.mainStack.Home,
          headerRight: () => (
            <TouchableOpacity
              style={{ padding: 10 }} // Adjust padding if needed
              onPress={() => navigation.navigate('AddEditCarInfoFirstScreen', { car: null })}
            >
              <Icon name="add" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })} 
      />
    <CarStack.Screen name="CustomFieldList" component={CustomFiledListScreen} options={({ navigation, route }) => ({
      title: strings.mainStack.CustomFieldList,
      headerRight: () => (
        <TouchableOpacity
        style={{ padding: 10 }} // Adjust padding if needed
        onPress={() => navigation.navigate('CustomField', { car: route.params.car })}
      >
        <Icon name="add" size={24} color="#000" />
      </TouchableOpacity>
      ),
    })} />
    <CarStack.Screen name="CustomField" component={CustomFieldScreen} options={({ route, navigation }) => ({
      title: route.params.customField?.name || strings.mainStack.CustomFieldList,
      headerRight: () => route.params.customField && (
        <Icon.Button name="trash" size={24} color="gray" backgroundColor="transparent" onPress={() => {
          confirmDeletion(
            strings.mainStack.deleteCustomFieldTitle,
            strings.mainStack.deleteQuestionText,
            () => {
              deleteCustomFieldCar(route.params.car.unique_key, route.params.customField.id).then(() => {
                navigation.navigate('CustomFieldList', { refresh: true, car: route.params.car });
              }).catch((error) => {
                console.error('Error deleting customField:', error);
              });
            },
          );
        }} />
      ),
    })} />
    <CarStack.Screen name="CarScreen" component={CarScreen} options={({ route, navigation }) => ({
      title: route.params?.car?.name || 'Car',
      headerRight: () => route.params.car && (
        <Icon.Button name="trash" size={24} color="gray" backgroundColor="transparent" onPress={() => {
          confirmDeletion(
            strings.mainStack.deleteCarTitle,
            strings.mainStack.deleteQuestionText,
            () => {
              deleteUserCar(route.params.car.unique_key).then(() => {
                navigation.navigate('Home', { refresh: true });
              }).catch((error) => {
                console.error('Error deleting car:', error);
              });
            },
          );
        }} />
      ),
    })} />
    <CarStack.Screen name="AddEditCarInfoFirstScreen" component={AddEditCarInfoFirstScreen} options={({ route }) => ({
      title: route.params?.car?.name || strings.mainStack.AddingCar,
    })} />
    <CarStack.Screen name="AddEditCarInfoSecondScreen" component={AddEditCarInfoSecondScreen} options={({ route }) => ({
      title: route.params?.car?.name || 'Car',
    })} />
    <CarStack.Screen name="CarSetupScreen" component={CarSetupScreen} options={({ route }) => ({
      title: route.params.car.name || 'Car',
    })} />
    <CarStack.Screen name="UpdateCarToolScreen" component={UpdateCarToolScreen} options={({ route }) => ({
      title: route.params.car.name || 'Car',
    })} />
  </CarStack.Navigator>
);


const MainStackScreens = () => (
  <MainStack.Navigator 
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'car' : 'car-outline';
        } else if (route.name === 'Setting') {
          iconName = focused ? 'settings' : 'settings-outline';
        } else if (route.name === 'Notification') {
          iconName = focused ? 'notifications' : 'notifications-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: 'black', // Set the tab bar color to black
        borderTopColor: 'black', // Optional: Set the border color (if you have a border)
      },
      activeTintColor: 'blue',
      inactiveTintColor: 'gray',
    })}
  >
    <MainStack.Screen name="Home" component={CarStackScreens} options={{ headerShown: false }} />
    <MainStack.Screen 
      name="Notification" 
      component={NotificationScreen} 
      options={{
        headerTitle: strings.mainStack.Notification,
        headerTitleAlign: 'center',
        // headerStyle: {
        //   backgroundColor: '#24292F', // Set the header background color to black
        // },
        // headerTintColor: 'white', // Set the header text color to white for better contrast
      }} 
    />
    <MainStack.Screen name="Setting" component={SettingStackScreens} options={{ headerShown: false }} />
  </MainStack.Navigator>
);



const App = () => {
  const { isLoggedIn } = useAuth(); // Hook to check if the user is authenticated

  useEffect(() => {// Configure the notification handler to display notifications in the foreground
    configureNotificationHandler();
  }, []);

  useEffect(() => {  // Register for push notifications
    if (isLoggedIn) {
      registerForPushNotifications();
    }
  }, [isLoggedIn]);

  useEffect(() => {// Set up listener for notification responses
    const removeListener = setupNotificationListener();
    return () => {// Cleanup the listener when the component unmounts
      removeListener();
    };
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainStackScreens /> : <AuthStackScreens />}
    </NavigationContainer>
  );
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
