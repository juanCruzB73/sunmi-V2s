import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import { AppDispatch } from "../../store";
import { onCheckingAuth, onLogin, onLogOut } from "./authSlice";
import {API_BASE_URL, API_BASE_URL8} from '@env';
import { getDBConnection } from "../../../localDB/db";
import { createOfflineAuthTable, loginOffline, registerOfflineUser } from "../../../localDB/session/offlineAuth";
import { startOffLineLogin } from "./offLineAuthThunk";

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
    const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
    const tokenData = Object.fromEntries(values);

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/validate_token`, {
      headers: {
        "access-token": tokenData["access-token"] ?? "",
        "client": tokenData.client ?? "",
        "uid": tokenData.uid ?? "",
        "token-type": "Bearer",
        "Accept": "*/*",
      }
    });

    const data: any = await response.json();

    if (tokenData["access-token"] && tokenData.client && tokenData.uid && response.ok) {
      dispatch(onLogin({
        userId: data.data.id,
        name: data.data.name,
        email: data.data.email,
      }));
    } else {
      dispatch(onLogOut());
    }
  };
};


export const startOnLogIn = (payload: ILogin) => {
  return async (dispatch: AppDispatch) => {
    dispatch(onCheckingAuth());

    const db = await getDBConnection();
    //await dropOfflineAuthTable(db);
    //await createOfflineAuthTable(db);
    //const normalizedEmail = payload.email.trim().toLowerCase();
    const netState = await NetInfo.fetch();

    if (netState.isConnected) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/sign_in`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: payload.email, password: payload.password })
        });


        if (response.ok) {
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

          await registerOfflineUser(db, {
            userId: data.data.id,
            name: data.data.name,
            lastname: data.data.lastname ?? '',
            email: data.data.email,
            plainPassword: payload.password,
            uid: uid ?? '',
          });
        };


        dispatch(startOffLineLogin(payload))
        return true;

      }catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(message);
        return false;
      }

    }else {
      try{
        dispatch(startOffLineLogin(payload))
        return true;
      }catch(err){
        console.log('[OFFLINE LOGIN] Falló la validación local. Usuario no encontrado o contraseña inválida.');
        console.log("Sin conexión", "Credenciales inválidas en modo offline.");
        dispatch(onLogOut());
        return false;
      }
    }
  }
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