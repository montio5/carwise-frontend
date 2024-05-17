import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you have Ionicons installed

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import LoginScreen from './screens/auth/LoginScreen';
import RegistrationScreen from './screens/auth/RegistrationScreen';
import SettingScreen from './screens/tabs/SettingScreen';
import NotificationScreen from './screens/tabs/NotificationScreen';
import CarsListScreen from './screens/tabs/CarsListScreen';
import CarScreen from './screens/CarScreen';
import CustomFieldScreen from './screens/CustomFieldScreen';
import AddEditCarInfoFirstScreen from './screens/car_add_edit/AddEditCarInfoFirstScreen';
import AddEditCarInfoSecondScreen from './screens/car_add_edit/AddEditCarInfoSecondScreen';
import CarSetupScreen from './screens/CarSetupScreen';
import UpdateCarToolScreen from './screens/UpdateCarToolScreen'

const AuthStack = createStackNavigator();
const CarStack = createStackNavigator();
const MainStack = createBottomTabNavigator();

const AuthStackScreens = ({ setIsLoggedIn }) => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login">
      {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
    </AuthStack.Screen>
    <AuthStack.Screen name="Registration" component={RegistrationScreen} />
    <AuthStack.Screen name="CarScreen" component={CarScreen} />
  </AuthStack.Navigator>
);

const CarStackScreens = () => (
  <CarStack.Navigator>
   <CarStack.Screen
      name="Home"
      component={CarsListScreen}
      options={({ navigation }) => ({
        title: 'Home',
        headerRight: () => (
          <Icon.Button
            name="add"
            size={24}
            color="#000"
            backgroundColor="transparent"
            onPress={() => navigation.navigate('AddEditCarInfoFirstScreen', { car: null })}
          />
        ),
      })}
    />
<CarStack.Screen
  name="CarScreen"
  component={CarScreen}
  options={({ route }) => ({
    title: route.params?.car?.name || 'Car',
  })}
/>
<CarStack.Screen
  name="AddEditCarInfoFirstScreen"
  component={AddEditCarInfoFirstScreen}
  options={({ route }) => ({
    title: route.params?.car?.name || 'Adding Car',
  })}
/>
<CarStack.Screen
  name="AddEditCarInfoSecondScreen"
  component={AddEditCarInfoSecondScreen}
  options={({ route }) => ({
    title: route.params?.car?.name || 'Car',
  })}
/>
        <CarStack.Screen
      name="CarSetupScreen"
      component={CarSetupScreen}
      options={({ route }) => ({
        title: route.params.car.name || 'Car',
      })}
    />
        <CarStack.Screen
      name="UpdateCarToolScreen"
      component={UpdateCarToolScreen}
      options={({ route }) => ({
        title: route.params.car.name || 'Car',
      })}
    />
    <CarStack.Screen name="CustomField" component={CustomFieldScreen} />

  </CarStack.Navigator>
);

const MainStackScreens = () => {

  return (
    <MainStack.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Setting') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Notification') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
      }}
    >
      <MainStack.Screen name="Home" component={CarStackScreens} options={{ headerShown: false }} />
      <MainStack.Screen name="Notification" component={NotificationScreen} />
      <MainStack.Screen name="Setting" component={SettingScreen} />
    </MainStack.Navigator>
  );
};


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  // return (
  //   <NavigationContainer>
  //     {isLoggedIn ? (
  //       <MainStackScreens />
  //     ) : (
  //       <AuthStackScreens setIsLoggedIn={setIsLoggedIn} />
  //     )}
  //   </NavigationContainer>
  // );
  return (
    <NavigationContainer>
        <MainStackScreens />
    </NavigationContainer>
  );
};
export default App;