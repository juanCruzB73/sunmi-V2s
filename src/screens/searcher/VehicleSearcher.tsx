import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  Pressable
} from 'react-native';
import { TopBar } from '../../components/top-bar/TopBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleSearcher'>;

export const VehicleSearcher = ({ navigation }: Props) => {
  const [plateNumber, setPlateNumber] = useState('');
  const handlePlateChange = (text: string) => {
    const filteredText = text.replace(/[^a-zA-Z0-9]/g, '');
    setPlateNumber(filteredText);
  };

  return (
    <>
      <TopBar navigation={navigation} />
      <LinearGradient colors={['#f1f5fa', '#d8e4f4']} style={styles.gradient}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Buscador de vehículos</Text>
          <Text style={styles.description}>Ingrese la patente del vehículo</Text>
          <TextInput
            style={styles.input}
            value={plateNumber}
            onChangeText={handlePlateChange}
            placeholder="Ingrese matrícula"
            placeholderTextColor="#777"
          />
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]}
            onPress={() => navigation.navigate('VehicleFineScreen')}
          >
            <Text style={styles.buttonText}>Buscar</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
  },
  wrapper: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  input: {
    height: 50,
    fontSize: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#bbb',
    backgroundColor: '#fff',
    borderRadius: 10,
    width: width * 0.9,
    color: '#000',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 12,
    width: width * 0.9,
    alignItems: 'center',
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});