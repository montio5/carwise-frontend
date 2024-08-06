// ChartComponents.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FormattedNumber from '../general/textNumber';  

const Chart = ({ color, width, percentage }) => (
  <View style={styles.chartContainer}>
    <View style={[styles.chart, { backgroundColor: color, width: `${percentage === 'overdue' ? 100 : percentage}%` }]}></View>
    <Text style={styles.chartText}>{percentage === 'overdue' ? '100%' : `${percentage}%`}</Text>
  </View>
);

const ChartWithDate = ({ colorDate, percentageDate, dateLimit, colorPct, percentage, limit }) => (
  <>
    <Chart color={colorDate} width={percentageDate} percentage={percentageDate} />
    <Text style={styles.limitText}>
      <Ionicons name="calendar-outline" size={20} color={colorDate} style={styles.icon} /> {dateLimit}
    </Text>
    <Text>{'\n'}</Text>
    <Chart color={colorPct} width={percentage} percentage={percentage} />
    <Text style={styles.limitText}>
      <Ionicons name="refresh-circle-outline" size={20} color={colorPct} style={styles.icon} /> 
      <FormattedNumber number={limit} style={styles.limitText} />
    </Text>
  </>
);

const ChartWithDateOnly = ({ colorDate, percentageDate, dateLimit }) => (
  <>
    <Chart color={colorDate} width={percentageDate} percentage={percentageDate} />
    <Text style={styles.limitText}>
      <Ionicons name="calendar-outline" size={20} color={colorDate} style={styles.icon} /> {dateLimit}
    </Text>
  </>
);

const ChartWithPercentageOnly = ({ colorPct, percentage, limit }) => (
  <>
    <Chart color={colorPct} width={percentage} percentage={percentage} />
    <Text style={styles.limitText}>
      <Ionicons name="refresh-circle-outline" size={20} color={colorPct} style={styles.icon} /> 
      <FormattedNumber number={limit} style={styles.limitText} />
    </Text>
  </>
);

const styles = StyleSheet.create({
  chartContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
    position: 'relative',
    justifyContent: 'center',
  },
  chart: {
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  chartText: {
    width: '100%',
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  limitText: {
    textAlign: 'left',
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  icon: {
    marginTop: 35
  }
});

export { Chart, ChartWithDate, ChartWithDateOnly, ChartWithPercentageOnly };
