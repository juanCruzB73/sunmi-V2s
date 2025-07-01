import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface VehicleInputProps extends TextInputProps {
  label: string;
}

const VehicleFineInput: React.FC<VehicleInputProps> = ({ label, ...props }) => {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={`Ingresar ${label.toLowerCase()}`}
        placeholderTextColor="#888"
        {...props}
      />
    </View>
  );
};

import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  group: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
     width: '100%',
    minWidth: width * 0.7,
    color: '#000',
  },
});

export default VehicleFineInput;