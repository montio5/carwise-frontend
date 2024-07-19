// CustomButton.js

import React, { useState } from 'react';
import { TouchableOpacity ,Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomButton = ({
    text,
    icon,
    onPress,
    backgroundColor = '#007bff',
    textColor = '#fff',
    style
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handlePress = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            await onPress();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Pressable
            style={[styles.button, { backgroundColor }, isLoading && styles.disabledButton, style]}
            onPress={handlePress}
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={textColor} />
            ) : (
                <>
                    {icon && <Ionicons name={icon} size={20} color={textColor} />}
                    <Text style={[styles.buttonText, icon && styles.buttonTextWithIcon, { color: textColor }]}>
                        {text}
                    </Text>
                </>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
    },
    buttonTextWithIcon: {
        marginLeft: 8,
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
});

export default CustomButton;
