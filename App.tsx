import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, Alert } from 'react-native';
import * as SunmiPrinterLibrary from '@mitsuharu/react-native-sunmi-printer-library'

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Go to Details" onPress={() => navigation.navigate('Details')} />
    </View>
  );
}

function DetailsScreen() {
  const print=async()=>{
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
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button title="Print Hello World" onPress={print} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
