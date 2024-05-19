import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getNotifications } from '../../api/UserCar';

const NotificationScreen = () => {
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getNotifications();
        setCarData(Object.values(data).flatMap(car => Object.values(car)));
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch car data');
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const renderNotification = ({ item }) => (
    <View style={styles.notificationContainer}>
      <Ionicons name={getStatusIcon(item.status)} size={30} color={getStatusColor(item.status)} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.field_name} - {item.car}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>{item.status}</Text>
      </View>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Serious':
        return 'red';
      case 'Medium':
        return 'orange';
      case 'Informational':
        return 'blue';
      default:
        return 'black';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Serious':
        return 'alert-circle';
      case 'Medium':
        return 'warning';
      case 'Informational':
        return 'information-circle';
      default:
        return 'help-circle';
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={carData}
        renderItem={renderNotification}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContainer: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    marginVertical: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default NotificationScreen;
