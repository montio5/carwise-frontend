import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import Separator from '../general/speratorComponent'; // Adjust path as per your project structure
import { getCarMileage, updateCarMileage } from '../api/UserCar'; // Adjust path as per your project structure
import { strings } from '../utils/strings'; // Import the strings object
import { getToolName } from '../general/generalFunctions'; // Adjust the path based on your project structure
import CustomButton from '../general/customButtonComponent';
import Toast from '../general/Toast';

const UpdateCarToolScreen = ({ route, navigation }) => {
  const [data, setData] = useState({});
  const [mileage, setMileage] = useState('');
  const [checkedFields, setCheckedFields] = useState({});
  const car = route.params.car;
  const toastRef = useRef();

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
      navigation.navigate('CarScreen', { refresh: true, car: car, toastMessage: strings.carSetupScreenStrings.successUpdateMessage });
    } catch (error) {
      console.error(error);
      toastRef.current.error(strings.carSetupScreenStrings.errorMessage);
    }
  };

  const excludedFields = ['unique_key', 'id', 'created_date', 'hydraulic_fluid_updated_date', 'timing_belt_last_updated_date'];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>{strings.updateCarTool.updateCarToolHeader}</Text>
        <Text style={styles.label}>{strings.updateCarTool.mileageLabel}</Text>
        <TextInput
          style={styles.input}
          placeholder={strings.updateCarTool.enterMileagePlaceholder}
          value={mileage}
          keyboardType="numeric"
          onChangeText={(value) => {
            setMileage(value);
            if (value === '') {
              // Reset checked fields when mileage is erased
              const resetCheckedFields = Object.keys(checkedFields).reduce((acc, key) => {
                acc[key] = false;
                return acc;
              }, {});
              setCheckedFields(resetCheckedFields);
            }
          }}
        />

        {Object.keys(data).map((field, index) => {
          if (excludedFields.includes(field) || field === 'custom_fields') {
            return null;
          }

          const toolName = getToolName(field);

          return (
            <View key={index} style={styles.fieldContainer}>
              {mileage !== '' && (
                <Checkbox
                  style={styles.checkbox}
                  value={checkedFields[field]}
                  onValueChange={() => handleCheckboxChange(field)}
                />
              )}
              <Text style={styles.fieldLabel}>{toolName}</Text>
              <TextInput
                style={[styles.input, checkedFields[field] && styles.disabledInput]}
                placeholder={data[field] !== null ? String(data[field]) : strings.updateCarTool.naPlaceholder}
                value={data[field] !== null ? String(data[field]) : null}
                editable={!checkedFields[field]}
                keyboardType="numeric"
                onChangeText={(value) => handleInputChange(field, value)}
              />
            </View>
          );
        })}

        {/* Render the separator only if there are custom fields */}
        {/* {data.custom_fields && data.custom_fields.length > 0 && <Separator text={strings.updateCarTool.customFieldsSeparator} />} */}

        {/* Map over the custom fields and render them */}
        {/* {data.custom_fields && data.custom_fields.map((customField) => (
          customField.last_mileage_changed != null && (
            <View key={customField.id} style={styles.fieldContainer}>
              {mileage !== '' && (
                <Checkbox
                  style={styles.checkbox}
                  value={checkedFields[`custom_field_${customField.id}`]}
                  onValueChange={() => handleCheckboxChange(`custom_field_${customField.id}`)}
                />
              )}
              <Text style={styles.fieldLabel}>{customField.name}</Text>
              <TextInput
                style={[styles.input, checkedFields[`custom_field_${customField.id}`] && styles.disabledInput]}
                placeholder={customField.last_mileage_changed !== null ? String(customField.last_mileage_changed) : strings.updateCarTool.naPlaceholder}
                value={String(customField.last_mileage_changed)}
                editable={!checkedFields[`custom_field_${customField.id}`]}
                keyboardType="numeric"
                onChangeText={(value) => handleInputChange(`custom_field_${customField.id}`, value)}
              />
            </View>
          )
        ))} */}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <CustomButton
          text={strings.updateCarTool.saveButton}
          onPress={handleSubmit}
          style={styles.button}
        />
      </View>
      <Toast ref={toastRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 80, // Ensures space at the bottom for the button
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
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  disabledInput: {
    backgroundColor: '#e9ecef',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 2,
    fontSize: 16,
    color: '#555',
    marginLeft: 8,
    marginRight: 8,
  },
  checkbox: {
    marginRight: 8,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  button: {
    marginVertical: 10,
  },
});

export default UpdateCarToolScreen;
