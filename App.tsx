import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/router/StackNavigator";
import { store } from "./src/redux/store";
import { Provider, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setToken } from "./src/redux/slices/authSlice"; // importa la acción

const Initializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          dispatch(setToken(token)); // Despacha el token a Redux si existe
        }
      } catch (e) {
        console.error('Failed to load the token.', e);
      }
    };
    loadToken();
  }, [dispatch]);

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