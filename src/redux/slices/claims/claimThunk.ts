import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAuthToken } from "../../../types/IAuthToken";
import { AppDispatch } from "../../store";
import { onAddClaim, onCheckingClaims, onDeleteClaim, onEditClaim, onLoadClaims, onSetActiveClaim, onSetErrorMessage } from "./claimSlice";
import { API_BASE_URL7 } from '@env';
import { ICreateEditClaim } from "../../../types/claims/ICreateEditClaim";
import { createClaimsTable, deleteClaim, dropClaimsTable, insertClaim } from "../../../localDB/claims/claims";
import { getDBConnection } from "../../../localDB/db";

const setTokenHeader = (tokenData: IAuthToken) => {
  const headers = {
    "access-token": tokenData.accessToken ?? "",
    "client": tokenData.client ?? "",
    "uid": tokenData.uid ?? "",
    "token-type": "Bearer",
    "Accept": "*/*",
    'Content-Type': 'application/json'
  };
  return headers;
};

export const startGetClaims=(formId:number)=>{
    return async (dispatch: AppDispatch) =>{
        try{
            const db = await getDBConnection();
            dispatch(onCheckingClaims());
            await dropClaimsTable(db);
            await createClaimsTable(db);
            const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
            const tokenObject: { [key: string]: string | null } = Object.fromEntries(values);
            const tokenData: IAuthToken = {
              accessToken: tokenObject['access-token'] ?? '',
              client: tokenObject['client'] ?? '',
              uid: tokenObject['uid'] ?? '',
            };
            const headers = setTokenHeader(tokenData);
            const response = await fetch(`${API_BASE_URL7}/api/v1/forms/visible/${formId}/claims`,{headers:headers});
            const data=await response.json();
            for (const claim of data) {
              await insertClaim(db, claim);
            };
            dispatch(onLoadClaims(data));
            onSetErrorMessage(null);
        }catch(error){
            const message = error instanceof Error ? error.message : String(error);
            console.log(message);
            dispatch(onSetErrorMessage("Error al cargar formularios"));
            return false;
        }
    }
};

export const startAddClaim = (inClaim: ICreateEditClaim) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(onCheckingClaims());
      
      const db = await getDBConnection();
      
      const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
      const tokenObject: { [key: string]: string | null } = Object.fromEntries(values);
      const tokenData: IAuthToken = {
        accessToken: tokenObject['access-token'] ?? '',
        client: tokenObject['client'] ?? '',
        uid: tokenObject['uid'] ?? '',
      };

      const headers = {
        ...setTokenHeader(tokenData),
        'Content-Type': 'application/json',
      };
      
      console.log(`${API_BASE_URL7}/api/v1/forms/visible/claims`);
      console.log(headers);

      const response = await fetch(`${API_BASE_URL7}/api/v1/forms/visible/claims`, {
        method: 'POST',
        headers,
        body: JSON.stringify(inClaim),
      });
      if(response.ok){
        console.log("ERROR ON POST CLAIM");
      }
      const data= await response.json();
      dispatch(onAddClaim(data));
      dispatch(onSetActiveClaim(data));
      dispatch(onSetErrorMessage(null));
      return;
    } catch (error) {
      console.error("Network or unexpected error:", error);
      dispatch(onSetErrorMessage("Error inesperado al enviar el reclamo"));
    }
  };
};

export const startEditClaim = (inClaim: ICreateEditClaim) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(onCheckingClaims());

      const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
      const tokenObject: { [key: string]: string | null } = Object.fromEntries(values);
      const tokenData: IAuthToken = {
        accessToken: tokenObject['access-token'] ?? '',
        client: tokenObject['client'] ?? '',
        uid: tokenObject['uid'] ?? '',
      };

      const headers = {
        ...setTokenHeader(tokenData),
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${API_BASE_URL7}/api/v1/forms/visible/claims/${inClaim.claim.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(inClaim),
      });

      const data = await response.json();

      dispatch(onEditClaim({...data,id:inClaim.claim.id}));
      dispatch(onSetActiveClaim(data.claim));
      dispatch(onSetErrorMessage(null));
      return;
    } catch (error) {
      console.error("Network or unexpected error:", error);
      dispatch(onSetErrorMessage("Error inesperado al enviar el reclamo"));
    }
  };
};

export const startDeleteClaim=(claimId:number)=>{
  return async (dispatch: AppDispatch) =>{
    try {
      dispatch(onCheckingClaims());
      const db = await getDBConnection();
      const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
      const tokenObject: { [key: string]: string | null } = Object.fromEntries(values);
      const tokenData: IAuthToken = {
        accessToken: tokenObject['access-token'] ?? '',
        client: tokenObject['client'] ?? '',
        uid: tokenObject['uid'] ?? '',
      };

      const headers = {
        ...setTokenHeader(tokenData),
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${API_BASE_URL7}/api/v1/forms/visible/claims/${claimId}`, {
        method: 'DELETE',
        headers,
      });

      await deleteClaim(db,claimId);

      if(!response.ok){
        console.log("error borrando claim");
        return;
      } 
      dispatch(onDeleteClaim(claimId));
      dispatch(onSetErrorMessage(null));
    } catch (error) {
      console.error("Network or unexpected error:", error);
      dispatch(onSetErrorMessage("Error inesperado al enviar el reclamo"));
    }
  }
}