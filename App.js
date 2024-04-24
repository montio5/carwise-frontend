import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import SettingScreen from './screens/SettingScreen';
import NotificationScreen from './screens/NotificationScreen';
import HomeScreen from './screens/HomeScreen';



const AuthStack = createStackNavigator();
const MainStack = createBottomTabNavigator();

const AuthStackScreens = ({ setIsLoggedIn }) => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login">
      {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
    </AuthStack.Screen>
    <AuthStack.Screen name="Registration" component={RegistrationScreen} />
  </AuthStack.Navigator>
);

const MainStackScreens = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="Home" component={HomeScreen} />
    <MainStack.Screen name="Setting" component={SettingScreen} />
    <MainStack.Screen name="Notification" component={NotificationScreen} />

  </MainStack.Navigator>
);


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainStackScreens />
      ) : (
        <AuthStackScreens setIsLoggedIn={setIsLoggedIn} />
      )}
    </NavigationContainer>
  );
};

export default App;
