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

const ChartWithDate = ({ colorDate, percentageDate, dateLimit, colorPct, percentage, limit, desc }) => (
  <>
    <Chart color={colorDate} width={percentageDate} percentage={percentageDate} />
    <View style={styles.rowContainer}>
      <View style={styles.leftContainer}>
        <Ionicons name="calendar-outline" size={20} color={colorDate} style={styles.icon} />
        <Text style={styles.limitText}>{dateLimit}</Text>
      </View>
    </View>
    <Text>{'\n'}</Text>
    <Chart color={colorPct} width={percentage} percentage={percentage} />
    <View style={styles.rowContainer}>
      <View style={styles.leftContainer}>
        <Ionicons name="refresh-circle-outline" size={20} color={colorPct} style={styles.icon} />
        <FormattedNumber number={limit} style={styles.limitText} />
      </View>
      <Text style={styles.descText}>{desc}</Text>
    </View>
  </>
);

const ChartWithDateOnly = ({ colorDate, percentageDate, dateLimit }) => (
  <>
    <Chart color={colorDate} width={percentageDate} percentage={percentageDate} />
    <View style={styles.rowContainer}>
      <View style={styles.leftContainer}>
        <Ionicons name="calendar-outline" size={20} color={colorDate} style={styles.icon} />
        <Text style={styles.limitText}>{dateLimit}</Text>
      </View>
    </View>
  </>
);

const ChartWithPercentageOnly = ({ colorPct, percentage, limit, desc }) => (
  <>
    <Chart color={colorPct} width={percentage} percentage={percentage} />
    <View style={styles.rowContainer}>
      <View style={styles.leftContainer}>
        <Ionicons name="refresh-circle-outline" size={20} color={colorPct} style={styles.icon} />
        <FormattedNumber number={limit} style={styles.limitText} />
      </View>
      <Text style={styles.descText}>{desc}</Text>
    </View>
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
    fontSize: 14,
    color: 'white',
  },
  icon: {
    marginRight: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Make left container take up available space
  },
  descText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'right', // Align the text to the right
    flex: 1, // Make the description take up available space
  },
});

export { Chart, ChartWithDate, ChartWithDateOnly, ChartWithPercentageOnly };
