import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice";
import { AuthService } from "../../services/AuthService";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../router/StackNavigator";
import { getDBConnection } from "../../localDB/db";
import { saveHeaders } from "../../localDB/session/authHeaders";

export const useLoginHandler = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await AuthService.login({ email, password });
      const { accessToken, client, uid } = result.headers;  

      Alert.alert("Headers recibidos", `accessToken: ${accessToken}\nclient: ${client}\nuid: ${uid}`);

      if (accessToken && client && uid) {
        const db = await getDBConnection();
        await saveHeaders(db, { accessToken, client, uid });

        dispatch(
          loginSuccess({
            name: result.data.name,
            email: result.data.email,
            userId: result.data.id,
            accessToken,
            client,
            uid,
          })
        );

        setTimeout(() => {
          navigation.replace("Home");
        }, 1000);
      } else {
        Alert.alert("🚨 Headers incompletos", "Faltan valores en la respuesta del login");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      Alert.alert("Error inesperado", message);
    }
  };

  return { handleLogin };
};