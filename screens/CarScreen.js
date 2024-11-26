import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getCarDashboard } from '../api/CarSetup';
import FormattedNumber from '../general/textNumber';
import Toast from '../general/Toast';
import { ChartWithDate, ChartWithDateOnly, ChartWithPercentageOnly } from '../general/ChartComponents';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
    if (pct === 'overdue') return { color: '#FF3737', description: t("carDetialScreenStrings.overdue") }; // Red for overdue
    if (pct < 50) return { color: '#34C759', description: '' }; // Green for good condition
    if (pct < 90) return { color: 'gray', description: '' }; // Gray for neutral
    if (pct <= 95) return { color: '#FFC107', description: t("carDetialScreenStrings.orangeStatus") }; // Orange for warning
    if (pct > 95) return { color: '#FF3737', description: t("carDetialScreenStrings.redStatus") }; // Red for critical
  };

  const goToCustomFieldScreen = () => {
    navigation.navigate('CustomFieldList', { car: car });
  };

  const goToUpdateCarToolScreen = () => {
    navigation.navigate('UpdateCarToolScreen', { car: car });
  };

  return (
    <View style={styles.container}>
      <Toast ref={toastRef} />

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {!loading && (
          <FormattedNumber
            number={mileage}
            suffix={""}
            style={styles.mileageText}
          />
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={goToCustomFieldScreen} style={[styles.button]}>
            <View style={styles.buttonContainer}>
              <Ionicons name="add-circle-outline" size={24} color="black" />
              <Text style={styles.buttonText}>
                {t("carDetialScreenStrings.customFieldButton")}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToUpdateCarToolScreen} style={[styles.button, styles.orangeButton]}>
            <View style={styles.buttonContainer}>
              <Ionicons name="build-outline" size={24} color="black" />
              <Text style={styles.buttonText}>
                {t("carDetialScreenStrings.updateToolButton")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.errorText}>{t("carDetialScreenStrings.errorText")}</Text>
        ) : (
          dashboardData.map((item, index) => {
            const hasDateAndPct = item.date_pct && item.pct !== undefined;
            const isDateItem = item.date && item.date_limit && item.pct === undefined;
            const colorPct = getColorForPct(item.pct)?.color;
            const colorDatePct = getColorForPct(item.date_pct)?.color;
            const pctfieldStatus = getColorForPct(item.pct)?.description;
            const datePctfieldStatus = getColorForPct(item.pct)?.description;

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
                    desc={pctfieldStatus}
                    dateDesc={datePctfieldStatus}
                  />
                ) : isDateItem ? (
                  <ChartWithDateOnly
                    colorDate={colorDatePct}
                    percentageDate={item.date_pct}
                    dateLimit={item.date_limit}
                    dateDesc={datePctfieldStatus}
                  />
                ) : (
                  <ChartWithPercentageOnly
                    colorPct={colorPct}
                    percentage={item.pct}
                    limit={item.limit}
                    desc={pctfieldStatus}
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#24292F',
  },
  mileageText: {
    margin: 40,
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#F6F6F6',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20,
  },
  button: {
    borderRadius: 5,
    width: '48%',
    elevation: 2,
    backgroundColor: '#1DFFA9',
  },
  orangeButton: {
    backgroundColor: '#FFA500',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    marginTop: 5,
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  nameText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CarDetailScreen;
