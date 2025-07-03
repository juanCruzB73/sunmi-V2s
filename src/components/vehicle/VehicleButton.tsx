import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../router/StackNavigator';

const { width } = Dimensions.get('window');

export interface VehicleButtonProps {
  label: string;
}

const VehicleButton: React.FC<VehicleButtonProps> = ({ label }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    if (label === 'Datos del comercio') {
      navigation.navigate('VehicleSearcher');
    } else if (label === 'Generar Factura') {
      navigation.navigate('VehicleFineModal');
    }
    // Puedes agregar más condiciones aquí si agregas más botones
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
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