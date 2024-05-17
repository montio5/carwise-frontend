import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomFieldScreen = () => {
  const [name, setName] = useState('');
  const [mileagePerChange, setMileagePerChange] = useState('');
  const [monthPerChangeYear, setMonthPerChangeYear] = useState('');
  const [monthPerChangeMonth, setMonthPerChangeMonth] = useState('');
  const [lastMileageChanged, setLastMileageChanged] = useState('');  
  const [lastDateChanged, setLastDateChanged] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setLastDateChanged(selectedDate);
    setShowDatePicker(false); // Close the date picker after selecting a date
  };

  const handleSave = () => {
    // Here you can implement your logic to save the form data
    console.log('Form data saved!');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="Enter name"
        />

        <Text style={styles.label}>Mileage per change:</Text>
        <TextInput
          style={styles.input}
          value={mileagePerChange.toString()}
          onChangeText={(text) => setMileagePerChange(parseInt(text, 10))}
          placeholder="Enter mileage per change"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Duration per changes:</Text>
        <View style={styles.monthPerChangeContainer}>
          <TextInput
            style={[styles.input, styles.monthInput]}
            value={monthPerChangeYear.toString()}
            onChangeText={(text) => setMonthPerChangeYear(parseInt(text, 10))}
            placeholder="Year"
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.monthInput]}
            value={monthPerChangeMonth.toString()}
            onChangeText={(text) => setMonthPerChangeMonth(parseInt(text, 10))}
            placeholder="Month"
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.label}>Last mileage changed:</Text>
        <TextInput
          style={styles.input}
          value={lastMileageChanged.toString()}
          onChangeText={(text) => setLastMileageChanged(parseInt(text, 10))}
          placeholder="Enter last mileage changed"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Last date changed:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
          <Icon name="calendar" size={20} color="black" style={{ marginRight: 10 }} />
          <Text>{lastDateChanged.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={lastDateChanged}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </ScrollView>
      
      <View style={styles.bottomContainer}>
        <Button title="Save" onPress={handleSave} />
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
