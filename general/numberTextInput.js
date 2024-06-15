import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

const formatNumber = (num) => {
  return num !== undefined ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
};

const NumericTextInput = ({ value, placeholder, onChangeText, style }) => {
  const [formattedValue, setFormattedValue] = useState(formatNumber(value));

  const handleTextChange = (text) => {
    // Remove non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    // Format the numeric value with commas
    const formatted = formatNumber(numericValue);
    setFormattedValue(formatted);
    onChangeText(numericValue);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={formattedValue}
        placeholder={placeholder}
        keyboardType="numeric"
        onChangeText={handleTextChange}
        style={[styles.textInput, style]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default NumericTextInput;
