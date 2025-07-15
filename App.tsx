import { NavigationContainer } from "@react-navigation/native";
import { store } from "./src/redux/store";
import { Provider, useDispatch } from "react-redux";
import { Main } from "./Main";


export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <Main />
      </Provider>
    </NavigationContainer>
  );
}