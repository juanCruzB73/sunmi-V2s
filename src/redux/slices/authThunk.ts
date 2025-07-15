import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppDispatch } from "../store";
import { onCheckingAuth, onLogin, onLogOut } from "./authSlice";
import { Alert } from "react-native";

export interface ILogin{
  email:string;
  password:string;
}

const storeAuthTokens = async (accessToken: string | null, client: string | null, uid: string | null) => {
  try {
    await AsyncStorage.multiSet([
      ['accessToken', accessToken ?? ''],
      ['client', client ?? ''],
      ['uid', uid ?? ''],
    ]);
  } catch (e) {
    console.error('Failed to save tokens:', e);
  }
};

export const restoreAuthState = async () => {
  return async(dispatch:AppDispatch)=>
    {
      const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
      const tokenData = Object.fromEntries(values);

  const response = await fetch('https://9aa8780a0701.ngrok-free.app/api/v1/auth/validate_token', {
    headers: {
      "access-token": tokenData.accessToken ?? "",
      "client": tokenData.client ?? "",
      "uid": tokenData.uid ?? "",
      "token-type": "Bearer",
      "Accept": "*/*",
    }
  });

  const data:any=response.json();    

    if (tokenData.accessToken && tokenData.client && tokenData.uid) {
      dispatch(onLogin({
        userId: data.id,
        name: data.name,
        email: data.email,
      }));
    } else {
      dispatch(onLogOut());
    }}
};


export const startOnLogIn=(payload:ILogin)=>{
    return async(dispatch:AppDispatch)=>{
        dispatch(onCheckingAuth());
        try {
          const response = await fetch('https://9aa8780a0701.ngrok-free.app/api/v1/auth/sign_in', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            const errorData = await response.json();
            Alert.alert("Login failed", errorData.errors?.[0] || "Unknown error");
            return false;
          }

          const data=await response.json();

          const accessToken = response.headers.get('access-token');
          const client = response.headers.get('client');
          const uid = response.headers.get('uid');

          const authData={
            name: data.data.name,
            email: data.data.email,
            userId: data.data.id,
            accessToken,
            client,
            uid,
          };

          await storeAuthTokens(accessToken, client, uid);

          dispatch(onLogin({userId:authData.userId,name:authData.name,email:authData.email}))
          
          return true;
          
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error);
          Alert.alert(message);
          return false;
      }
    };
};


export const startLogOut=()=>{
    return async(dispatch:AppDispatch)=>{
        dispatch(onCheckingAuth());
        dispatch(onLogOut());
    }
};
// src/redux/thunks/authThunk.ts
/*import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../../services/authService";
import { LoginPayload } from "../../types/authentication/auth";

export const loginThunk = createAsyncThunk(
  "auth/loginThunk",
  async ({ email, password }: LoginPayload, thunkAPI) => {
    try {
      const result = await AuthService.login({ email, password });

      return {
        name: result.data.name,
        email: result.data.email,
        userId: result.data.id,
        accessToken: result.headers.accessToken,
        client: result.headers.client,
        uid: result.headers.uid,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);*/