// SecondScreen.js

import React, { useState , useCallback } from 'react';
import { View, TextInput, StyleSheet,ScrollView ,Pressable,Text,BackHandler } from 'react-native';
import { updateUserCar, createUserCar } from '../../api/UserCar';
import { useFocusEffect } from '@react-navigation/native';

const Separator = ({ text }) => (
  <View style={styles.separator}>
    <View style={styles.line} />
    <Text style={styles.text}>{text}</Text>
    <View style={styles.line} />
  </View>
);

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
          navigation.navigate('CarScreen', { car: car });
        })
        .catch((error) => console.error('Error updating car:', error));
    } else {
      createUserCar(cleanedCarData)
        .then(() =>
            {         
              navigation.navigate('Home')      })
        .catch((error) => console.error('Error creating car:', error));
    }
  };

  const cleanCarData = (data) => {
    const cleanedData = { ...data };
  
    // Iterate over mileage_info and remove empty values
    cleanedData.mileage_info = Object.keys(cleanedData.mileage_info)
      .filter(key => cleanedData.mileage_info[key] !== '')
      .reduce((obj, key) => {
        obj[key] = cleanedData.mileage_info[key];
        return obj;
      }, {});
  
    // Iterate over carData and remove empty values
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === '' || (typeof cleanedData[key] === 'object' && Object.keys(cleanedData[key]).length === 0)) {
        delete cleanedData[key];
      }
    });
  
    return cleanedData;
  };

  return (
    <ScrollView style={styles.container}>
      <Separator text="Oils" />
<TextInput
  placeholder="Engine Oil"
  value={(carData.mileage_info && carData.mileage_info.engine_oil) ? carData.mileage_info.engine_oil.toString() : ""}
  onChangeText={(text) => handleInputChange('engine_oil', text, true)}
  style={styles.input}
  keyboardType="numeric"
/>

<TextInput
  placeholder="Gearbox Oil"
  value={(carData.mileage_info && carData.mileage_info.gearbox_oil) ? carData.mileage_info.gearbox_oil.toString() : ""}
  onChangeText={(text) => handleInputChange('gearbox_oil', text, true)}
  style={styles.input}
  keyboardType="numeric"
/>

<TextInput
  placeholder="Hydraulic Fluid"
  value={(carData.mileage_info && carData.mileage_info.hydraulic_fluid) ? carData.mileage_info.hydraulic_fluid.toString() : ""}
  onChangeText={(text) => handleInputChange('hydraulic_fluid', text, true)}
  style={styles.input}
  keyboardType="numeric"
/>



      {/* <TextInput
        placeholder="Hydraulic Fluid Updated Date"
        value={allCarData.mileage_info.hydraulic_fluid_updated_date}
        onChangeText={(text) =>
          setAllCarData({
            ...allCarData,
            mileage_info: {
              ...allCarData.mileage_info,
              hydraulic_fluid_updated_date: text,
            },
          })
        }
        style={styles.input}
      /> */}
      <Separator text="Filters" />
      
      <TextInput
        placeholder="Oil Filter"
        value={(carData.mileage_info && carData.mileage_info.oil_filter) ? carData.mileage_info.oil_filter.toString() : ""}
        onChangeText={(text) => handleInputChange('oil_filter', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Fuel Filter"
        value={(carData.mileage_info && carData.mileage_info.fuel_filter) ? carData.mileage_info.fuel_filter.toString() : ""}
        onChangeText={(text) => handleInputChange('fuel_filter', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Air Filter"
        value={(carData.mileage_info && carData.mileage_info.air_filter) ? carData.mileage_info.air_filter.toString() : ""}
        onChangeText={(text) => handleInputChange('air_filter', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Cabin Air Filter"
        value={(carData.mileage_info && carData.mileage_info.cabin_air_filter) ? carData.mileage_info.cabin_air_filter.toString() : ""}
        onChangeText={(text) => handleInputChange('cabin_air_filter', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
<Separator />
      <TextInput
        placeholder="Timing Belt"
        value={(carData.mileage_info && carData.mileage_info.timing_belt) ? carData.mileage_info.timing_belt.toString() : ""}
        onChangeText={(text) => handleInputChange('timing_belt', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Alternator Belt"
        value={(carData.mileage_info && carData.mileage_info.alternator_belt) ? carData.mileage_info.alternator_belt.toString() : ""}
        onChangeText={(text) => handleInputChange('alternator_belt', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Front Brake Pads"
        value={(carData.mileage_info && carData.mileage_info.front_brake_pads) ? carData.mileage_info.front_brake_pads.toString() : ""}
        onChangeText={(text) => handleInputChange('front_brake_pads', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Rear Brake Pads"
        value={(carData.mileage_info && carData.mileage_info.rear_brake_pads) ? carData.mileage_info.rear_brake_pads.toString() : ""}
        onChangeText={(text) => handleInputChange('rear_brake_pads', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Spark Plug"
        value={(carData.mileage_info && carData.mileage_info.spark_plug) ? carData.mileage_info.spark_plug.toString() : ""}
        onChangeText={(text) => handleInputChange('spark_plug', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Front Suspension"
        value={(carData.mileage_info && carData.mileage_info.front_suspension) ? carData.mileage_info.front_suspension.toString() : ""}
        onChangeText={(text) => handleInputChange('spark_plug', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Clutch Plate"
        value={(carData.mileage_info && carData.mileage_info.clutch_plate) ? carData.mileage_info.clutch_plate.toString() : ""}
        onChangeText={(text) => handleInputChange('spark_plug', text, true)}
        style={styles.input}
        keyboardType="numeric"
      />
    

       {/* <TextInput
        placeholder="Timing Belt Last Updated Date"
        value={allCarData.mileage_info.timing_belt_last_updated_date}
        onChangeText={(text) =>
          setAllCarData({
            ...allCarData,
            mileage_info: {
              ...allCarData.mileage_info,
              timing_belt_last_updated_date: text,
            },
          })
        }
        style={styles.input}
      />
      <TextInput
        placeholder="Alternator Belt"
        value={allCarData.mileage_info.alternator_belt}
        onChangeText={(text) =>
          setAllCarData({
            ...allCarData,
            mileage_info: {
              ...allCarData.mileage_info,
              alternator_belt: text,
            },
          })
        }
        style={styles.input}
        keyboardType="numeric"

      /> */}

      <Pressable onPress={() => handleSave()}>
        <View style={styles.button}>
          <Text >Save</Text>
        </View>
      </Pressable>
    </ScrollView>
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
    button :{
      padding:20,
      marginBottom:200,
      fontSize: 20,
      alignItems:"center",
      backgroundColor: "#286090"    },
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
