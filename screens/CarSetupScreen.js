import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TextInput, Button, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Example import
import { strings } from '../utils/strings'; // Adjust the path as per your project structure
import { getCarSetup, updateCarSetup, deleteCarSetup } from '../api/CarSetup'; // Adjust the paths as per your project structure

const CarSetupScreen = ({ route, navigation }) => {
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const car = route.params.car;

  const loadData = async () => {
    try {
      const data = await getCarSetup(car.unique_key);
      setCarData(data);
    } catch (error) {
      Alert.alert(strings.carSetupScreenStrings.errorTitle, strings.carSetupScreenStrings.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (field, value) => {
    setCarData({ ...carData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      await updateCarSetup(car.unique_key, carData);
      Alert.alert(strings.carSetupScreenStrings.successTitle, strings.carSetupScreenStrings.successUpdateMessage);
    } catch (error) {
      Alert.alert(strings.carSetupScreenStrings.errorTitle, strings.carSetupScreenStrings.errorMessage);
    }
  };

  const handleReset = async () => {
    try {
      await deleteCarSetup(car.unique_key);
      setCarData(null);
      loadData(car.unique_key);
      Alert.alert(strings.carSetupScreenStrings.successTitle, strings.carSetupScreenStrings.resetSuccessMessage);
    } catch (error) {
      Alert.alert(strings.carSetupScreenStrings.errorTitle, strings.carSetupScreenStrings.resetErrorMessage);
    }
  };

  if (loading) {
    return <Text>{strings.carSetupScreenStrings.loadingText}</Text>;
  }

  const excludedFields = ['id', 'car', 'timing_belt_max_year']; // Assuming this is defined somewhere

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {carData &&
        Object.keys(carData).map((key) => {
          if (!excludedFields.includes(key)) {
            return (
              <View key={key} style={styles.inputContainer}>
                <Text style={styles.label}>{key.replace(/_/g, ' ')}</Text>
                <TextInput
                  style={styles.input}
                  value={String(carData[key])}
                  onChangeText={(value) => handleChange(key, Number(value))}
                  keyboardType="numeric"
                />
              </View>
            );
          }
        })}
      <Button title={strings.carSetupScreenStrings.updateButtonTitle} onPress={handleSubmit} />
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Ionicons name="refresh-outline" size={24} color="#fff" />
        <Text style={styles.resetButtonText}>{strings.carSetupScreenStrings.resetButtonTitle}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  resetButton: {
    flexDirection: 'row',
    backgroundColor: '#ff0000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default CarSetupScreen;
