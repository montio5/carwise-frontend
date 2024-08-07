// CarsListScreen.js

import React, { useState, useEffect, useCallback,useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { fetchUserCars } from '../../api/UserCar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import carCompanyColors from '../../general/colors';
import { strings } from '../../utils/strings'; 
import Toast from '../../general/Toast';

const CarsListScreen = ({ route }) => {
  const [userCars, setUserCars] = useState([]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const toastRef = useRef(null);

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
      Alert.alert(strings.carsListScreenStrings.errorFetchingCars);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (route.params?.refresh) {
        fetchData();
      }
      if (route.params?.toastMessage) {
        toastRef.current.success(route.params.toastMessage);
        route.params.toastMessage=null;
      }

    }, [route.params])
  );

  useEffect(() => {
    fetchData();
  }, []);

  const handlePress = (item) => {
    navigation.navigate('CarScreen', { car: item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)} style={styles.itemContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="car-sport" size={40} color={getCompanyColor(item.car_company)} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.carCompany, { color: getCompanyColor(item.car_company) }]}>
          {item.car_company}
        </Text>
        <Text style={styles.carName}>{item.car_model}</Text>
        <Text></Text>
        <Text style={styles.carName}>{item.name}</Text>
        <Text style={styles.carName}>{item.mileage}</Text>

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
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
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
  carName: {
    fontSize: 14,
    color: '#666',
  },
});

export default CarsListScreen;
