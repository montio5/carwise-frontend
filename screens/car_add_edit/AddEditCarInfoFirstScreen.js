// FirstScreen.js

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getUserCar, getCarModels} from '../../api/UserCar';

const AddEditCarInfoFirstScreen = ({ navigation, route }) => {
  const car = route.params.car || null; // Ensure car is null if not passed
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [carCompanies, setCarCompanies] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  const [carData, setCarData] = useState({
    name: '',
    car_model: '',
    mileage_info: {
      mileage: '',
      engine_oil: '',
      gearbox_oil: '',
      hydraulic_fluid: '',
      hydraulic_fluid_updated_date: '',
      oil_filter: '',
      fuel_filter: '',
      air_filter: '',
      cabin_air_filter: '',
      timing_belt: '',
      timing_belt_last_updated_date: '',
      alternator_belt: '',
      front_brake_pads: '',
      rear_brake_pads: '',
      spark_plug: '',
      front_suspension: '',
      clutch_plate: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (car !== null) {
        try {
          const data = await getUserCar(car.unique_key);
          setCarData(data);
        } catch (error) {
          console.error('Error fetching car:', error);
        }
      }
      try {
        const carModelsData = await getCarModels();
        setCarCompanies(carModelsData);
      } catch (error) {
        console.error('Error fetching car models:', error);
      }
    };

    fetchData();
  }, [car]);

  useEffect(() => {
    const { name, mileage_info } = carData;
    if (selectedCompany && selectedModel && name && mileage_info.mileage) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [carData, selectedCompany, selectedModel]);

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

  const handleCompanyChange = (companyId) => {
    setSelectedCompany(companyId);
    const selectedCompany = carCompanies.find(company => company.id === companyId);
    setCarModels(selectedCompany ? selectedCompany.car_models : []);
  };

  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    handleInputChange('car_model', modelId);
  };
  const handleNext = () => {
    navigation.navigate('AddEditCarInfoSecondScreen', { carData, car });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        value={(carData.name) ? carData.name.toString() : ""}
        onChangeText={(text) => handleInputChange('name', text)}
        style={styles.input}
      />
<Picker
        selectedValue={selectedCompany}
        onValueChange={(itemValue) => handleCompanyChange(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select Car Company" value={null} />
        {carCompanies.map((company) => (
          <Picker.Item key={company.id} label={company.name} value={company.id} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedModel}
        onValueChange={(itemValue) => handleModelChange(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select Car Model" value={null} />
        {carModels.map((model) => (
          <Picker.Item key={model.id} label={model.name} value={model.id} />
        ))}
      </Picker>
      
      <TextInput
        placeholder="Mileage"
        value={(carData.mileage_info.mileage) ? carData.mileage_info.mileage.toString() : ""}
        onChangeText={(text) => handleInputChange('mileage', text, true)}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Next" onPress={handleNext} disabled={isButtonDisabled} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '80%',
    marginBottom: 10,
    borderBottomWidth: 1,
    padding: 10,
  },
});

export default AddEditCarInfoFirstScreen;
