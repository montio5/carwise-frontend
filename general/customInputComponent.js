import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator'; // Import ImageManipulator for resizing/compression

const OCR_API_KEY = 'fadea523c488957'; // Your API key
const OCR_API_URL = 'https://api.ocr.space/parse/image'; // OCR API endpoint

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const InputComponent = ({
  isNumeric,
  value = "",
  placeholder,
  label = "",
  style,
  onChange,
  enableCamera = false
}) => {
  const [displayValue, setDisplayValue] = useState(value.toString());
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  // Handle initial value formatting
  useEffect(() => {
    if (isNumeric) {
      setDisplayValue(formatNumber(value));
    } else {
      setDisplayValue(value.toString());
    }
  }, [value, isNumeric]);

  // Request camera permission on component mount
  useEffect(() => {
    (async () => {
      if (enableCamera) {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(status === 'granted');
      }
    })();
  }, [enableCamera]);

  const handleChange = (text) => {
    if (isNumeric) {
      const rawValue = text.replace(/,/g, '');
      if (!isNaN(rawValue)) {
        setDisplayValue(formatNumber(rawValue));
        onChange(rawValue);
      }
    } else {
      setDisplayValue(text);
      onChange(text);
    }
  };

  // Open the camera to take a photo
  const openCamera = async () => {
    if (hasCameraPermission === null || !hasCameraPermission) {
      Alert.alert("Camera permission is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Image picker allows editing
      aspect: [4, 3],
      quality: 1,
    });

    console.log("ImagePicker result:", result); // Debugging log

    // Check if image was selected, and it exists in the assets array
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      console.log("Valid image selected:", selectedImage);

      // Resize and compress the image to make sure it's less than 1MB
      const compressedImage = await resizeImage(selectedImage);
      const extractedNumber = await processImageWithOCRAPI(compressedImage);
      if (extractedNumber) {
        setDisplayValue(formatNumber(extractedNumber));
        onChange(extractedNumber);
      } else {
        Alert.alert("Unable to detect mileage from the image. Please try again.");
      }
    } else {
      Alert.alert("No image was selected. Please try again.");
      console.log("Image was not selected or was cancelled.");
    }
  };

  // Function to resize and compress the image
  const resizeImage = async (uri) => {
    try {
      // Resize the image to a max width of 800 and compress the image quality to 0.5 (50%)
      const resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Resize the image
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } // Compress the image
      );
      console.log("Resized Image URI:", resizedImage.uri);
      return resizedImage.uri; // Return the resized/compressed image URI
    } catch (error) {
      console.error("Error resizing/compressing image:", error);
      throw error;
    }
  };

  // Function to process the image using the OCR API
  const processImageWithOCRAPI = async (imageUri) => {
    try {
      if (!imageUri) {
        throw new Error("Invalid image URI");
      }

      console.log("Processing image URI:", imageUri); // Debugging log

      const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const formData = new FormData();
      formData.append('base64Image', `data:image/jpg;base64,${imageBase64}`);
      formData.append('apikey', OCR_API_KEY);
      formData.append('language', 'eng'); // Set the language to English
      formData.append('isOverlayRequired', false);

      const response = await fetch(OCR_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      console.log("OCR API Response:", data);

      if (data && data.ParsedResults && data.ParsedResults[0]) {
        const ocrText = data.ParsedResults[0].ParsedText;
        console.log("Extracted Text:", ocrText);

        // Extract only numbers from the recognized text
        const extractedNumber = ocrText.match(/\d+/g)?.[0];
        return extractedNumber || ''; // Return the first number found or an empty string
      } else {
        console.error("Error in OCR result:", data);
        return '';
      }
    } catch (error) {
      console.error("Error with OCR API:", error);
      return '';
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, enableCamera ? styles.inputWithIcon : null]}
          placeholder={placeholder}
          value={displayValue}
          onChangeText={handleChange}
          keyboardType={isNumeric ? 'numeric' : 'default'}
        />
        {enableCamera && (
          <TouchableOpacity onPress={openCamera} style={styles.cameraIcon}>
            <Ionicons name="camera" size={24} color="gray" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  inputWithIcon: {
    paddingRight: 40,
  },
  cameraIcon: {
    position: 'absolute',
    right: 10,
  },
});

export default InputComponent;
