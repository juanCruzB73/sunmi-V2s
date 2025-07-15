import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import HomeScreen from "../screens/home/HomeScreen";
import FineSearcher from "../screens/searcher/FineSearcher";
import CommerceScreen from "../screens/Menu/CommerceScreen";
import VehicleScreen from "../screens/Menu/VehicleScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import ForgetPasswordScreen from "../screens/auth/ForgetPasswordScreen";
import PrintingScreen from "../screens/modals/PrintingScreen";
import { VehicleFineModalScreen } from "../screens/modals/VehicleFineModalScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import VehicleFineScreen from "../screens/fine/VehicleFineScreen";
import { VehicleSearcher } from "../screens/searcher/VehicleSearcher";
import TestDbScreen from "../localDB/testDb";
import { CommerceFineModalScreen } from "../screens/fine/CommerceFineScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  CommerceMenu: undefined;
  VehicleScreen: undefined;
  FineSearcher: undefined;
  ForgetPassword: undefined;
  Printing: undefined;
  CommerceFineModal: undefined;
  VehicleFineModal: undefined;
  profile: undefined;
  CommerceScreen: undefined;
  CommerceFineScreen: undefined;
  VehicleFineScreen: undefined;
  VehicleSearcher: undefined;
  TestDbScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {

  const { status } = useSelector((state: RootState) => state.auth);
  console.log(status)

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {status === "authenticated" ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CommerceMenu" component={CommerceScreen} />
          <Stack.Screen name="VehicleScreen" component={VehicleScreen} />
          <Stack.Screen name="FineSearcher" component={FineSearcher} />
          <Stack.Screen name="Printing" component={PrintingScreen} />
          <Stack.Screen name="VehicleFineModal" component={VehicleFineModalScreen} />
          <Stack.Screen name="profile" component={ProfileScreen} />
          <Stack.Screen name="CommerceFineScreen" component={CommerceFineModalScreen} />
          <Stack.Screen name="VehicleFineScreen" component={VehicleFineScreen} />
          <Stack.Screen name="VehicleSearcher" component={VehicleSearcher} />
          <Stack.Screen name="TestDbScreen" component={TestDbScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;