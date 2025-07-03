import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/router/StackNavigator';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';

export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}><StackNavigator /></Provider>
    </NavigationContainer>
  );
}






