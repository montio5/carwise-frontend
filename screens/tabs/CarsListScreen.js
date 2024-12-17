import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { fetchUserCars } from '../../api/UserCar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import carCompanyColors from '../../general/colors';
import Toast from '../../general/Toast';
import { useTranslation } from 'react-i18next';
import FormattedNumber from '../../general/textNumber';

const CarsListScreen = ({ route }) => {
  const [userCars, setUserCars] = useState([]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const toastRef = useRef(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa'; // Check if the language is Farsi (RTL)

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const fetchData = async () => {
    try {
      const data = await fetchUserCars();
      setUserCars(data);
    } catch (error) {
      console.error('Error fetching user cars:', error);
      toastRef.current.error(t('carsListScreenStrings.errorFetchingCars'));
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (route.params?.refresh) {
        fetchData();
      }
      if (route.params?.toastMessage) {
        toastRef.current.success(route.params.toastMessage);
        route.params.toastMessage = null;
      }
    }, [route.params])
  );

  useEffect(() => {
    fetchData();
  }, []);

  const handlePress = (item) => {
    navigation.navigate('CarScreen', { car: item, has_video: item.has_video,car_model: item.car_model_id });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)} style={styles.itemContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="car-sport" size={40} color={getCompanyColor(item.car_company)} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.carCompany, { color: getCompanyColor(item.car_company) }]}>{item.car_company}</Text>
        <Text style={styles.carModel}>{item.car_model}</Text>
        <View style={[styles.textRow, isRTL && styles.rtlRow]}>
          <Ionicons name="person" size={18} color="#4B9CD3" style={styles.iconStyle} />
          <Text style={styles.carName}>{item.name}</Text>
        </View>
        <View style={[styles.textRow, isRTL && styles.rtlRow]}>
          <Ionicons name="speedometer" size={18} color="#4CAF50" style={styles.iconStyle} />
          <FormattedNumber number={item.mileage} suffix={""} style={styles.carName} />
        </View>
        <View style={[styles.textRow, isRTL && styles.rtlRow]}>
          <Ionicons name="calendar" size={18} color="#FFA500" style={styles.iconStyle} />
          <Text style={styles.carName}>{item.car_mileage_update_date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getCompanyColor = (company) => {
    return carCompanyColors[company] || '#000'; // Default to black if no color is defined
  };

  return (
    <View style={styles.container}>
      <Toast ref={toastRef} />
      <FlatList
        data={userCars}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={userCars.length === 0 ? styles.emptyContainer : styles.listContent}
        ListEmptyComponent={() => (
          <Text style={styles.emptyMessage}>{t('emptyCars')}</Text>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#24292F',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    padding: 15,
    margin: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  carCompany: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  carModel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 14,
  },
  carName: {
    fontSize: 14,
    color: '#666',
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  rtlRow: {
    flexDirection: 'row-reverse', // Full reverse for RTL 
    marginRight: 1,
  },
  iconStyle: {
    marginHorizontal: 8, // Space between icon and text
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  },
  emptyMessage: {
    fontSize: 18,
    color: '#666',
  },
});

export default CarsListScreen;
