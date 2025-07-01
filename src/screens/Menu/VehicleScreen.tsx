import React from 'react';
import { View, StyleSheet } from 'react-native';
import VehicleButton from '../../components/vehicle/VehicleButton';
import { TopBar } from '../../components/top-bar/TopBar';

const VehicleScreen: React.FC = () => {
  return (<> 
  <TopBar />
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