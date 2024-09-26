import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { updateUserCar, createUserCar } from '../../api/UserCar';
import { useFocusEffect } from '@react-navigation/native';
import Separator from '../../general/speratorComponent';
import CustomButton from '../../general/customButtonComponent';
import InputComponent from '../../general/customInputComponent';
import Toast from '../../general/Toast';
import {useTranslation} from 'react-i18next'

const AddEditCarInfoSecondScreen = ({ navigation, route }) => {
  const car = route.params.car;
  const [carData, setCarData] = useState(route.params.carData);
  const toastRef = useRef();
  const { t } = useTranslation();

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
      updateUserCar(car.unique_key, cleanedCarData,t)
        .then(() => {
          navigation.navigate('CarScreen', { refresh: true, car: car,toastMessage: t("savedSuccessfully") });
        })
        .catch((error) => {
          toastRef.current.error(error.message || t("addEditCarInfoSecondScreenStrings.errorInSavingCar") );
        });
    } else {
      createUserCar(cleanedCarData,t)
        .then(() => {
          navigation.navigate('Home', { refresh: true ,toastMessage: t("savedSuccessfully")});
        })
        .catch((error) => {
          toastRef.current.error(error.message || t("addEditCarInfoSecondScreenStrings.errorInSavingCar") );
        });
    }
  };

  const cleanCarData = (data) => {
    const cleanedData = { ...data };

    // Iterate over mileage_info and replace empty string values with null
    cleanedData.mileage_info = Object.keys(cleanedData.mileage_info)
      .reduce((obj, key) => {
        obj[key] = cleanedData.mileage_info[key] === '' ? null : cleanedData.mileage_info[key];
        return obj;
      }, {});

    if (cleanedData.mileage_info && cleanedData.mileage_info.hasOwnProperty('custom_fields')) {
      delete cleanedData.mileage_info['custom_fields'];
    }

    // Check and clean custom_fields if it exists
    if (Array.isArray(cleanedData.custom_fields)) {
      cleanedData.custom_fields = cleanedData.custom_fields.map(field => {
        // Replace empty string values with null within each custom field object
        return Object.keys(field)
          .reduce((obj, key) => {
            obj[key] = field[key] === '' ? null : field[key];
            return obj;
          }, {});
      }).filter(field => Object.keys(field).length > 0); // Remove empty custom field objects
    }

    // Iterate over cleanedData and replace empty string values with null
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === '') {
        cleanedData[key] = null;
      }
    });
    
    return cleanedData;
  };


  return (
    <View style={styles.container}>
    <ScrollView >
      <Separator text={t("addEditCarInfoSecondScreenStrings.oilsSeparator")} />
      <InputComponent
        label={t("addEditCarInfoSecondScreenStrings.engineOilPlaceholder")}
        value={(carData.mileage_info && carData.mileage_info.engine_oil) ? carData.mileage_info.engine_oil.toString() : ""}
        onChange={(text) => handleInputChange('engine_oil', text, true)}
        isNumeric={true}
        style={styles.input}
      />
       <InputComponent
        label={t("addEditCarInfoSecondScreenStrings.gearboxOilPlaceholder")}
        value={(carData.mileage_info && carData.mileage_info.gearbox_oil) ? carData.mileage_info.gearbox_oil.toString() : ""}
        onChange={(text) => handleInputChange('gearbox_oil', text, true)}
        isNumeric={true}
        style={styles.input}
      />
      <InputComponent
        label={t("addEditCarInfoSecondScreenStrings.hydraulicFluidPlaceholder")}
        value={(carData.mileage_info && carData.mileage_info.hydraulic_fluid) ? carData.mileage_info.hydraulic_fluid.toString() : ""}
        onChange={(text) => handleInputChange('hydraulic_fluid', text, true)}
        isNumeric={true}
        style={styles.input}
      />

      <Separator text={t("addEditCarInfoSecondScreenStrings.filtersSeparator")} />
      <InputComponent
        label={t("addEditCarInfoSecondScreenStrings.oilFilterPlaceholder")}
        value={(carData.mileage_info && carData.mileage_info.oil_filter) ? carData.mileage_info.oil_filter.toString() : ""}
        onChange={(text) => handleInputChange('oil_filter', text, true)}
        isNumeric={true}
        style={styles.input}
      />
      <InputComponent
        label={t("addEditCarInfoSecondScreenStrings.fuelFilterPlaceholder")}
        value={(carData.mileage_info && carData.mileage_info.fuel_filter) ? carData.mileage_info.fuel_filter.toString() : ""}
        onChange={(text) => handleInputChange('fuel_filter', text, true)}
        isNumeric={true}
        style={styles.input}
      />
      <InputComponent
        label={t("addEditCarInfoSecondScreenStrings.airFilterPlaceholder")}
        value={(carData.mileage_info && carData.mileage_info.air_filter) ? carData.mileage_info.air_filter.toString() : ""}
        onChange={(text) => handleInputChange('air_filter', text, true)}
        isNumeric={true}
        style={styles.input}
      />
      <InputComponent
        label={t("addEditCarInfoSecondScreenStrings.cabinAirFilterPlaceholder")}
        value={(carData.mileage_info && carData.mileage_info.cabin_air_filter) ? carData.mileage_info.cabin_air_filter.toString() : ""}
        onChange={(text) => handleInputChange('cabin_air_filter', text, true)}
        isNumeric={true}
        style={styles.input}
      />

      <Separator text={t("addEditCarInfoSecondScreenStrings.beltsSeparator")} />

       <InputComponent
        label={t("addEditCarInfoSecondScreenStrings.timingBeltPlaceholder")}
        value={(carData.mileage_info && carData.mileage_info.timing_belt) ? carData.mileage_info.timing_belt.toString() : ""}
        onChange={(text) => handleInputChange('timing_belt', text, true)}
        isNumeric={true}
        style={styles.input}
      />
      <InputComponent
        label={t("addEditCarInfoSecondScreenStrings.alternatorBeltPlaceholder")}
        value={(carData.mileage_info && carData.mileage_info.alternator_belt) ? carData.mileage_info.alternator_belt.toString() : ""}
        onChange={(text) => handleInputChange('alternator_belt', text, true)}
        isNumeric={true}
        style={styles.input}
      />

      <Separator text={t("addEditCarInfoSecondScreenStrings.brakesSeparator")} />

      <InputComponent
        label={t("addEditCarInfoSecondScreenStrings.frontBrakePadsPlaceholder")}
        value={(carData.mileage_info && carData.mileage_info.front_brake_pads) ? carData.mileage_info.front_brake_pads.toString() : ""}
        onChange={(text) => handleInputChange('front_brake_pads', text, true)}
        isNumeric={true}
        style={styles.input}
      />
      <InputComponent
        label={t("addEditCarInfoSecondScreenStrings.rearBrakePadsPlaceholder")}
        value={(carData.mileage_info && carData.mileage_info.rear_brake_pads) ? carData.mileage_info.rear_brake_pads.toString() : ""}
        onChange={(text) => handleInputChange('rear_brake_pads', text, true)}
        isNumeric={true}
        style={styles.input}
      />

      <Separator />

      <InputComponent
        label={t("addEditCarInfoSecondScreenStrings.sparkPlugPlaceholder")}
        value={(carData.mileage_info && carData.mileage_info.spark_plug) ? carData.mileage_info.spark_plug.toString() : ""}
        onChange={(text) => handleInputChange('spark_plug', text, true)}
        isNumeric={true}
        style={styles.input}
      />
      <InputComponent
        label={t("addEditCarInfoSecondScreenStrings.frontSuspensionPlaceholder")}
        value={(carData.mileage_info && carData.mileage_info.front_suspension) ? carData.mileage_info.front_suspension.toString() : ""}
        onChange={(text) => handleInputChange('front_suspension', text, true)}
        isNumeric={true}
        style={styles.input}
      />
      <InputComponent
        label={t("addEditCarInfoSecondScreenStrings.clutchPlatePlaceholder")}
        value={(carData.mileage_info && carData.mileage_info.clutch_plate) ? carData.mileage_info.clutch_plate.toString() : ""}
        onChange={(text) => handleInputChange('clutch_plate', text, true)}
        isNumeric={true}
        style={styles.input}
      />
    </ScrollView>
      <View style={styles.buttonContainer}>
            <CustomButton
            text={t("addEditCarInfoSecondScreenStrings.saveButton")}
            onPress={handleSave}
            style={styles.button}
            />
        </View>
        <Toast ref={toastRef} />

    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#24292F',
      padding:15,
      flex: 1,

    },
    input: {
      marginBottom: 20,
      paddingHorizontal: 8,
    },
    buttonContainer: {
      marginTop: 30,
      paddingBottom: 5, // Adds space for the button at the bottom
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
