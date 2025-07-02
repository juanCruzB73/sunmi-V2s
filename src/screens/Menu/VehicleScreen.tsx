import React from 'react';
import { View, StyleSheet } from 'react-native';
import VehicleButton from '../../components/vehicle/VehicleButton';
import { TopBar } from '../../components/top-bar/TopBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleScreen'>;


const VehicleScreen = ({navigation}:Props) => {
  return (
  <> 
    <TopBar navigation={navigation}/>
    <View style={styles.container}>
      <VehicleButton label="Datos del vehículo" onPress={() => {}} />
      <VehicleButton label="Generar Multa" onPress={() => {}} />
    </View>
  </>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
});

export default VehicleScreen;