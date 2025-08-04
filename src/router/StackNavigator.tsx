import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import NetInfo from '@react-native-community/netinfo';
import HomeScreen from "../screens/home/HomeScreen";
import ClaimSearcher from "../screens/searcher/ClaimSearcher";
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

import * as Keychain from 'react-native-keychain';
import { IAuthToken } from "../types/IAuthToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { startOnLogIn } from "../redux/slices/auth/authThunk";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

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
  const dispatch = useDispatch<AppDispatch>();

  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  
  useEffect(()=>{
    const reLoginOnline=async()=>{
      const netState = await NetInfo.fetch();
      if (netState.isConnected){
        const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
        const tokenObject: { [key: string]: string | null } = Object.fromEntries(values);
        const tokenData: IAuthToken = {
          accessToken: tokenObject['access-token'] ?? '',
          client: tokenObject['client'] ?? '',
          uid: tokenObject['uid'] ?? '',
        };
        if(!tokenData.accessToken||!tokenData.client||!tokenData.uid && netState.isConnected){
          const credentials = await Keychain.getGenericPassword();
          if (credentials) {
            const { username: email, password } = credentials;
          
            await dispatch(startOnLogIn({ email, password }))
          }
        }
      }
    }
    reLoginOnline();
  },[isConnected])
  
  if (status === 'checking') {
    return (
      <View style={styles.checkingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.checkingText}>Verificando...</Text>
      </View>
    );
  }
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

const styles = StyleSheet.create({
  checkingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fbfd',
  },
  checkingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#34495e',
  },
});

export default StackNavigator;