import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import FineSearcher from '../screens/searcher/FineSearcher';
import CommerceScreen from '../screens/Menu/CommerceScreen';
import VehicleScreen from '../screens/Menu/VehicleScreen';

export type RootStackParamList = {
  Home: undefined;
  Details: undefined; // Keep if you plan to use this
  CommerceMenu: undefined;
  VehicleScreen: undefined;
  FineSearcher: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CommerceMenu" component={CommerceScreen} />
      <Stack.Screen name="VehicleScreen" component={VehicleScreen} />
      <Stack.Screen name="FineSearcher" component={FineSearcher} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
