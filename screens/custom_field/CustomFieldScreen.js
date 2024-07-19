// CustomFieldScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import { createCustomField, getCustomField, updateCustomField } from '../../api/UserCar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { strings } from '../../utils/strings'; // Import the strings object
import CustomButton from '../../general/customButtonComponent'

const CustomFieldScreen = ({ route, navigation }) => {
  const car = route.params.car || null;
  const customField = route.params.customField || null;

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

  const handleDateChange = (event, selectedDate) => {
    setLastDateChanged(selectedDate || lastDateChanged);
    setShowDatePicker(false);
  };

  const clearDate = () => {
    setLastDateChanged(null);
  };

  const handleSave = () => {
    const cleanedCarData = {
      name,
      mileage_per_change: parseFloat(mileagePerChange),
      last_mileage_changed: parseFloat(lastMileageChanged),
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
        console.log(customField ? "UPDATE response:" : "CREATE response:", response);
        navigation.navigate('CarScreen', { refresh: true, car: car });
      })
      .catch((error) => {
        console.error(customField ? 'Error updating custom field:' : 'Error creating custom field:', error);
        Alert.alert(strings.customFieldScreenStrings.errorFetchingCustomField);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.label}>{strings.customFieldScreenStrings.name}</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder={strings.customFieldScreenStrings.namePlaceholder}
        />

        <Text style={styles.label}>{strings.customFieldScreenStrings.mileagePerChange}</Text>
        <TextInput
          style={styles.input}
          value={mileagePerChange}
          onChangeText={(text) => setMileagePerChange(text)}
          placeholder={strings.customFieldScreenStrings.mileagePlaceholder}
          keyboardType="numeric"
        />

        <Text style={styles.label}>{strings.customFieldScreenStrings.durationPerChange}</Text>
        <View style={styles.monthPerChangeContainer}>
          <TextInput
            style={[styles.input, styles.monthInput]}
            value={monthPerChangeYear}
            onChangeText={(text) => setMonthPerChangeYear(text)}
            placeholder={strings.customFieldScreenStrings.yearPlaceholder}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.monthInput]}
            value={monthPerChangeMonth}
            onChangeText={(text) => setMonthPerChangeMonth(text)}
            placeholder={strings.customFieldScreenStrings.monthPlaceholder}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.label}>{strings.customFieldScreenStrings.lastMileageChanged}</Text>
        <TextInput
          style={styles.input}
          value={lastMileageChanged}
          onChangeText={(text) => setLastMileageChanged(text)}
          placeholder={strings.customFieldScreenStrings.lastMileagePlaceholder}
          keyboardType="numeric"
        />

        <Text style={styles.label}>{strings.customFieldScreenStrings.lastChangedDate}</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
          <Icon name="calendar" size={20} color="black" style={{ marginRight: 10 }} />
          <Text>{lastDateChanged ? lastDateChanged.toDateString() : strings.customFieldScreenStrings.selectDateText}</Text>
          {lastDateChanged && (
            <Icon name="close-circle" size={20} color="gray" onPress={clearDate} style={{ marginLeft: 10 }} />
          )}
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={lastDateChanged || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </ScrollView>


      <View style={styles.bottomContainer}>
      <CustomButton
      text={strings.customFieldScreenStrings.saveButton}
      onPress={handleSave}/>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
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
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
  },
});

export default CustomFieldScreen;
