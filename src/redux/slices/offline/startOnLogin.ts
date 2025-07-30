import { API } from "@env";
import { getDBConnection } from "../../../localDB/db";
import { registerOfflineUser } from "../../../localDB/session/offlineAuth";
import { AppDispatch } from "../../store";
import { onCheckingAuth } from "../auth/authSlice";
import { ILogin } from "../auth/authThunk";
import { startOffLineLogin } from "../auth/offLineAuthThunk";
import NetInfo from "@react-native-community/netinfo"; // ✅ Agregalo acá
import { AsyncStorage } from "react-native";
 
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
    //await dropOfflineAuthTable(db);
    //await createOfflineAuthTable(db);
    //const normalizedEmail = payload.email.trim().toLowerCase();
    const netState = await NetInfo.fetch();

    if (netState.isConnected) {
      try {
        const response = await fetch(`${API}/api/v1/auth/sign_in`, {
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

      }catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(message);
        return false;
      }
    }
    dispatch(startOffLineLogin(payload))
    return true;
  }
};