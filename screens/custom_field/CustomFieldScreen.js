import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createCustomField, getCustomField, updateCustomField } from '../../api/UserCar';
import CustomButton from '../../general/customButtonComponent';
import InputComponent from '../../general/customInputComponent';
import DatePickerComponent from '../../general/DatePickerComp';
import Separator from '../../general/speratorComponent';
import Toast from '../../general/Toast';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomFieldScreen = ({ route, navigation }) => {
  const car = route.params.car || null;
  const customField = route.params.customField || null;
  const toastRef = useRef();
  const { t } = useTranslation();
  
  // Determine language and layout direction
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const setLayoutDirection = async () => {
      const language = await AsyncStorage.getItem('appLanguage') || 'fa';
      const isLanguageRTL = language === 'fa';
      
      setIsRTL(isLanguageRTL);
      
      I18nManager.forceRTL(isLanguageRTL); // Set the layout direction
    };
    
    setLayoutDirection();
  }, []);

  // Status options with icons
const STATUS_OPTIONS = [
  { label: t("customFieldScreenStrings.statusInformation"), value: 'INF', icon: 'information-circle-outline', color: '#34C759' }, // Green for Information
  { label: t("customFieldScreenStrings.statusMedium"), value: 'MED', icon: 'alert-circle-outline', color: '#FFA500' }, // Orange for Medium
  { label: t("customFieldScreenStrings.statusSerious"), value: 'SER', icon: 'warning-outline', color: '#FF3B30' }, // Red for Serious
];

  const [name, setName] = useState('');
  const [mileagePerChange, setMileagePerChange] = useState('');
  const [monthPerChangeYear, setMonthPerChangeYear] = useState('');
  const [monthPerChangeMonth, setMonthPerChangeMonth] = useState('');
  const [lastMileageChanged, setLastMileageChanged] = useState('');
  const [lastDateChanged, setLastDateChanged] = useState(null);
  const [status, setStatus] = useState('INF'); // Default status: Information
  const [isFormValid, setIsFormValid] = useState(false);
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);

  useEffect(() => {
    if (customField) {
      getCustomField(car.unique_key, customField.id)
        .then((data) => {
          setName(data.name || '');
          setMileagePerChange(data.mileage_per_change ? data.mileage_per_change.toString() : '');
          setMonthPerChangeYear(data.month_per_changes ? Math.floor(data.month_per_changes / 12).toString() : '');
          setMonthPerChangeMonth(data.month_per_changes ? (data.month_per_changes % 12).toString() : '');
          setLastMileageChanged(data.last_mileage_changed ? data.last_mileage_changed.toString() : '');
          setLastDateChanged(data.last_date_changed ? new Date(data.last_date_changed) : null);
          setStatus(data.status || 'INF'); // Set status from data or default to "INF"
        })
        .catch((error) => console.error('Error fetching custom field:', error));
    }
  }, [customField, car.unique_key]);

  // Validate form: Make sure at least name and status are filled in
  useEffect(() => {
    setIsFormValid(name.trim() !== '');
  }, [name, mileagePerChange, lastMileageChanged, status]);

  const handleSave = () => {
    const cleanedCarData = {
      name,
      mileage_per_change: mileagePerChange ? parseFloat(mileagePerChange) : null,
      last_mileage_changed: lastMileageChanged ? parseFloat(lastMileageChanged) : null,
      last_date_changed: lastDateChanged ? lastDateChanged.toISOString().split('T')[0] : null,
      status, // Add status to the data being saved
    };

    const monthPerChangeYearValue = monthPerChangeYear ? parseInt(monthPerChangeYear, 10) : 0;
    const monthPerChangeMonthValue = monthPerChangeMonth ? parseInt(monthPerChangeMonth, 10) : 0;
    const finalValue = monthPerChangeMonthValue + monthPerChangeYearValue * 12;
    if (finalValue !== 0) {
      cleanedCarData.month_per_changes = finalValue;
    }

    const apiCall = customField
      ? updateCustomField(car.unique_key, customField.id, cleanedCarData, t)
      : createCustomField(car.unique_key, cleanedCarData, t);

    apiCall
      .then(() => {
        navigation.navigate('CustomFieldList', { refresh: true, car: car, toastMessage: t("savedSuccessfully") });
      })
      .catch((error) => {
        const errorMessage = typeof error === 'string' ? error : error.message;
        toastRef.current.error(errorMessage || t("customFieldScreenStrings.errorFetchingCustomField") || 'Error');
      });
  };

  const renderStatusOptions = () => (
  <Modal
    visible={isStatusModalVisible}
    animationType="slide"
    transparent={true}
    onRequestClose={() => setStatusModalVisible(false)}
  >
    {/* TouchableOpacity to close modal when pressing outside */}
    <TouchableOpacity 
      style={styles.modalContainer} 
      activeOpacity={1} 
      onPressOut={() => setStatusModalVisible(false)} // Close modal on press outside
    >
      {/* This TouchableOpacity prevents closing the modal when pressing inside */}
      <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
        {STATUS_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.statusOption}
            onPress={() => {
              setStatus(option.value);
              setStatusModalVisible(false);
            }}
          >
            {/* Change the icon color based on the option */}
            <Ionicons name={option.icon} size={24} color={option.color} style={styles.statusIcon} />
            <Text style={styles.statusText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <InputComponent
            isNumeric={false}
            value={name}
            placeholder={t("customFieldScreenStrings.namePlaceholder")}
            label={t("customFieldScreenStrings.name")}
            onChange={setName}
          />
        </View>

        {/* Status Picker with Custom Modal */}
        <View style={styles.card}>
          <View style={[styles.row, isRTL && styles.rowRTL]}>
            <Text style={styles.label}>{t("customFieldScreenStrings.status")}</Text>
            <TouchableOpacity
              style={styles.statusPicker}
              onPress={() => setStatusModalVisible(true)}
            >
              {/* Dynamically apply the icon and color based on the current selected status */}
              <Ionicons 
                name={STATUS_OPTIONS.find(option => option.value === status).icon} 
                size={24} 
                color={STATUS_OPTIONS.find(option => option.value === status).color} // Apply color dynamically
                style={styles.statusIcon} 
              />
              <Text style={styles.statusPickerText}>
                {STATUS_OPTIONS.find(option => option.value === status).label}
              </Text>
              <Ionicons name="chevron-down" size={24} color="#F6F6F6" style={styles.chevronIcon} />
            </TouchableOpacity>
          </View>
        </View>


        <Separator text={t("customFieldScreenStrings.mileageBase")} />
        <View style={styles.card}>
          <InputComponent
            isNumeric={true}
            value={mileagePerChange}
            placeholder={t("customFieldScreenStrings.mileagePlaceholder")}
            label={t("customFieldScreenStrings.mileagePerChange")}
            onChange={setMileagePerChange}
          />
          <InputComponent
            isNumeric={true}
            value={lastMileageChanged}
            placeholder={t("customFieldScreenStrings.lastMileagePlaceholder")}
            label={t("customFieldScreenStrings.lastMileageChanged")}
            onChange={setLastMileageChanged}
          />
        </View>

        <Separator text={t("customFieldScreenStrings.dateBase")} />
        <View style={styles.card}>
          <Text style={styles.label}>{t("customFieldScreenStrings.durationPerChange")}</Text>
          <View style={styles.monthPerChangeContainer}>
            <InputComponent
              isNumeric={true}
              style={[styles.input, styles.monthInput]}
              value={monthPerChangeYear}
              placeholder={t("customFieldScreenStrings.yearPlaceholder")}
              onChange={setMonthPerChangeYear}
            />
            <InputComponent
              isNumeric={true}
              style={[styles.input, styles.monthInput]}
              value={monthPerChangeMonth}
              placeholder={t("customFieldScreenStrings.monthPlaceholder")}
              onChange={setMonthPerChangeMonth}
            />
          </View>

          <DatePickerComponent
            label={t("customFieldScreenStrings.lastChangedDate")}
            date={lastDateChanged}
            onDateChange={setLastDateChanged}
            placeholder={t("customFieldScreenStrings.selectDateText")}
            clearable={true}
            style={styles.datePickerComponent}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <CustomButton
          text={t("customFieldScreenStrings.saveButton")}
          onPress={handleSave}
          disabled={!isFormValid}
          style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]} // Button disabled when form invalid
        />
      </View>
      {renderStatusOptions()}
      <Toast ref={toastRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#24292F',
  },
  contentContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#3a3f44',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowRTL: {
    flexDirection: 'row-reverse', // For RTL
  },
  label: {
    fontSize: 16,
    color: '#F6F6F6',
  },
  statusPicker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusPickerText: {
    color: '#F6F6F6',
    marginLeft: 10,
    marginRight: 5,
  },
  chevronIcon: {
    marginLeft: 5,
  },
  statusIcon: {
    marginRight: 10,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  statusText: {
    fontSize: 16,
    color: '#F6F6F6',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#3a3f44',
    borderRadius: 10,
    padding: 20,
  },
  monthPerChangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthInput: {
    flex: 1,
    marginRight: 10,
  },
  datePickerComponent: {
    marginTop: 10,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default CustomFieldScreen;
