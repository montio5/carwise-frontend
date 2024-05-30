import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import Checkbox from 'expo-checkbox';
import { getCarMileage, updateCarMileage } from '../api/UserCar'; // Import the API functions
import Separator from '../general/component';

const UpdateCarToolScreen = ({ route, navigation }) => {
  const [data, setData] = useState({});
  const [mileage, setMileage] = useState('');
  const [checkedFields, setCheckedFields] = useState({});
  const car = route.params.car;

  useEffect(() => {
    const getData = async () => {
      try {
        const initialData = await getCarMileage(car.unique_key);
        setData(initialData);
        const initialCheckedFields = Object.keys(initialData).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {});
        setCheckedFields(initialCheckedFields);
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, [car.unique_key]);

  const handleCheckboxChange = (field) => {
    setCheckedFields({
      ...checkedFields,
      [field]: !checkedFields[field],
    });
  };

  const handleSubmit = async () => {
    const updatedData = { ...data };

    // Update fields based on checked fields and set mileage
    Object.keys(checkedFields).forEach(field => {
      if (checkedFields[field]) {
        updatedData[field] = mileage;
      }
    });

    try {
      await updateCarMileage(car.unique_key, updatedData);
      console.log('Data updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  const excludedFields = ['unique_key', 'id', 'created_date', 'mileage', 'hydraulic_fluid_updated_date', 'timing_belt_last_updated_date'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Update Car Tool</Text>
      <Text style={styles.label}>Mileage</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter mileage"
        value={mileage}
        keyboardType="numeric"
        onChangeText={setMileage}
      />
      {Object.keys(data).map((field, index) => (
        !excludedFields.includes(field) && field !== 'custom_fields' && (
          <View key={index} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{field}</Text>
            <TextInput
              style={styles.input}
              placeholder={checkedFields[field] ? mileage : (data[field] !== null ? String(data[field]) : 'N/A')}
              value={checkedFields[field] ? mileage : ''}
              editable={!checkedFields[field]}
              keyboardType="numeric"
            />
            <Checkbox
              style={styles.checkbox}
              value={checkedFields[field]}
              onValueChange={() => handleCheckboxChange(field)}
            />
          </View>
        )
      ))}
      <Separator text="Custom fields" />
      {data.custom_fields && data.custom_fields.map((customField) => (
        customField.last_mileage_changed != null && (
          <View key={customField.id} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{customField.name}</Text>
            <TextInput
              style={styles.input}
              placeholder={checkedFields[`custom_field_${customField.id}`] ? mileage : (customField.last_mileage_changed !== null ? String(customField.last_mileage_changed) : 'N/A')}
              value={checkedFields[`custom_field_${customField.id}`] ? mileage : ''}
              editable={!checkedFields[`custom_field_${customField.id}`]}
              keyboardType="numeric"
            />
            <Checkbox
              style={styles.checkbox}
              value={checkedFields[`custom_field_${customField.id}`]}
              onValueChange={() => handleCheckboxChange(`custom_field_${customField.id}`)}
            />
          </View>
        )
      ))}
      <Pressable onPress={() => handleSubmit()}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Save</Text>
        </View>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fieldLabel: {
    flex: 1,
    fontSize: 16,
    color: '#555',
  },
  checkbox: {
    marginLeft: 8,
  },
  button: {
    padding: 20,
    marginBottom: 200,
    fontSize: 20,
    alignItems: "center",
    backgroundColor: "#286090"
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#737373',
  },
  text: {
    marginHorizontal: 10,
    color: '#737373',
    fontSize: 16,
  },
});

export default UpdateCarToolScreen;
