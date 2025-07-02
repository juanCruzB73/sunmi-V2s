import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import VehicleFineScreen from './src/screens/fine/VehicleFineScreen';
import { VehicleFineModalScreen } from './src/screens/modals/VehicleFineModalScreen';
export default function App() {
  return (
    <View style={styles.container}>
      {/*<TopBar/>*/}
      <VehicleFineModalScreen/>
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
