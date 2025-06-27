import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import * as SunmiPrinterLibrary from '@mitsuharu/react-native-sunmi-printer-library'

export default function App() {
  const handlePrint = async () => {
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
    <View style={styles.container}>
      <Button title="Print" onPress={handlePrint} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});