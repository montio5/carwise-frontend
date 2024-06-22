import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import animationData from '../assets/loading-animation.json';

const LoadingAnimation = () => {
    return (
      <View style={styles.animationContainer}>
        <LottieView
          source={animationData}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
    );
  };
  // console.log("====================== animation");
  const styles = StyleSheet.create({
    animationContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    animation: {
      width: 200, // adjust width/height if necessary
      height: 200,
    },
  });
  
  export default LoadingAnimation;
  