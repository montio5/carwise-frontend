import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getNotificationlist } from '../../api/UserCar';
import {useTranslation} from 'react-i18next'

const NotificationScreen = () => {
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const fetchData = async () => {
    try {
      const data = await getNotificationlist();
      setCarData(Object.values(data).flatMap(car => Object.values(car)));
    } catch (error) {
            toastRef.current.error(t("notificationScreenStrings.errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderNotification = ({ item }) => (
    <View style={styles.notificationContainer}>
      <Ionicons name={getStatusIcon(item.status)} size={30} color={getStatusColor(item.status)} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.car}</Text>
        <Text style={styles.title}>{item.field_name}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      {getAdditionalIcon(item.field_name) || <View style={styles.additionalIconPlaceholder} />}
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
      case 'Custom':
        return 'gray';
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
      case 'Custom':
        return 'cog-outline';
      default:
        return 'help-circle';
    }
  };

  const getAdditionalIcon = (fieldName) => {
    if (!fieldName) return null;
    const lowerCaseFieldName = fieldName.toLowerCase();
    if (lowerCaseFieldName.includes(t("notificationScreenStrings.filterFieldName"))) {
      return <Ionicons name="filter" size={30} color="white" style={styles.additionalIcon} />;
    } else if (lowerCaseFieldName.includes(t("notificationScreenStrings.oilFieldName"))) {
      return <Ionicons name="water-outline" size={30} color="white" style={styles.additionalIcon} />;
    }
    return null;
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#24292F',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  additionalIcon: {
    marginLeft: 16,
  },
  additionalIconPlaceholder: {
    width: 30, // same width as the icon
    marginLeft: 16, // same margin as the icon
  },
  notificationContainer: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#333', // Darker border to match the black theme
    borderRadius: 8,
    backgroundColor: '#333', // Slightly different background color to make it look non-clickable
    // Remove any touchable feedback styles
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
    color: 'white', // Ensure text is visible against dark background
  },
  message: {
    fontSize: 14,
    marginVertical: 4,
    color: 'white', // Ensure text is visible against dark background
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default NotificationScreen;
