import React from 'react';
import { Text, StyleSheet } from 'react-native';

const formatNumber = (num) => {
  return num !== undefined ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'N/A';
};

const FormattedNumber = ({ number, suffix = '', style }) => {
  return (
    <Text style={style}>
      {formatNumber(number)}
      <Text style={styles.suffix}>{` ${suffix}`}</Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  suffix: {
    fontSize: 20,
    fontWeight: 'normal',
  },
});

export default FormattedNumber;
