import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator ,RefreshControl} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getCarDashboard } from '../api/CarSetup';  // Import the API function
import FormattedNumber from '../general/textNumber';  
import { strings } from '../utils/strings'; // Adjust the path as per your project structure
import Toast from '../general/Toast';
import { ChartWithDate, ChartWithDateOnly, ChartWithPercentageOnly } from '../general/ChartComponents'; // Import the new components

const CarDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const car = route.params.car;
  const [mileage, setMileage] = useState();
  const toastRef = useRef(null);

  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };


  useFocusEffect(
    useCallback(() => {
      if (route.params?.refresh) {
        fetchDashboardData();
      }
      if (route.params?.toastMessage) {
        toastRef.current.success(route.params.toastMessage);
        route.params.toastMessage = null;
      }
    }, [route.params])
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await getCarDashboard(car.unique_key);
      setMileage(data.mileage);
      if (Array.isArray(data.statistic)) {
        setDashboardData(data.statistic);
      } else {
        setError('Unexpected data format received');
      }
      setLoading(false);
    } catch (error) {
      setError('Error fetching user car dashboard');
      setLoading(false);
    }
  };

  const getColorForPct = (pct) => {
    if (pct === 'overdue') return '#FF3737'; // Red
    if (pct < 50) return '#34C759'; // Green
    if (pct < 90) return 'gray'; 
    if (pct <= 95) return '#FFC107'; // orange
    if (pct > 95) return '#FF3737'; // Red
  };

  const goToCustomFieldScreen = () => {
    navigation.navigate('CustomFieldList', { car: car });
  };

  const goToCarSetupScreen = () => {
    navigation.navigate('CarSetupScreen', { car: car });
  };

  const goToEditCarInfoScreen = () => {
    navigation.navigate('AddEditCarInfoFirstScreen', { car: car });
  };

  const goToUpdateCarToolScreen = () => {
    navigation.navigate('UpdateCarToolScreen', { car: car });
  };

  return (
    <View style={styles.container}>
      <Toast ref={toastRef} />

      <ScrollView         refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {!loading && <FormattedNumber number={mileage} suffix={strings.carDetialScreenStrings.mileageSuffix} style={styles.mileageText} />}
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={goToCustomFieldScreen} style={styles.button}>
            <View style={styles.buttonContainer}>
              <Ionicons name="add-circle-outline" size={24} color="black" />
              <Text style={styles.buttonText}>{strings.carDetialScreenStrings.customFieldButton}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToCarSetupScreen} style={styles.button}>
            <View style={styles.buttonContainer}>
              <Ionicons name="settings-outline" size={24} color="black" />
              <Text style={styles.buttonText}>{strings.carDetialScreenStrings.carSetupButton}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={goToEditCarInfoScreen} style={styles.button}>
            <View style={styles.buttonContainer}>
              <Ionicons name="create-outline" size={24} color="black" />
              <Text style={styles.buttonText}>{strings.carDetialScreenStrings.editInfoButton}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToUpdateCarToolScreen} style={styles.button}>
            <View style={styles.buttonContainer}>
              <Ionicons name="build-outline" size={24} color="black" />
              <Text style={styles.buttonText}>{strings.carDetialScreenStrings.updateToolButton}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.errorText}>{strings.carDetialScreenStrings.errorText}</Text>
        ) : (
          dashboardData.map((item, index) => {
            const hasDateAndPct = item.date_pct && item.pct !== undefined;
            const isDateItem = item.date && item.date_limit && item.pct === undefined;
            const colorPct = getColorForPct(item.pct);
            const colorDatePct = getColorForPct(item.date_pct);

            return (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.nameText}>{item.name}</Text>
                {hasDateAndPct ? (
                  <ChartWithDate
                    colorDate={colorDatePct}
                    percentageDate={item.date_pct}
                    dateLimit={item.date_limit}
                    colorPct={colorPct}
                    percentage={item.pct}
                    limit={item.limit}
                  />
                ) : isDateItem ? (
                  <ChartWithDateOnly
                    colorDate={colorDatePct}
                    percentageDate={item.date_pct}
                    dateLimit={item.date_limit}
                  />
                ) : (
                  <ChartWithPercentageOnly
                    colorPct={colorPct}
                    percentage={item.pct}
                    limit={item.limit}
                  />
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mileageText: {
    margin: 40,
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    width: '48%',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  nameText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CarDetailScreen;
