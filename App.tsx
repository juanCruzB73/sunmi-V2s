import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import VehicleFineScreen from './src/screens/fine/VehicleFineScreen';
import { VehicleFineModalScreen } from './src/screens/modals/VehicleFineModalScreen';
import { CommerceFineModalScreen } from './src/screens/modals/CommerceFineModalScreen';
export default function App() {
  return (
    <View style={styles.container}>
      {/*<TopBar/>*/}
      <CommerceFineModalScreen/>
      {/*<View style={styles.container}>
          <View style={styles.centerContent}>
            <Image
              source={require('./src/assets/logoNoLetter.jpeg')} // Asegúrate de tener el logo en esta ruta
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>LAS CONDES</Text>
            <Text style={styles.subtitle}>MEJOR PARA TODOS</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>INGRESA</Text>
          </TouchableOpacity>
        </View>*/}
    </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor:"white",
    },
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 90,
      height: 90,
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      color: '#1976D2',
      fontWeight: 'bold',
      letterSpacing: 2,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 14,
      color: '#1976D2',
      letterSpacing: 1,
      textAlign: 'center',
      marginTop: 4,
    },
    button: {
      backgroundColor: '#1976D2',
      borderRadius: 20,
      paddingVertical: 12,
      paddingHorizontal: 40,
      alignSelf: 'center',
      marginBottom: 20,
      width: 180,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold',
      letterSpacing: 1,
    },
  });