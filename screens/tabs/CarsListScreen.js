import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity } from 'react-native';
import { fetchUserCars } from '../../api/UserCar'; 
import { useNavigation } from '@react-navigation/native';

const CarsListScreen = () => {
  const [userCars, setUserCars] = useState([]);
  const navigation = useNavigation(); // Get navigation object

  // Load list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserCars();
        setUserCars(data);
      } catch (error) {
        // Handle errors
      }
    };
    fetchData();
  }, []);

    // Function to handle press event
    const handlePress = (item) => {
      navigation.navigate('CarScreen', { car: item });
    };

    const renderItem = ({ item }) => (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <View style={styles.item}>
          <Text>Car Company: {item.car_company}</Text>
          <Text>Name: {item.name}</Text>
        </View>
      </TouchableOpacity>
    );


  return (
    <View style={styles.container}>
      <FlatList
        data={userCars}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()} // Use index as key if id is not available
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default CarsListScreen;
