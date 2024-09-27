import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { setAppLanguage } from '../i18n'; // Assuming you have setAppLanguage in the i18n config
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language); // Track the current language

  const changeLanguage = (newLang) => {
    setSelectedLanguage(newLang);
    setAppLanguage(newLang);
  };

  return (
    <View style={styles.languageContainer}>
      <TouchableOpacity onPress={() => changeLanguage('en')}>
        <Text style={[styles.languageText, selectedLanguage === 'en' && styles.selectedLanguage]}>
          English
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => changeLanguage('fa')}>
        <Text style={[styles.languageText, selectedLanguage === 'fa' && styles.selectedLanguage]}>
          Farsi
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  languageText: {
    fontSize: 16,
    marginHorizontal: 10,
    color: '#888', // Default text color
  },
  selectedLanguage: {
    color: '#007BFF', // Highlight selected language color
    fontWeight: 'bold',
  },
});

export default LanguageSwitcher;
