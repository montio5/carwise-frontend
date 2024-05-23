import React from 'react';
import { View, TextInput, Button, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation,useRoute } from '@react-navigation/native';

const CarDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const car = route.params.car;

  
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
      <View >

      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={goToCustomFieldScreen} style={styles.button}>
          <View style={styles.buttonContainer}>
            <Ionicons name="add-circle-outline" size={24} color="black" />
            <Text style={styles.buttonText}>Custom Field</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToCarSetupScreen} style={styles.button}>
          <View style={styles.buttonContainer}>
            <Ionicons name="settings-outline" size={24} color="black" />
            <Text style={styles.buttonText}>Car Setup</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={goToEditCarInfoScreen} style={styles.button}>
          <View style={styles.buttonContainer}>
            <Ionicons name="create-outline" size={24} color="black" />
            <Text style={styles.buttonText}>Edit Info</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToUpdateCarToolScreen} style={styles.button}>
          <View style={styles.buttonContainer}>
            <Ionicons name="build-outline" size={24} color="black" />
            <Text style={styles.buttonText}>Update Tool</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* <TextInput style={styles.textInput} placeholder="Enter custom text" /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
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
});

export default CarDetailScreen;
