import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import PersianDatePicker from 'react-native-persian-date-picker'; // Persian Date Picker import
import AsyncStorage from '@react-native-async-storage/async-storage';

const DatePickerComponent = ({ label, date, onDateChange, placeholder, clearable, style }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [language, setLanguage] = useState('fa'); // Default language is Persian
  const [selectedDate, setSelectedDate] = useState(date);

  useEffect(() => {
    // Fetch the app language from AsyncStorage
    const fetchLanguage = async () => {
      const appLanguage = await AsyncStorage.getItem('appLanguage') || 'fa';
      setLanguage(appLanguage);
    };

    fetchLanguage();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  const handlePersianDateChange = (persianDate) => {
    // Convert persian date to JavaScript Date object if needed
    setSelectedDate(persianDate);
    onDateChange(persianDate);
    setShowDatePicker(false);
  };

  const clearDate = () => {
    setSelectedDate(null);
    onDateChange(null);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
        <Icon name="calendar" size={20} color="black" style={{ marginRight: 10 }} />
        <Text>{selectedDate ? selectedDate.toDateString() : placeholder}</Text>
        {clearable && selectedDate && (
          <Icon name="close-circle" size={20} color="gray" onPress={clearDate} style={{ marginLeft: 10 }} />
        )}
      </TouchableOpacity>

      {showDatePicker && (
        <>
          {language === 'fa' ? (
            <PersianDatePicker
              mode="date"
              isGregorian={false}
              onDateChange={handlePersianDateChange}
              initialDate={selectedDate || new Date()}
            />
          ) : (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: '#F6F6F6',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#F6F6F6',
  },
});

export default DatePickerComponent;
