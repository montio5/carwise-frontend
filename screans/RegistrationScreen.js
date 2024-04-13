// RegistrationScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const RegistrationScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t, i18n } = useTranslation();

  const handleRegister = () => {
    // Your registration logic here
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('registration.title')}</Text>
      <TextInput
        placeholder={t('registration.emailPlaceholder')}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder={t('registration.passwordPlaceholder')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title={t('registration.registerButton')} onPress={handleRegister} />
      <View style={styles.languageContainer}>
        <Text style={styles.languageText}>{t('registration.languageSelection')}</Text>
        <Button title="English" onPress={() => changeLanguage('en')} />
        <Button title="فارسی" onPress={() => changeLanguage('fa')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginVertical: 10,
    width: 300,
  },
  languageContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    marginRight: 10,
  },
});

export default RegistrationScreen;
