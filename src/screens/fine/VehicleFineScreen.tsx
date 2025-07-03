import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Pressable
} from 'react-native';
import { TopBar } from '../../components/top-bar/TopBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleFineScreen'>;

const VehicleFineScreen = ({ navigation }: Props) => {
  return (
    <>
      <TopBar navigation={navigation} />
      <LinearGradient colors={['#f0f4fa', '#d5e3f2']} style={styles.gradient}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Confirmar datos del vehículo</Text>

          <View style={styles.card}>
            <Text style={styles.plate}>ASDW0000</Text>
            {[
              'Propietario: Travis Blicke',
              'RUT propietario: 46542812',
              'Tipo de vehículo: Auto',
              'Marca: Chevrolet',
              'Modelo: Corsa 2003',
              'Color: Rojo',
            ].map((text, index) => (
              <Text key={index} style={styles.field}>
                {text}
              </Text>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.buttonBack,
                pressed && styles.buttonPressed
              ]}
              onPress={() => navigation.navigate('VehicleSearcher')}
            >
              <Text style={styles.buttonText}>Volver</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.buttonConfirm,
                pressed && styles.buttonPressed
              ]}
              onPress={() => navigation.navigate('FineSearcher')}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </Pressable>
          </View>
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
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'center',
  },
  plate: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#f5f7fa',
    padding: 20,
    borderRadius: 12,
    width: width * 0.9,
    gap: 10,
    elevation: 2,
  },
  field: {
    fontSize: 18,
    color: '#444',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 24,
  },
  buttonBack: {
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    borderRadius: 10,
    width: width * 0.4,
    alignItems: 'center',
  },
  buttonConfirm: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 10,
    width: width * 0.4,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default VehicleFineScreen;