import React from 'react';
import { View, Button, StyleSheet, Alert,Text, Image, TouchableOpacity } from 'react-native';
import * as SunmiPrinterLibrary from '@mitsuharu/react-native-sunmi-printer-library'
import { TopBar } from './src/components/top-bar/TopBar';
import { VehicleSearcher } from './src/screens/searcher/VehicleSearcher';

export default function App() {
  const App = async () => {
    try {
      await SunmiPrinterLibrary.prepare()
      await SunmiPrinterLibrary.printText('Hello from Sunmi V2s!\n');
      await SunmiPrinterLibrary.printText('This is a test receipt.\n\n\n');
      Alert.alert('Success', 'Printed successfully');
    } catch (err) {
      let errorMessage = 'Failed to print';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error(err);
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <>
      {/*<TopBar/>*/}
      <VehicleSearcher/>
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
    </>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      //justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 40,
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