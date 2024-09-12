import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendFCMTokenToServer } from '../api/Authentication'; 



// Set notification handler to display notifications when the app is in the foreground
export const configureNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,  // Show alert banner
      shouldPlaySound: true,  // Play sound
      shouldSetBadge: false,  // Don't update badge
    }),
  });
};

// Function to register the device for push notifications and get the Expo push token
export const registerForPushNotifications = async () => {
  try {
    console.log("Requesting notification permissions...");
    // Request notification permissions using expo-notifications API
    const { status } = await Notifications.requestPermissionsAsync();
    
    if (status !== 'granted') {
      console.log("Notification permissions not granted");
      return;
    }

    console.log("Fetching Expo Push Token...");
    // Get Expo Push Token
    const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token fetched: ", expoPushToken);

    // Store the token in AsyncStorage
    await AsyncStorage.setItem('expoPushToken', expoPushToken);

    console.log("Sending the Expo Push Token to the server...");
    // Send the token to your server to save it in your backend
    await sendFCMTokenToServer({ fcm_token: expoPushToken });
    console.log("Expo Push Token sent to the server");
  } catch (error) {
    console.error("Error registering for notifications:", error);
  }
};

// Function to set up a listener for incoming notifications
export const setupNotificationListener = () => {
  const subscription = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received: ', notification);
    // You can handle the notification or update your UI here
  });

  // Cleanup function to remove the listener when it's no longer needed
  return () => {
    Notifications.removeNotificationSubscription(subscription);
  };
};
