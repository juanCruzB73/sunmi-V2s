import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/router/StackNavigator";
import { store } from "./src/redux/store";
import { Provider } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Initializer = () => {
  const loadToken = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
    }
  } catch (e) {
    console.error('Failed to load the token.', e);
  }
};
useEffect(() => {
  loadToken();
}, []);

  return <StackNavigator />;
};

export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <Initializer />
      </Provider>
    </NavigationContainer>
  );
}