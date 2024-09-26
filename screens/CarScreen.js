import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getCarDashboard } from '../api/CarSetup';
import FormattedNumber from '../general/textNumber';
import Toast from '../general/Toast';
import { ChartWithDate, ChartWithDateOnly, ChartWithPercentageOnly } from '../general/ChartComponents';
import {useTranslation} from 'react-i18next'

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
  
  // Dropdown Animation State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
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

  const goToCarSetupScreen = () => {
    navigation.navigate('CarSetupScreen', { car: car });
  };

  const goToEditCarInfoScreen = () => {
    navigation.navigate('AddEditCarInfoFirstScreen', { car: car });
  };

  const goToUpdateCarToolScreen = () => {
    navigation.navigate('UpdateCarToolScreen', { car: car });
  };

  // Function to toggle dropdown
  const toggleDropdown = () => {
    if (isDropdownOpen) {
      Animated.timing(dropdownAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.ease,
      }).start(() => setIsDropdownOpen(false));
    } else {
      setIsDropdownOpen(true);
      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.ease,
      }).start();
    }
  };

  // Dropdown style interpolation
  const dropdownHeight = dropdownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100], // Height of dropdown when opened (adjust as needed)
  });

  return (
    <View style={styles.container}>
      <Toast ref={toastRef} />

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Hamburger Menu only after loading */}
        {!loading && (
          <View style={styles.topLeftContainer}>
            <TouchableOpacity onPress={toggleDropdown} style={styles.hamburgerButton}>
              <Ionicons name="menu" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {!loading && (
          <FormattedNumber
            number={mileage}
            suffix={""}
            style={styles.mileageText}
          />
        )}

        {/* Animated Dropdown Menu */}
        {isDropdownOpen && (
          <Animated.View style={[styles.dropdownMenu, { height: dropdownHeight }]}>
            <TouchableOpacity onPress={goToCarSetupScreen} style={styles.dropdownItem}>
              <Ionicons name="settings-outline" size={20} color="black" />
              <Text style={styles.dropdownText}>
                {t("carDetialScreenStrings.carSetupButton")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={goToEditCarInfoScreen} style={styles.dropdownItem}>
              <Ionicons name="create-outline" size={20} color="black" />
              <Text style={styles.dropdownText}>
                {t("carDetialScreenStrings.editInfoButton")}
              </Text>
            </TouchableOpacity>
          </Animated.View>
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
  topLeftContainer: {
    position: 'absolute',
    top: 5,
    left: 20,
    zIndex: 1,
  },
  hamburgerButton: {
    padding: 5, // Reduced padding
    borderRadius: 5, // Removed background color
  },
  dropdownMenu: {
      position: 'absolute',   // Ensure the dropdown overlays other content
      top: 50,                // Position it below the hamburger (adjust as needed)
      left: 20,              // Align it with the right side (adjust based on your needs)
      backgroundColor: '#F6F6F6',
      borderRadius: 5,
      zIndex: 1000,           // High z-index to ensure it appears above other elements
      width: 'auto',          // Auto width to fit content
      minWidth: 150,          // Set a minimum width to match the largest button
      shadowColor: '#000',    // Add shadow for better visibility
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,           // Android elevation for shadow
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ccc',
    // borderBottomWidth: 1,
  },
  dropdownText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
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
