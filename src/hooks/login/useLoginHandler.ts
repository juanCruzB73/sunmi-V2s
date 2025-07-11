import { useDispatch } from "react-redux";
import { loginSuccess, onChecking, onLogOut } from "../../redux/slices/authSlice";
import { AuthService } from "../../services/authService";
import { Alert } from "react-native";

export const useLoginHandler = () => {
  const dispatch = useDispatch();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await AuthService.login({ email, password });

      // Guardar en Redux
      dispatch(loginSuccess({
  name: result.data.name,
  email: result.data.email,
  userId: result.data.id,
  accessToken: result.headers.accessToken,
  client: result.headers.client,
  uid: result.headers.uid,
}));

      Alert.alert("Login exitoso", result.data.data?.email);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      Alert.alert("Error", message);
    }
  };

  return { handleLogin };
};