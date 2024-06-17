import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import Separator from '../general/component'; // Adjust path as per your project structure
import { getCarMileage, updateCarMileage } from '../api/UserCar'; // Adjust path as per your project structure
import { strings } from '../utils/strings'; // Import the strings object

const UpdateCarToolScreen = ({ route, navigation }) => {
  const [data, setData] = useState({});
  const [mileage, setMileage] = useState('');
  const [checkedFields, setCheckedFields] = useState({});
  const car = route.params.car;

  useEffect(() => {
    getData();
  }, [car.unique_key]);

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
      Alert.alert(strings.carSetupScreenStrings.errorTitle, strings.carSetupScreenStrings.errorMessage);
    }
  };

  const handleCheckboxChange = (field) => {
    const isChecked = !checkedFields[field];
    setCheckedFields({
      ...checkedFields,
      [field]: isChecked,
    });

    if (isChecked && mileage) {
      setData({
        ...data,
        [field]: mileage,
      });
    }
  };

  const handleInputChange = (field, value) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    const updatedData = { ...data };

    // Update fields based on checked fields and set mileage
    Object.keys(checkedFields).forEach((field) => {
      if (checkedFields[field]) {
        updatedData[field] = mileage;
      }
    });

    try {
      await updateCarMileage(car.unique_key, updatedData);
      console.log('Data updated successfully');
      navigation.navigate('CarScreen', { refresh: true, car: car });
      Alert.alert(strings.carSetupScreenStrings.successTitle, strings.carSetupScreenStrings.successUpdateMessage);
    } catch (error) {
      console.error(error);
      Alert.alert(strings.carSetupScreenStrings.errorTitle, strings.carSetupScreenStrings.errorMessage);
    }
  };

  const excludedFields = ['unique_key', 'id', 'created_date', 'mileage', 'hydraulic_fluid_updated_date', 'timing_belt_last_updated_date'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{strings.updateCarTool.updateCarToolHeader}</Text>
      <Text style={styles.label}>{strings.updateCarTool.mileageLabel}</Text>
      <TextInput
        style={styles.input}
        placeholder={strings.updateCarTool.enterMileagePlaceholder}
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
              placeholder={data[field] !== null ? String(data[field]) : strings.updateCarTool.naPlaceholder}
              value={data[field] !== null ? String(data[field]) : ''}
              editable={!checkedFields[field]}
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange(field, value)}
            />
            <Checkbox
              style={styles.checkbox}
              value={checkedFields[field]}
              onValueChange={() => handleCheckboxChange(field)}
            />
          </View>
        )
      ))}

      {/* Render the separator only if there are custom fields */}
      {data.custom_fields && data.custom_fields.length > 0 && <Separator text={strings.updateCarTool.customFieldsSeparator} />}

      {/* Map over the custom fields and render them */}
      {data.custom_fields && data.custom_fields.map((customField) => (
        customField.last_mileage_changed != null && (
          <View key={customField.id} style={styles.fieldContainer}>
            {/* Render the custom field name */}
            <Text style={styles.fieldLabel}>{customField.name}</Text>
            
            {/* Render a TextInput for the custom field */}
            <TextInput
              style={styles.input}
              placeholder={customField.last_mileage_changed !== null ? String(customField.last_mileage_changed) : strings.updateCarTool.naPlaceholder}
              value={String(customField.last_mileage_changed)}
              editable={!checkedFields[`custom_field_${customField.id}`]}
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange(`custom_field_${customField.id}`, value)}
            />
            
            {/* Render a Checkbox for the custom field */}
            <Checkbox
              style={styles.checkbox}
              value={checkedFields[`custom_field_${customField.id}`]}
              onValueChange={() => handleCheckboxChange(`custom_field_${customField.id}`)}
            />
          </View>
        )
      ))}

      <Pressable onPress={handleSubmit}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>{strings.updateCarTool.saveButton}</Text>
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
    alignItems: 'center',
    backgroundColor: '#286090',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UpdateCarToolScreen;
