import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Checkbox from 'expo-checkbox';

const CarSetupScreen = () => {
  const [isSelected, setSelection] = useState(false);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Checkbox
        value={isSelected}
        onValueChange={setSelection}
      />
      <Text>{isSelected ? 'Selected' : 'Not Selected'}</Text>
    </View>
  );
};

export default CarSetupScreen;
