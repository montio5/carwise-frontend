import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';
import { getCarMileage, updateCarMileage } from '../api/UserCar'; // Adjust path as per your project structure
import CustomButton from '../general/customButtonComponent';
import Toast from '../general/Toast';
import InputComponent from '../general/customInputComponent'; // Import InputComponent
import {useTranslation} from 'react-i18next'
import { getToolName } from '../general/generalFunctions'; 

const UpdateCarToolScreen = ({ route, navigation }) => {
  const [data, setData] = useState({});
  const [mileage, setMileage] = useState('');
  const [checkedFields, setCheckedFields] = useState({});
  const car = route.params.car;
  const toastRef = useRef();
  const { t } = useTranslation();

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
                  toastRef.current.error(t("carSetupScreenStrings.errorMessage"));
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
      await updateCarMileage(car.unique_key, updatedData,t);
      navigation.navigate('CarScreen', { refresh: true, car: car, toastMessage: t("carSetupScreenStrings.successUpdateMessage") });
    } catch (error) {
      toastRef.current.error(error.message);
    }
  };

  const excludedFields = ['unique_key', 'id', 'created_date', 'hydraulic_fluid_updated_date', 'timing_belt_last_updated_date'];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>{t("updateCarTool.updateCarToolHeader")}</Text>
        {/* <Text style={styles.label}>{t("updateCarTool.mileageLabel")}</Text> */}
        <InputComponent
        style={styles.mainInput}
          isNumeric
          value={mileage}
          placeholder={t("updateCarTool.enterMileagePlaceholder")}
          onChange={(value) => {
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
          enableCamera ={true}
        />

        {Object.keys(data).map((field, index) => {
          if (excludedFields.includes(field) || field === 'custom_fields') {
            return null;
          }
          const toolName = getToolName(field, t);
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
              <InputComponent
                isNumeric
                value={data[field] !== null ? String(data[field]) : ''}
                placeholder={data[field] !== null ? String(data[field]) : t("updateCarTool.naPlaceholder")}
                style={checkedFields[field] ? styles.disabledInput : styles.input}
                onChange={(value) => handleInputChange(field, value)}
                editable={!checkedFields[field]}
              />
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <CustomButton
          text={t("updateCarTool.saveButton")}
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
    backgroundColor: '#24292F',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 80,
    
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: 'white',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444',
  },
  mainInput: {
    padding: 10,
    flex: 1,
    backgroundColor: '#24292F',
    marginBottom: 16,
  },
  input: {
    padding: 2,
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  disabledInput: {
    flex: 1,
    marginBottom: 16,
    backgroundColor: '#e9ecef',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    backgroundColor: '#24292F',
  },
  button: {
    marginVertical: 10,
  },
});

export default UpdateCarToolScreen;
