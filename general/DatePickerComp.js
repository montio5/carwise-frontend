import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jalaali from 'jalaali-js';
import DateTimePicker from '@react-native-community/datetimepicker';

// Persian months
const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

// Days in each month for a non-leap year in the Persian calendar
const daysInMonth = (month) => {
  if (month >= 0 && month <= 5) return 31; // First six months have 31 days
  if (month >= 6 && month <= 10) return 30; // Next five months have 30 days
  return 29; // Esfand has 29 days (non-leap year)
};

// Convert from Persian date to Gregorian date using jalaali-js with day adjustment
const toGregorianDate = (year, month, day) => {
  const gregorianDate = jalaali.toGregorian(year, month + 1, day); // jalaali-js uses 1-indexed months
  
  // Create the date in UTC to avoid timezone issues
  return new Date(Date.UTC(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd));
};

// Convert from Gregorian date to Persian date using jalaali-js
const toPersianDate = (gregorianDate) => {
  const persianDate = jalaali.toJalaali(gregorianDate.getUTCFullYear(), gregorianDate.getUTCMonth() + 1, gregorianDate.getUTCDate());
  return {
    year: persianDate.jy,
    month: persianDate.jm - 1, // jalaali-js uses 1-indexed months
    day: persianDate.jd
  };
};

const DatePickerComponent = ({ label, date, onDateChange, placeholder, clearable, style }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [language, setLanguage] = useState('fa'); // Default to 'fa'
  const [isPersian, setIsPersian] = useState(false);

  // Persian date state
  const [selectedYear, setSelectedYear] = useState(1400); // Default Persian year
  const [selectedMonth, setSelectedMonth] = useState(0); // Default month (Farvardin)
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const fetchLanguage = async () => {
      const appLanguage = await AsyncStorage.getItem('appLanguage') || 'fa';
      setLanguage(appLanguage);
      setIsPersian(appLanguage === 'fa');

      if (appLanguage === 'fa' && date) {
        const persianDate = toPersianDate(date);
        setSelectedYear(persianDate.year);
        setSelectedMonth(persianDate.month);
        setSelectedDay(persianDate.day);
      }
    };
    fetchLanguage();
  }, [date]);

  const handleDateChange = (day) => {
    setSelectedDay(day);
    setShowDatePicker(false);
    
    const gregorianDate = toGregorianDate(selectedYear, selectedMonth, day);
    onDateChange(gregorianDate);
  };

  const handleGregorianDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  const clearDate = () => {
    onDateChange(null);
  };

  const renderDays = () => {
    const days = [];
    for (let i = 1; i <= daysInMonth(selectedMonth); i++) {
      days.push(
        <TouchableOpacity
          key={i}
          style={[styles.day, selectedDay === i && styles.selectedDay]}
          onPress={() => handleDateChange(i)}
        >
          <Text style={styles.dayText}>{i}</Text>
        </TouchableOpacity>
      );
    }
    return days;
  };

  const renderYearSelector = () => {
    const years = [];
    for (let i = selectedYear - 10; i <= selectedYear + 10; i++) {
      years.push(
        <TouchableOpacity key={i} style={styles.yearOption} onPress={() => setSelectedYear(i)}>
          <Text style={styles.yearText}>{i}</Text>
        </TouchableOpacity>
      );
    }
    return (
      <ScrollView style={styles.yearScrollView}>
        {years}
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
        <Icon name="calendar" size={20} color="black" style={{ marginRight: 10 }} />
        <Text>
          {date
            ? isPersian
              ? `${selectedDay} ${persianMonths[selectedMonth]} ${selectedYear}`
              : date.toDateString()
            : placeholder}
        </Text>
        {clearable && date && (
          <Icon name="close-circle" size={20} color="gray" onPress={clearDate} style={{ marginLeft: 10 }} />
        )}
      </TouchableOpacity>

      {isPersian ? (
        <Modal visible={showDatePicker} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.persianCalendar}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => setSelectedMonth((prev) => (prev - 1 + 12) % 12)}>
                  <Icon name="chevron-back" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.monthText}>{persianMonths[selectedMonth]} {selectedYear}</Text>
                <TouchableOpacity onPress={() => setSelectedMonth((prev) => (prev + 1) % 12)}>
                  <Icon name="chevron-forward" size={20} color="black" />
                </TouchableOpacity>
              </View>

              <View style={styles.daysContainer}>
                {renderDays()}
              </View>

              <Text style={styles.yearTitle}>انتخاب سال</Text>
              {renderYearSelector()}

              <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>بستن</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : (
        showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={handleGregorianDateChange}
          />
        )
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  persianCalendar: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthText: {
    fontSize: 18,
    color: 'black',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  day: {
    width: '13%',
    margin: 2,
    padding: 10,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  selectedDay: {
    backgroundColor: '#4CAF50',
  },
  dayText: {
    fontSize: 16,
    color: '#000',
  },
  yearTitle: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  yearScrollView: {
    maxHeight: 100,
  },
  yearOption: {
    padding: 10,
    textAlign: 'center',
    justifyContent: 'center',
  },
  yearText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF5733',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DatePickerComponent;
