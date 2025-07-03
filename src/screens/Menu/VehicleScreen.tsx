import React from 'react';
import { View, StyleSheet } from 'react-native';
import VehicleButton from '../../components/vehicle/VehicleButton';
import { TopBar } from '../../components/top-bar/TopBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleScreen'>;

const VehicleScreen = ({ navigation }: Props) => {
  return (
    <>
      <TopBar navigation={navigation} />
      <LinearGradient colors={['#f2f6fc', '#d7e3f4']} style={styles.gradient}>
        <View style={styles.container}>
          <VehicleButton label="Datos del comercio" />
          <VehicleButton label="Generar Factura" />
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 20,
    alignItems: 'stretch',
    paddingBottom: 60,
  },
});

export default VehicleScreen;