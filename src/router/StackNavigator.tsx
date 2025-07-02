import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import FineSearcher from '../screens/searcher/FineSearcher';
import CommerceScreen from '../screens/Menu/CommerceScreen';
import VehicleScreen from '../screens/Menu/VehicleScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ForgetPasswordScreen from '../screens/auth/ForgetPasswordScreen';
import PrintingScreen from '../screens/modals/PrintingScreen';
import { CommerceFineModalScreen } from '../screens/modals/CommerceFineModalScreen';
import { VehicleFineModalScreen } from '../screens/modals/VehicleFineModalScreen';

export type RootStackParamList = {
  Login: undefined; // Keep if you plan to use this
  Home: undefined;
  Details: undefined; // Keep if you plan to use this
  CommerceMenu: undefined;
  VehicleScreen: undefined;
  FineSearcher: undefined;
  ForgetPassword: undefined;
  Printing: undefined;
  CommerceFineModal: undefined;
  VehicleFineModal: undefined; // Add this if you have a VehicleFineModalScreen
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="CommerceMenu" component={CommerceScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="VehicleScreen" component={VehicleScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="FineSearcher" component={FineSearcher} options={{ headerShown: false }}/>
      <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Printing" component={PrintingScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="CommerceFineModal" component={CommerceFineModalScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="VehicleFineModal" component={VehicleFineModalScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};
export default StackNavigator;
