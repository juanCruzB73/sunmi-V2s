import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import { AppDispatch } from "../../store";
import { onCheckingAuth, onLogin, onLogOut } from "../auth/authSlice";
import { Alert } from "react-native";
import { API_BASE_URL } from '@env';
import { getDBConnection } from "../../../localDB/db";
import { loginOffline, registerOfflineUser } from "../../../localDB/session/offlineAuth";

export interface ILogin {
  email: string;
  password: string;
}

const storeAuthTokens = async (
  accessToken: string | null,
  client: string | null,
  uid: string | null
) => {
  try {
    await AsyncStorage.multiSet([
      ['access-token', accessToken ?? ''],
      ['client', client ?? ''],
      ['uid', uid ?? ''],
    ]);
  } catch (e) {
    console.error('Failed to save tokens:', e);
  }
};

export const startOnLogIn = (payload: ILogin) => {
  return async (dispatch: AppDispatch) => {
    dispatch(onCheckingAuth());
    const db = await getDBConnection();
    const netState = await NetInfo.fetch();
    const normalizedEmail = payload.email.trim().toLowerCase();

    if (netState.isConnected) {
      // 🌐 Login online
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/sign_in`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: normalizedEmail, password: payload.password })
        });

        if (!response.ok) {
          const errorData = await response.json();
          Alert.alert("Login failed", errorData.errors?.[0] || "Unknown error");
          return false;
        }

        const data = await response.json();
        const accessToken = response.headers.get('access-token');
        const client = response.headers.get('client');
        const uid = response.headers.get('uid');

        const authData = {
          name: data.data.name,
          email: data.data.email,
          userId: data.data.id,
          accessToken,
          client,
          uid,
        };

        await storeAuthTokens(accessToken, client, uid);
        await registerOfflineUser(db, normalizedEmail, payload.password);

        dispatch(onLogin({
          userId: authData.userId,
          name: authData.name,
          email: authData.email,
        }));

        return true;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        Alert.alert(message);
        return false;
      }

    } else {
      // 📴 Login offline
      const isValidOffline = await loginOffline(db, normalizedEmail, payload.password);
      if (isValidOffline) {
        dispatch(onLogin({
          userId: 0, // Si no tenés ID local, podés dejarlo como 0
          name: normalizedEmail,
          email: normalizedEmail,
        }));
        return true;
      } else {
        Alert.alert("Sin conexión", "No se pudo validar las credenciales de forma offline.");
        dispatch(onLogOut());
        return false;
      }
    }
  };
};