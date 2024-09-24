import React, { useState, useEffect,useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { createCustomField, getCustomField, updateCustomField } from '../../api/UserCar';
import { strings } from '../../utils/strings'; // Import the strings object
import CustomButton from '../../general/customButtonComponent'
import InputComponent from '../../general/customInputComponent'
import DatePickerComponent from '../../general/DatePickerComp' // Adjust the path according to your project structure
import Separator from '../../general/speratorComponent';
import Toast from '../../general/Toast';


const CustomFieldScreen = ({ route, navigation }) => {
  const car = route.params.car || null;
  const customField = route.params.customField || null;
  const toastRef = useRef();

  const [name, setName] = useState('');
  const [mileagePerChange, setMileagePerChange] = useState('');
  const [monthPerChangeYear, setMonthPerChangeYear] = useState('');
  const [monthPerChangeMonth, setMonthPerChangeMonth] = useState('');
  const [lastMileageChanged, setLastMileageChanged] = useState('');
  const [lastDateChanged, setLastDateChanged] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (customField) {
      getCustomField(car.unique_key, customField.id)
        .then((data) => {
          setName(data.name || '');
          setMileagePerChange(data.mileage_per_change ? data.mileage_per_change.toString() : '');
          setMonthPerChangeYear(data.month_per_changes ? Math.floor(data.month_per_changes / 12).toString() : '');
          setMonthPerChangeMonth(data.month_per_changes ? (data.month_per_changes % 12).toString() : '');
          setLastMileageChanged(data.last_mileage_changed ? data.last_mileage_changed.toString() : '');
          setLastDateChanged(data.last_date_changed ? new Date(data.last_date_changed) : null);
        })
        .catch((error) => console.error('Error fetching custom field:', error));
    }
  }, [customField, car.unique_key]);


  const handleSave = () => {
    const cleanedCarData = {
      name,
      mileage_per_change: mileagePerChange? parseFloat(mileagePerChange):null,
      last_mileage_changed: lastMileageChanged? parseFloat(lastMileageChanged):null,
      last_date_changed: lastDateChanged ? lastDateChanged.toISOString().split('T')[0] : null,
    };

    const monthPerChangeYearValue = monthPerChangeYear ? parseInt(monthPerChangeYear, 10) : 0;
    const monthPerChangeMonthValue = monthPerChangeMonth ? parseInt(monthPerChangeMonth, 10) : 0;
    const finalValue = monthPerChangeMonthValue + monthPerChangeYearValue * 12;
    if (finalValue !== 0) {
      cleanedCarData.month_per_changes = finalValue;
    }

    const apiCall = customField
      ? updateCustomField(car.unique_key, customField.id, cleanedCarData)
      : createCustomField(car.unique_key, cleanedCarData);

    apiCall
      .then((response) => {
        navigation.navigate('CustomFieldList', { refresh: true, car: car, toastMessage: strings.savedSuccessfully});
      })
      .catch((error) => {
        const errorMessage = typeof error === 'string' ? error : error.message;
        toastRef.current.error(errorMessage || strings.customFieldScreenStrings.errorFetchingCustomField || 'Error');
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
      <InputComponent
              isNumeric={false}
              value={name}
              placeholder={strings.customFieldScreenStrings.namePlaceholder}
              label={strings.customFieldScreenStrings.name}
              onChange={setName}

            />
                  <Separator text={strings.customFieldScreenStrings.mileageBase} />

            <InputComponent
              isNumeric={true}
              value={mileagePerChange}
              placeholder={strings.customFieldScreenStrings.mileagePlaceholder}
              label={strings.customFieldScreenStrings.mileagePerChange}
              onChange={setMileagePerChange}

            />
            <InputComponent
              isNumeric={true}
              value={lastMileageChanged}
              placeholder={strings.customFieldScreenStrings.lastMileagePlaceholder}
              label={strings.customFieldScreenStrings.lastMileageChanged}
              onChange={setLastMileageChanged}
            />
                  <Separator text={strings.customFieldScreenStrings.dateBase} />

        <Text style={styles.label}>{strings.customFieldScreenStrings.durationPerChange}</Text>
        <View style={styles.monthPerChangeContainer}>
        <InputComponent
              isNumeric={true}
              style={[styles.input, styles.monthInput]}
              value={monthPerChangeYear}
              placeholder={strings.customFieldScreenStrings.yearPlaceholder}
              onChange={setMonthPerChangeYear}
            />
        <InputComponent
              isNumeric={true}
              style={[styles.input, styles.monthInput]}
              value={monthPerChangeMonth}
              placeholder={strings.customFieldScreenStrings.monthPlaceholder}
              onChange={setMonthPerChangeMonth}
            />
        </View>

      <DatePickerComponent
        label={strings.customFieldScreenStrings.lastChangedDate}
        date={lastDateChanged}
        onDateChange={setLastDateChanged}
        placeholder={strings.customFieldScreenStrings.selectDateText}
        clearable={true}
        style={styles.datePickerComponent}/>

      </ScrollView>


      <View style={styles.bottomContainer}>
      <CustomButton
      text={strings.customFieldScreenStrings.saveButton}
      onPress={handleSave}/>
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
  contentContainer: {
    padding: 20,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#F6F6F6',

  },
  input: {
    height: 40,
    borderColor: 'gray',
    color: '#F6F6F6',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  monthPerChangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthInput: {
    flex: 1,
    marginRight: 10,
  },
  datePickerComponent: {
      margin:10 
  },
});

export default CustomFieldScreen;
