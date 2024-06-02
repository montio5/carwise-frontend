// CarDataScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { getCarSetup, updateCarSetup, deleteCarSetup } from '../api/CarSetup';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CarSetupScreen = ({ route, navigation }) => {
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const car = route.params.car;


  const loadData = async () => {
    try {
      const data = await getCarSetup(car.unique_key);
      setCarData(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data');
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
      Alert.alert('Success', 'Data updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update data');
    }
  };

  const handleReset = async () => {
    try {
      await deleteCarSetup(car.unique_key);
      setCarData(null);
      loadData(car.unique_key);
      Alert.alert('Success', 'Car setup has been reset.');
    } catch (error) {

      Alert.alert('Error', 'Failed to reset car setup');
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }
  excludedFields = ['id','car','timing_belt_max_year']
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {carData && Object.keys(carData).map((key) => {
        if (!excludedFields.includes(key) ) {
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
      <Button title="Update Data" onPress={handleSubmit} />
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Ionicons name="refresh-outline" size={24} color="#fff" />
        <Text style={styles.resetButtonText}>Reset Data</Text>
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
