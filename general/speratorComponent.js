// Separator.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Separator = ({ text="" }) => (
  <View style={styles.separator}>
    <View style={styles.line} />
    {text ? <Text style={styles.text}>{text}</Text> : null}
    <View style={styles.line} />
  </View>
);

const styles = StyleSheet.create({
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'gray',
  },
  text: {
    marginHorizontal: 8,
    fontSize: 16,
    color: 'gray',
  },
});

export default Separator;
