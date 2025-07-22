import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import HomeScreen from "../screens/home/HomeScreen";
import ClaimSearcher from "../screens/searcher/ClaimSearcher";
import CommerceScreen from "../screens/Menu/ClaimMenu";
import VehicleScreen from "../screens/Menu/VehicleScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import ForgetPasswordScreen from "../screens/auth/ForgetPasswordScreen";
import PrintingScreen from "../screens/modals/PrintingScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { VehicleSearcher } from "../screens/searcher/VehicleSearcher";
import { DisplayForms } from "../testForms/DisplayForms";
import { DisplayQuestions } from "../testForms/DisplayQuestions";
import ClaimMenu from "../screens/Menu/ClaimMenu";
import { ClaimScreen } from "../screens/claim/ClaimScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ClaimMenu: undefined;
  VehicleScreen: undefined;
  ClaimSearcher: undefined;
  ForgetPassword: undefined;
  Printing: undefined;
  CommerceFineModal: undefined;
  VehicleFineModal: undefined;
  profile: undefined;
  CommerceScreen: undefined;
  CommerceFineScreen: undefined;
  ClaimScreen: undefined;
  VehicleSearcher: undefined;
  TestDbScreen: undefined;
  DisplayForms:undefined;
  DisplayQuestions:undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {

  const { status } = useSelector((state: RootState) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {status === "authenticated" ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="DisplayForms" component={DisplayForms} />
          <Stack.Screen name="DisplayQuestions" component={DisplayQuestions} />
          <Stack.Screen name="ClaimMenu" component={ClaimMenu} />
          <Stack.Screen name="VehicleScreen" component={VehicleScreen} />
          <Stack.Screen name="ClaimSearcher" component={ClaimSearcher} />
          <Stack.Screen name="Printing" component={PrintingScreen} />
          <Stack.Screen name="profile" component={ProfileScreen} />
          <Stack.Screen name="ClaimScreen" component={ClaimScreen} />
          <Stack.Screen name="VehicleSearcher" component={VehicleSearcher} />
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