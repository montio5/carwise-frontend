import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getUserCar, getCarModels } from '../../api/UserCar';
import InputComponent from '../../general/customInputComponent' 
import {useTranslation} from 'react-i18next'

const AddEditCarInfoFirstScreen = ({ navigation, route }) => {
  const car = route.params.car || null;
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [carCompanies, setCarCompanies] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const { t } = useTranslation();

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
      try {
        const carModelsData = await getCarModels();
        setCarCompanies(carModelsData);

        if (car !== null) {
          const data = await getUserCar(car.unique_key);
          setCarData(data);

          // Find and set the selected company and model
          const selectedCompany = carModelsData.find(company =>
            company.car_models.some(model => model.id === data.car_model)
          );

          if (selectedCompany) {
            setSelectedCompany(selectedCompany.id);
            setCarModels(selectedCompany.car_models);
            setSelectedModel(data.car_model);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [car]);

  useEffect(() => {
    const { name, mileage_info } = carData;
    if (selectedCompany && selectedModel && name.trim()!== '' && mileage_info.mileage) {
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
    setSelectedModel(null); // Reset selected model when company changes
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
    <InputComponent
      placeholder={t("addEditCarInfoFirstScreenStrings.namePlaceholder")}
      value={carData.name.toString()}
      isNumeric={false}
      onChange={(text) => handleInputChange('name', text)} // Use `onChange` instead of `onChangeText`
      style={styles.input}
    />
      <Picker
        selectedValue={selectedCompany}
        onValueChange={(itemValue) => handleCompanyChange(itemValue)}
        style={styles.input}
        dropdownIconColor="white"  // Set arrow color to white

      >
        <Picker.Item label={t("addEditCarInfoFirstScreenStrings.selectCompanyLabel")} value={null} />
        {carCompanies.map((company) => (
          <Picker.Item key={company.id} label={company.name} value={company.id} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedModel}
        onValueChange={(itemValue) => handleModelChange(itemValue)}
        style={styles.input}
        enabled={selectedCompany !== null}
        dropdownIconColor="white"  // Set arrow color to white

      >
        <Picker.Item label={t("addEditCarInfoFirstScreenStrings.selectModelLabel")} value={null} />
        {carModels.map((model) => (
          <Picker.Item key={model.id} label={model.name} value={model.id} />
        ))}
      </Picker>
    <InputComponent
      placeholder={t("addEditCarInfoFirstScreenStrings.mileagePlaceholder")}
      value={carData.mileage_info.mileage}
      isNumeric={true}
      onChange={(text) => handleInputChange('mileage', text, true)} // Use `onChange` instead of `onChangeText`
      style={styles.input}
    />
      <Button title={t("addEditCarInfoFirstScreenStrings.nextButton")} onPress={handleNext} disabled={isButtonDisabled} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#24292F',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '80%',
    marginBottom: 10,
    padding: 10,
    color:'white'
  },
});

export default AddEditCarInfoFirstScreen;
