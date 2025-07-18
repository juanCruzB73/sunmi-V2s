import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import { AppDispatch } from "../../store";
import { onCheckingAuth, onLogin, onLogOut } from "./authSlice";
import { Alert } from "react-native";
import { API_BASE_URL } from '@env';
import { getDBConnection } from "../../../localDB/db";
import { createOfflineAuthTable, loginOffline, registerOfflineUser } from "../../../localDB/session/offlineAuth";

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

export const restoreAuthState = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(onCheckingAuth());

    try {
      const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
      const tokenData = Object.fromEntries(values);
      const normalizedEmail = tokenData['uid']?.trim().toLowerCase() ?? '';
      const netState = await NetInfo.fetch();

      const tokensExist = tokenData["access-token"] && tokenData.client && tokenData.uid;

      if (tokensExist && netState.isConnected) {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/validate_token`, {
          headers: {
            "access-token": tokenData["access-token"] ?? '',
            "client": tokenData.client ?? '',
            "uid": tokenData.uid ?? '',
            "token-type": "Bearer",
            "Accept": "*/*",
          }
        });

        if (response.ok) {
          const data: any = await response.json();
          dispatch(onLogin({
            userId: data.data.id,
            name: data.data.name,
            email: data.data.email,
          }));
          return;
        }
      }

      const db = await getDBConnection();
      const offlineOk = await loginOffline(db, normalizedEmail, '');

      if (offlineOk) {
        console.log('[RESTORE SESSION] Restauración offline exitosa. Usuario validado sin conexión.');

        dispatch(onLogin({
          userId: 0,
          name: normalizedEmail,
          email: normalizedEmail,
        }));
      } else {
        console.log('[RESTORE SESSION] Falló restauración offline. Usuario no encontrado.');
        dispatch(onLogOut());
        Alert.alert('Sesión expirada', 'No se pudo validar la sesión en modo online ni offline.');
      }

    } catch (error) {
      console.error('Error restaurando sesión:', error);
      dispatch(onLogOut());
      Alert.alert('Error inesperado', 'No se pudo restaurar la sesión.');
    }
  };
};

export const startOnLogIn = (payload: ILogin) => {
  return async (dispatch: AppDispatch) => {
    dispatch(onCheckingAuth());

    const db = await getDBConnection();
    await createOfflineAuthTable(db);
    const normalizedEmail = payload.email.trim().toLowerCase();
    const netState = await NetInfo.fetch();

    if (netState.isConnected) {
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
            console.log("Login failed", errorData.errors?.[0] || "Unknown error");
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
        console.log(message);
        return false;
      }

    } else {
      const offlineValid = await loginOffline(db, normalizedEmail, payload.password);

      if (offlineValid) {
        console.log('[OFFLINE LOGIN] Usuario validado localmente. Guardando datos en AsyncStorage...');

        await AsyncStorage.multiSet([
          ['access-token', 'offline'],
          ['client', 'offline'],
          ['uid', normalizedEmail],
        ]);

        dispatch(onLogin({
          userId: 0,
          name: normalizedEmail,
          email: normalizedEmail,
        }));
        return true;
      } else {
        console.log('[OFFLINE LOGIN] Falló la validación local. Usuario no encontrado o contraseña inválida.');
        console.log("Sin conexión", "Credenciales inválidas en modo offline.");
        dispatch(onLogOut());
        return false;
      }
    }
  };
};

export const startLogOut = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(onCheckingAuth());

    try {
      await AsyncStorage.multiRemove(['access-token', 'client', 'uid']);
    } catch (error) {
      console.error("Failed to clear auth tokens:", error);
    }

    dispatch(onLogOut());
  };
};