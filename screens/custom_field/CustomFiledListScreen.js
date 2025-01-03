import React, { useState, useEffect, useCallback,useRef} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { getCustomFieldList } from '../../api/UserCar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from '../../general/Toast';
import { useTranslation } from 'react-i18next';

const CustomFiledListScreen = ({ route }) => {
  const [userCars, setUserCars] = useState([]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const car = route.params.car;
  const toastRef = useRef(null);
  const { t, i18n } = useTranslation();

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const fetchData = async () => {
    try {
      const data = await getCustomFieldList(car.unique_key);
      setUserCars(data);
    } catch (error) {
      console.error('Error fetching user cars:', error);
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
    navigation.navigate('CustomField', { car:car, customField : item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)} style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.carName}>{item.name}</Text>
      </View>
      <View style={styles.iconsContainer}>
        {item.last_date_changed && (
          <Ionicons name="calendar" size={24} color="#4CAF50" style={styles.icon} />
        )}
        {item.last_mileage_changed && (
          <Ionicons name="speedometer" size={24} color="#FF9800" style={styles.icon} />
        )}
      </View>
    </TouchableOpacity>
  );

return (
  <View style={styles.container}>
    <Toast ref={toastRef} />
    <FlatList
      data={userCars}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={userCars.length === 0 ? styles.emptyContainer : styles.listContent}
      ListEmptyComponent={() => (
        <Text style={styles.emptyMessage}>{t("emptyCustomField")}</Text>
      )}
    />
  </View>
);
}

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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  carName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
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

export default CustomFiledListScreen;
