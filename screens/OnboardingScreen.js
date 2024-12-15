import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LanguageSwitcher from '../general/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const onboardingData = [
  {
    id: 1,
    title: 'onBoardingScreen.welcome',
    text: 'onBoardingScreen.welcomeDesc',
  },
  {
    id: 2,
    title: 'onBoardingScreen.updateFields',
    text: 'onBoardingScreen.updateFieldsDetail',
    gif: require('../assets/car-setup.gif'),
  },
  {
    id: 3,
    title: 'onBoardingScreen.customScreen',
    text: 'onBoardingScreen.customScreenDetail',
    gif: require('../assets/custom-field.gif'),
  },
  {
    id: 4,
    title: 'onBoardingScreen.customSetup',
    text: 'onBoardingScreen.customSetupDetail',
    gif: require('../assets/car-setup.gif'),
  },
];

const OnboardingScreen = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(true); // To track video load success
  const { t } = useTranslation();

  const handleNext = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsVideoLoaded(true); // Reset for next step
    } else {
      onFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsVideoLoaded(true); // Reset for previous step
    }
  };

  const currentData = onboardingData[currentStep];
  const hasGif = currentData.gif && isVideoLoaded;

  return (
    <View style={styles.container}>
      {hasGif && (
        <View style={styles.gifContainer}>
          <Image
            source={currentData.gif}
            style={styles.gif}
            resizeMode="contain"
            onError={() => setIsVideoLoaded(false)} // Handle video load failure
          />
        </View>
      )}

      <View
        style={[
          styles.textContainer,
          !hasGif && styles.centeredTextContainer, // Center text if no gif
        ]}
      >
        <Text style={styles.title}>{t(currentData.title)}</Text>
        <Text style={styles.text}>{t(currentData.text)}</Text>
      </View>

      <View style={styles.navigationContainer}>
        {currentStep > 0 && (
          <TouchableOpacity onPress={handlePrevious}>
            <Text style={styles.button}>{t('onBoardingScreen.previous')}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.button}>
            {currentStep === onboardingData.length - 1 ? t('onBoardingScreen.finish') : t('onBoardingScreen.next')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.languageSwitcherContainer}>
        <LanguageSwitcher />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#24292F',
  },
  gifContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  gif: {
    width: '100%',
    height: '60%',
    aspectRatio: 9 / 16, // Mobile screen aspect ratio
  },
  textContainer: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  centeredTextContainer: {
    flex: 1, // Center content in the absence of video
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  button: {
    fontSize: 16,
    color: '#007BFF',
  },
  languageSwitcherContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default OnboardingScreen;
