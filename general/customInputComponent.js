// InputComponent.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const InputComponent = ({ isNumeric, value = "", placeholder, label = "", style, onChange }) => {
  const [displayValue, setDisplayValue] = useState(value.toString());

  useEffect(() => {
    if (isNumeric) {
      setDisplayValue(formatNumber(value));
    } else {
      setDisplayValue(value.toString());
    }
  }, [value, isNumeric]);

  const handleChange = (text) => {
    if (isNumeric) {
      const rawValue = text.replace(/,/g, '');
      if (!isNaN(rawValue)) {
        setDisplayValue(formatNumber(rawValue));
        onChange(rawValue);
      }
    } else {
      setDisplayValue(text);
      onChange(text);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={displayValue}
        onChangeText={handleChange}
        keyboardType={isNumeric ? 'numeric' : 'default'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
});

export default InputComponent ;
