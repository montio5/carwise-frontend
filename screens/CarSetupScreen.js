import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { getCarSetup, updateCarSetup, deleteCarSetup } from '../api/CarSetup'; // Adjust the paths as per your project structure
import { getToolName } from '../general/generalFunctions'; // Adjust the path based on your project structure
import CustomButton from '../general/customButtonComponent';
import InputComponent from '../general/customInputComponent';
import Toast from '../general/Toast';
import {useTranslation} from 'react-i18next'

const CarSetupScreen = ({ route, navigation }) => {
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toastRef = useRef();
  const { t } = useTranslation();

  const car = route.params.car;

  const loadData = async () => {
    try {
      const data = await getCarSetup(car.unique_key);
      setCarData(data);
    } catch (error) {
      toastRef.current.error(t("carSetupScreenStrings.errorMessage"));
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
      toastRef.current.success(t("carSetupScreenStrings.successUpdateMessage"));
    } catch (error) {
      toastRef.current.error(t("carSetupScreenStrings.errorMessage"));
    }
  };

  const handleReset = async () => {
    try {
      await deleteCarSetup(car.unique_key);
      setCarData(null);
      loadData(car.unique_key);
      toastRef.current.success(t("carSetupScreenStrings.resetSuccessMessage"));
    } catch (error) {
      toastRef.current.error(t("carSetupScreenStrings.resetErrorMessage"));
    }
  };

  if (loading) {
    return <Text>{t("carSetupScreenStrings.loadingText")}</Text>;
  }

  const excludedFields = ['id', 'car', 'timing_belt_max_year']; // Assuming this is defined somewhere

  return (
    <View style={styles.parentContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {carData &&
          Object.keys(carData).map((key) => {
            if (!excludedFields.includes(key)) {
              const toolName = getToolName(key);

              return (
                <View key={key} style={styles.inputContainer}>
                  <InputComponent
                    isNumeric={true} // or determine if it should be numeric based on the key
                    value={String(carData[key])}
                    placeholder={`Enter ${toolName}`}
                    label={toolName}
                    onChange={(value) => handleChange(key, Number(value))}
                  />
                </View>
              );
            }
          })}
        <View style={styles.bottomContainer}>
        <CustomButton
          text={t("carSetupScreenStrings.updateButtonTitle")}
          onPress={handleSubmit}
          style={styles.button}
        />

        <CustomButton
          text={t("carSetupScreenStrings.resetButtonTitle")}
          icon="refresh-outline"
          onPress={handleReset}
          backgroundColor="red"
          style={styles.button}
        />
        </View>
      </ScrollView>
      <Toast ref={toastRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: '#24292F',
  },
  container: {
    padding: 20,
    backgroundColor: '#24292F',
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
  button: {
    marginVertical: 10, // Vertical margin between buttons
  },
  bottomContainer:{
    marginTop:50
  }
});

export default CarSetupScreen;
