import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/router/StackNavigator";
import { AppDispatch, store } from "./src/redux/store";
import { Provider, useDispatch } from "react-redux";
import { restoreAuthState } from "./src/redux/slices/authThunk";


const Initializer = () => {

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const reAuth=async()=>{
      dispatch(await restoreAuthState());
    }
    reAuth();
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