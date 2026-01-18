import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import { AppDispatch } from "../../store";
import { onCheckingAuth, onLogin, onLogOut } from "./authSlice";
import {API_BASE_URL1} from '@env';
import { getDBConnection } from "../../../localDB/db";
import { registerOfflineUser } from "../../../localDB/session/offlineAuth";
import { startOffLineLogin } from "./offLineAuthThunk";
import * as Keychain from 'react-native-keychain';

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
  console.log("FIRING RESTORE");
  
  return async (dispatch: AppDispatch) => {
    await AsyncStorage.multiRemove(['access-token', 'client', 'uid']);
    dispatch(onCheckingAuth());
    const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
    const tokenData = Object.fromEntries(values);
    console.log(API_BASE_URL1);
    const response = await fetch(`${API_BASE_URL1}/api/v1/auth/validate_token`, {
      headers: {
        "access-token": tokenData["access-token"] ?? "",
        "client": tokenData.client ?? "",
        "uid": tokenData.uid ?? "",
        "token-type": "Bearer",
        "Accept": "*/*",
      }
    });

    const data: any = await response.json();
    console.log(tokenData["access-token"], tokenData.client, tokenData.uid);
    
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
  console.log("FIRING LOGIN");
  console.log(`${API_BASE_URL1}/api/v1/auth/sign_in`,);
  
  
  return async (dispatch: AppDispatch) => {
    dispatch(onCheckingAuth());
    await AsyncStorage.multiRemove(['access-token', 'client', 'uid']);
    const db = await getDBConnection();
    const netState = await NetInfo.fetch();
    
    if (netState.isConnected) {
      try {
        const response = await fetch(`${API_BASE_URL1}/api/v1/auth/sign_in`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: payload.email, password: payload.password })
        });


        if (response.ok) {
          const data = await response.json();

          const accessToken = response.headers.get('Access-Token');
          const client = response.headers.get('client');
          const uid = response.headers.get('uid');
          
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

      }catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
      }
    }
    dispatch(startOffLineLogin(payload))
    return true;
  }
};

export const startLogOut = () => {
  console.log("FIRING LOGOUT");
  return async (dispatch: AppDispatch) => {
    try {
      await AsyncStorage.multiRemove(['access-token', 'client', 'uid']);
      await Keychain.resetGenericPassword();
    } catch (error) {
      console.error("Failed to clear auth tokens:", error);
    }

    dispatch(onLogOut());
  };
};

export const reLoginOnline=async(status:string)=>{
  console.log("FIRING relogin");
  
    return async (dispatch: AppDispatch) =>{
      const netState = await NetInfo.fetch();
      const credentials = await Keychain.getGenericPassword();
      if (netState.isConnected){
      
        if(netState.isConnected && status!=="checking"){

          if (credentials) {
            const { username: email, password } = credentials;  
            await dispatch(startOnLogIn({ email, password }))
          }else{
            dispatch(onLogOut())
          };
        }
      }else{
      dispatch(onLogOut());
    }
  }
};