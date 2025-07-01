import * as SunmiPrinterLibrary from '@mitsuharu/react-native-sunmi-printer-library';
import { Alert } from 'react-native';

export const handlePrint = async () => {
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