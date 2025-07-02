import { View, StyleSheet, Text, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { TopBar } from '../../components/top-bar/TopBar';
import { useState } from 'react';
import { RootStackParamList } from '../../router/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'CommerceSearcher'>;

export const CommerceSearcher = ({ navigation }: Props) => {
  const [plateNumber, setPlateNumber] = useState('');
  const handlePlateChange = (text: string) => {
    // Allow only letters and numbers, remove other characters
    const filteredText = text.replace(/[^a-zA-Z0-9]/g, '');
    setPlateNumber(filteredText);
  };
  return (
    <>
      <TopBar navigation={navigation} />
      <View style={styles.VehicleSearcherContainer}>
        <Text style={styles.title}>Buscador de Comercios</Text>
        <View style={styles.container}>
          <Text style={styles.description}>Ingrese El RUT del Comercio</Text>
          <TextInput
            style={styles.input}
            onChangeText={handlePlateChange}
            value={plateNumber}
            placeholder="Ingrse RUT"
            keyboardType="default"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CommerceFineScreen')}
          >
            <Text style={styles.vehicleSearchButton}>Buscar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: "space-around",
    backgroundColor: "white",
    padding: 10,
    minHeight: height * 0.3,
    width: width
  },
  input: {
    height: 50,
    fontSize: 18,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    color: "black",
    width: width * 0.9,
    alignSelf: "center",
    maxHeight: height * 0.9
  },
  description: {},
  title: {
    fontSize: 20,
    alignSelf: "baseline"
  },
  VehicleSearcherContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    alignSelf: 'stretch',
    maxHeight: height * 0.8
  },
  button: {},
  vehicleSearchButton: {
    backgroundColor: "#1664C0",
    padding: 15,
    textAlign: "center",
    alignSelf: "center",
    width: width * 0.9,
    borderRadius: 15,
    borderWidth: 0,
    color: "white"
  }
});