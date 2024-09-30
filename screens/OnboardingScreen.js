import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const onboardingData = [
  {
    id: 1,
    text: "Welcome to our App!",
    gif: require('../assets/Animation.gif'), 
  },
  {
    id: 2,
    text: "Explore our features",
    gif: require('../assets/Animation.gif'),
  },
  {
    id: 3,
    text: "Stay connected",
    gif: require('../assets/Animation.gif'),
  },
];

const OnboardingScreen = ({ onFinish }) => {  // Instead of using navigation here
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Call onFinish to signal that onboarding is complete
      onFinish(); 
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={onboardingData[currentStep].gif} style={styles.gif} />
      <Text style={styles.text}>{onboardingData[currentStep].text}</Text>

      <View style={styles.navigationContainer}>
        {currentStep > 0 && (
          <TouchableOpacity onPress={handlePrevious}>
            <Text style={styles.button}>Previous</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.button}>
            {currentStep === onboardingData.length - 1 ? 'Finish' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#24292F',
  },
  gif: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color:"white"
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    fontSize: 16,
    color: '#007BFF',
  },
});

export default OnboardingScreen;
