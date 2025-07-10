import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export interface VehicleButtonProps {
  label: string;
  onPress?: () => void;
}

const VehicleButton: React.FC<VehicleButtonProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 26,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 54,
    width: '100%',
    minWidth: width * 0.7,
    paddingHorizontal: 20,
  },
  label: {
    color: '#fff',
    fontSize: 23,
    fontWeight: '600',
  },
});

export default VehicleButton;