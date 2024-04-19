import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native'; 

const RegistrationScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  const navigation = useNavigation(); // Get navigation object

  const handleRegister = () => {
    // Your registration logic here
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
      {/* No reference to changeLanguage function */}
      <View style={styles.languageContainer}>
        <Text style={styles.languageText}>{t('registration.languageSelection')}</Text>
        {/* Replace Button with Pressable */}
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.languageButton}>{t('registration.loginLink')}</Text>
        </Pressable>
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
  languageButton: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default RegistrationScreen;
