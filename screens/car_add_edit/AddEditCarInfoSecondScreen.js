// SecondScreen.js

import React, { useState , useCallback } from 'react';
import { View, TextInput, StyleSheet,ScrollView ,Pressable,Text,BackHandler } from 'react-native';
import { updateUserCar, createUserCar } from '../../api/UserCar';
import { useFocusEffect } from '@react-navigation/native';
import Separator from '../../general/component'
import { strings } from '../../utils/strings'; // Import the strings object
import CustomButton from '../../general/customButtonComponent'


const AddEditCarInfoSecondScreen = ({ navigation, route }) => {
  const car = route.params.car;
  const [carData, setCarData] = useState(route.params.carData);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('AddEditCarInfoFirstScreen', { car });
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [navigation, car])
  );

  const handleInputChange = (field, value, isMileageInfo = false) => {
    if (isMileageInfo) {
      setCarData((prevData) => ({
        ...prevData,
        mileage_info: {
          ...prevData.mileage_info,
          [field]: value,
        },
      }));
    } else {
      setCarData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    }
  };

  const handleSave = () => {
    const cleanedCarData = cleanCarData(carData);
    if (car !== null) {
      updateUserCar(car.unique_key, cleanedCarData)
        .then((response) => {
          console.log("Update response:", response);
          navigation.navigate('CarScreen', { refresh: true , car: car});
        })
        .catch((error) => console.error('Error updating car:', error));
    } else {
      createUserCar(cleanedCarData)
        .then(() =>
            {         
              navigation.navigate('Home',{refresh : true})      })
        .catch((error) => console.error('Error creating car:', error));
    }
  };

  const cleanCarData = (data) => {
    const cleanedData = { ...data };
  
    // Iterate over mileage_info and remove keys with empty string values
    cleanedData.mileage_info = Object.keys(cleanedData.mileage_info)
      .filter(key => cleanedData.mileage_info[key] !== '')
      .reduce((obj, key) => {
        obj[key] = cleanedData.mileage_info[key];
        return obj;
      }, {});
  
      if (cleanedData.mileage_info && cleanedData.mileage_info.hasOwnProperty('custom_fields')) {
        delete cleanedData.mileage_info['custom_fields'];
      }
            // Check and clean custom_fields if it exists
    if (Array.isArray(cleanedData.custom_fields)) {
      cleanedData.custom_fields = cleanedData.custom_fields.map(field => {
        // Remove empty string values within each custom field object
        return Object.keys(field)
          .filter(key => field[key] !== '')
          .reduce((obj, key) => {
            obj[key] = field[key];
            return obj;
          }, {});
      }).filter(field => Object.keys(field).length > 0); // Remove empty custom field objects
    }
  
    // Iterate over cleanedData and remove keys with empty string values or empty objects
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === '' || (typeof cleanedData[key] === 'object' && Object.keys(cleanedData[key]).length === 0)) {
        delete cleanedData[key];
      }
    });
    return cleanedData;
  };

  return (
    <View style={styles.container}>
    <ScrollView >
      <Separator text={strings.addEditCarInfoSecondScreenStrings.oilsSeparator} />
      <TextInput
        placeholder={strings.addEditCarInfoSecondScreenStrings.engineOilPlaceholder}
        value={(carData.mileage_info && carData.mileage_info.engine_oil) ? carData.mileage_info.engine_oil.toString() : ""}
        onChangeText={(text) => handleInputChange('engine_oil', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder={strings.addEditCarInfoSecondScreenStrings.gearboxOilPlaceholder}
        value={(carData.mileage_info && carData.mileage_info.gearbox_oil) ? carData.mileage_info.gearbox_oil.toString() : ""}
        onChangeText={(text) => handleInputChange('gearbox_oil', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder={strings.addEditCarInfoSecondScreenStrings.hydraulicFluidPlaceholder}
        value={(carData.mileage_info && carData.mileage_info.hydraulic_fluid) ? carData.mileage_info.hydraulic_fluid.toString() : ""}
        onChangeText={(text) => handleInputChange('hydraulic_fluid', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />

      <Separator text={strings.addEditCarInfoSecondScreenStrings.filtersSeparator} />
      <TextInput
        placeholder={strings.addEditCarInfoSecondScreenStrings.oilFilterPlaceholder}
        value={(carData.mileage_info && carData.mileage_info.oil_filter) ? carData.mileage_info.oil_filter.toString() : ""}
        onChangeText={(text) => handleInputChange('oil_filter', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder={strings.addEditCarInfoSecondScreenStrings.fuelFilterPlaceholder}
        value={(carData.mileage_info && carData.mileage_info.fuel_filter) ? carData.mileage_info.fuel_filter.toString() : ""}
        onChangeText={(text) => handleInputChange('fuel_filter', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder={strings.addEditCarInfoSecondScreenStrings.airFilterPlaceholder}
        value={(carData.mileage_info && carData.mileage_info.air_filter) ? carData.mileage_info.air_filter.toString() : ""}
        onChangeText={(text) => handleInputChange('air_filter', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder={strings.addEditCarInfoSecondScreenStrings.cabinAirFilterPlaceholder}
        value={(carData.mileage_info && carData.mileage_info.cabin_air_filter) ? carData.mileage_info.cabin_air_filter.toString() : ""}
        onChangeText={(text) => handleInputChange('cabin_air_filter', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />

      <Separator />
      <TextInput
        placeholder={strings.addEditCarInfoSecondScreenStrings.timingBeltPlaceholder}
        value={(carData.mileage_info && carData.mileage_info.timing_belt) ? carData.mileage_info.timing_belt.toString() : ""}
        onChangeText={(text) => handleInputChange('timing_belt', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder={strings.addEditCarInfoSecondScreenStrings.alternatorBeltPlaceholder}
        value={(carData.mileage_info && carData.mileage_info.alternator_belt) ? carData.mileage_info.alternator_belt.toString() : ""}
        onChangeText={(text) => handleInputChange('alternator_belt', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder={strings.addEditCarInfoSecondScreenStrings.frontBrakePadsPlaceholder}
        value={(carData.mileage_info && carData.mileage_info.front_brake_pads) ? carData.mileage_info.front_brake_pads.toString() : ""}
        onChangeText={(text) => handleInputChange('front_brake_pads', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder={strings.addEditCarInfoSecondScreenStrings.rearBrakePadsPlaceholder}
        value={(carData.mileage_info && carData.mileage_info.rear_brake_pads) ? carData.mileage_info.rear_brake_pads.toString() : ""}
        onChangeText={(text) => handleInputChange('rear_brake_pads', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder={strings.addEditCarInfoSecondScreenStrings.sparkPlugPlaceholder}
        value={(carData.mileage_info && carData.mileage_info.spark_plug) ? carData.mileage_info.spark_plug.toString() : ""}
        onChangeText={(text) => handleInputChange('spark_plug', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder={strings.addEditCarInfoSecondScreenStrings.frontSuspensionPlaceholder}
        value={(carData.mileage_info && carData.mileage_info.front_suspension) ? carData.mileage_info.front_suspension.toString() : ""}
        onChangeText={(text) => handleInputChange('front_suspension', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder={strings.addEditCarInfoSecondScreenStrings.clutchPlatePlaceholder}
        value={(carData.mileage_info && carData.mileage_info.clutch_plate) ? carData.mileage_info.clutch_plate.toString() : ""}
        onChangeText={(text) => handleInputChange('clutch_plate', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
    </ScrollView>
      <View style={styles.buttonContainer}>
            <CustomButton
            text={strings.addEditCarInfoSecondScreenStrings.saveButton}
            onPress={handleSave}
            style={styles.button}/>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      margin: 20,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 16,
      paddingHorizontal: 8,
    },
    buttonContainer: {
      // padding: 16,
      marginTop: 30,
      paddingBottom: 5, // Adds space for the button at the bottom
      // backgroundColor: '#f9f9f9',
    },
    button: {
      marginVertical: 5,
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
  
export default AddEditCarInfoSecondScreen;
