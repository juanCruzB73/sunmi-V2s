import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppDispatch } from "../../store";
import { onAddClaim, onCheckingClaims, onDeleteClaim, onEditClaim, onLoadClaims, onSetActiveClaim, onSetErrorMessage } from "./claimSlice";
import { API_BASE_URL7 } from '@env';
import { ICreateEditClaim } from "../../../types/claims/ICreateEditClaim";

import {
  onCheckingClaims,
  onAddClaim,
  onEditClaim,
  onDeleteClaim,
  onLoadClaims,
  onSetActiveClaim,
  onSetErrorMessage,
  onIsMofified
} from "./claimSlice";

import {
  insertClaim,
  deleteClaim,
  createClaimsTable,
  dropClaimsTable,
  updateClaim} from "../../../localDB/claims/claims";

import { getDBConnection } from "../../../localDB/db";
import { startOfflineClaims } from "./claimOffLineThunk";
import NetInfo from '@react-native-community/netinfo';
import { insertAnswer } from "../../../localDB/claims/answers";
import { IClaim } from "../../../types/claims/IClaim";
import { IAuthToken } from "../../../types/IAuthToken";

// 🛡️ Header token builder
const setTokenHeader = (tokenData: IAuthToken) => ({
  "access-token": tokenData.accessToken ?? "",
  "client": tokenData.client ?? "",
  "uid": tokenData.uid ?? "",
  "token-type": "Bearer",
  "Accept": "*/*",
  "Content-Type": "application/json"
});

export const startGetClaims=(formId:number)=>{
    return async (dispatch: AppDispatch) =>{
      const netState = await NetInfo.fetch();
      const db = await getDBConnection();
      await dropClaimsTable(db); 
      await createClaimsTable(db); 

      createClaimsTable(db);
      if (netState.isConnected){
        try{
            dispatch(onCheckingClaims());
            
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
              if(claim.answers.length){
                for (const answer of claim.answers) {
                  console.log(answer);
                  await insertAnswer(db,answer);
                }
              }
            };
        }catch(error){
            const message = error instanceof Error ? error.message : String(error);
            console.log(message);
            dispatch(onSetErrorMessage("Error al cargar formularios"));
        }
      }
      await dispatch(startOfflineClaims());
      dispatch(onSetErrorMessage(null));
      return; 
    }
  };
};
export const startLocalDeleteClaim = (claimId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const db = await getDBConnection();
      await deleteClaim(db, claimId);
      dispatch(onDeleteClaim(claimId));
    } catch (error) {
      console.error("❌ Error al eliminar reclamo local:", error);
    }
  };
};


export const startAddClaim = (inClaim: ICreateEditClaim) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(onCheckingClaims());
      
      const db = await getDBConnection();
      
      const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
      const tokenObject = Object.fromEntries(values);
      const tokenData: IAuthToken = {
        accessToken: tokenObject['access-token'] ?? '',
        client: tokenObject['client'] ?? '',
        uid: tokenObject['uid'] ?? ''
      };

      const headers = {
        ...setTokenHeader(tokenData),
        'Content-Type': 'application/json',
      };
      
      console.log(`${API_BASE_URL7}/api/v1/forms/visible/claims`);

      const response = await fetch(`${API_BASE_URL7}/api/v1/forms/visible/claims`, {
        method: 'POST',
        headers,
        body: JSON.stringify(inClaim),
      });
      if(response.ok){
        console.log("ERROR ON POST CLAIM");
      }
      const data= await response.json();
      await insertClaim(db,data)
      dispatch(onAddClaim(data));
      dispatch(onSetActiveClaim(data));
      dispatch(onSetErrorMessage(null));
      return;
    } catch (error) {
      console.error("❌ Error en startAddClaim:", error);
      dispatch(onSetErrorMessage("Error inesperado al enviar el reclamo"));
    }
  };
};
// ✏️ Editar reclamo localmente (SQLite + Redux)
export const startUpdateClaimLocal = (claim: IClaim) => {
  return async (dispatch: AppDispatch) => {
    try {
      const db = await getDBConnection();
      await updateClaim(db, claim);        // 💾 Actualiza en SQLite
      dispatch(onEditClaim(claim));        // 🔁 Actualiza estado en Redux
      dispatch(onIsMofified(true)); // 🔄 Marca como modificad o
      
    } catch (error) {
      console.error("❌ Error al editar reclamo local:", error);
      dispatch(onSetErrorMessage("No se pudo editar el reclamo local"));
    }
  };
};

// ✏️ Editar reclamo (online)
export const startEditClaim = (inClaim: ICreateEditClaim) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(onCheckingClaims());

      const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
      const tokenObject = Object.fromEntries(values);
      const tokenData: IAuthToken = {
        accessToken: tokenObject['access-token'] ?? '',
        client: tokenObject['client'] ?? '',
        uid: tokenObject['uid'] ?? ''
      };

      const headers = {
        ...setTokenHeader(tokenData),
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${API_BASE_URL7}/api/v1/forms/visible/claims/${inClaim.claim.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(inClaim)
      });

      const data = await response.json();
      
      dispatch(onEditClaim({...data,id:inClaim.claim.id}));
      dispatch(onSetActiveClaim(data.claim));
      dispatch(onSetErrorMessage(null));
      return;
    } catch (error) {
      console.error("❌ Error en startEditClaim:", error);
      dispatch(onSetErrorMessage("Error inesperado al editar el reclamo"));
    }
  };
};

// 🗑️ Eliminar reclamo (API + SQLite)
export const startDeleteClaim = (claimId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(onCheckingClaims());

      const db = await getDBConnection();

      const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
      const tokenObject = Object.fromEntries(values);
      const tokenData: IAuthToken = {
        accessToken: tokenObject['access-token'] ?? '',
        client: tokenObject['client'] ?? '',
        uid: tokenObject['uid'] ?? ''
      };

      const headers = {
        ...setTokenHeader(tokenData),
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${API_BASE_URL7}/api/v1/forms/visible/claims/${claimId}`, {
        method: 'DELETE',
        headers
      });

      await deleteClaim(db, claimId);

      if (!response.ok) {
        console.log("❌ Error al borrar claim desde API");
        return;
      }

      dispatch(onDeleteClaim(claimId));
      dispatch(onSetActiveClaim(null));
      dispatch(onSetErrorMessage(null));
    } catch (error) {
      console.error("❌ Error inesperado en startDeleteClaim:", error);
      dispatch(onSetErrorMessage("No se pudo eliminar el reclamo"));
    }
  };
};