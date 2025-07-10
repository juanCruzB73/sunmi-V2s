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
import ProfileScreen from '../screens/profile/ProfileScreen';
import { CommerceSearcher } from '../screens/searcher/CommerceSearcher';
import CommerceFineScreen from '../screens/fine/CommerceFineScreen';
import VehicleFineScreen from '../screens/fine/VehicleFineScreen';
import { VehicleSearcher } from '../screens/searcher/VehicleSearcher';
import TestDb from '../db/testDb';
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Details: undefined;
  CommerceMenu: undefined;
  VehicleScreen: undefined;
  FineSearcher: undefined;
  ForgetPassword: undefined;
  Printing: undefined;
  CommerceFineModal: undefined;
  VehicleFineModal: undefined;
  topBar: undefined;
  profile: undefined;
  CommerceSearcher: undefined;
  CommerceScreen: undefined;
  CommerceFineScreen: undefined;
  VehicleFineScreen: undefined;
  VehicleSearcher: undefined;
  TestDb:undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">

      <Stack.Screen name="TestDb" component={TestDb} />
      <Stack.Screen name="VehicleSearcher" component={VehicleSearcher} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name='CommerceFineScreen' component={CommerceFineScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VehicleFineScreen" component={VehicleFineScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CommerceMenu" component={CommerceScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VehicleScreen" component={VehicleScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FineSearcher" component={FineSearcher} options={{ headerShown: false }} />
      <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Printing" component={PrintingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VehicleFineModal" component={CommerceFineModalScreen} options={{ headerShown: false }} />
      <Stack.Screen name="profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VehicleSearcher" component={CommerceSearcher} options={{ headerShown: false }} />
      <Stack.Screen name="VehicleFineModal" component={VehicleFineModalScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};
export default StackNavigator;