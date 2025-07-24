import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAuthToken } from "../../../types/IAuthToken";
import { AppDispatch } from "../../store";
<<<<<<< HEAD
<<<<<<< HEAD
import { onAddClaim, onCheckingClaims, onLoadClaims, onSetErrorMessage } from "./claimSlice";
import { API_BASE_URL2 } from '@env';
=======
import { onAddClaim, onCheckingClaims, onLoadClaims, onSetActiveClaim, onSetErrorMessage } from "./claimSlice";
import { API_BASE_URL3 } from '@env';
>>>>>>> 80b9552 (commit before main_panel in claim)
import { ICreateClaim } from "../../../types/claims/ICreateClaim";
=======
import { onAddClaim, onCheckingClaims, onDeleteClaim, onEditClaim, onLoadClaims, onSetActiveClaim, onSetErrorMessage } from "./claimSlice";
import { API_BASE_URL, API_BASE_URL4 } from '@env';
import { ICreateEditClaim } from "../../../types/claims/ICreateEditClaim";
<<<<<<< HEAD
>>>>>>> fbc09aa (update And delete from app to api updated)
=======
import { createClaimsTable, deleteClaim, dropClaimsTable, insertClaim, removeClaimOffline } from "../../../localDB/claims/claims";
import { getDBConnection } from "../../../localDB/db";
>>>>>>> 59cf2f0 (falta implementar claims offline(update,insert,get,delete))

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
<<<<<<< HEAD
            const response = await fetch(`${API}/api/v1/forms/visible/${formId}/claims`,{headers:headers});
=======
            const response = await fetch(`${API_BASE_URL3}/api/v1/forms/visible/${formId}/claims`,{headers:headers});
>>>>>>> 80b9552 (commit before main_panel in claim)
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
<<<<<<< HEAD
console.log("🧠 startAddClaim arrancó");
=======
      const db = await getDBConnection();
>>>>>>> 59cf2f0 (falta implementar claims offline(update,insert,get,delete))
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

      const response = await fetch(`${API_BASE_URL4}/api/v1/forms/visible/claims`, {
        method: 'POST',
        headers,
        body: JSON.stringify(inClaim),
      });

      const responseText = await response.text();

      let parsedResponse: any;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        dispatch(onSetErrorMessage("Respuesta del servidor no válida"));
        return;
      }
      //await insertClaim()
      if (!response.ok || parsedResponse?.msg === "error creating claim") {
        console.error("Error creating claim:", parsedResponse.errors || parsedResponse.msg);
        dispatch(
          onSetErrorMessage(
            parsedResponse.errors?.join(" | ") || parsedResponse.msg || "Error desconocido"
          )
        );
        return;
      }

      dispatch(onAddClaim(parsedResponse.claim));
      dispatch(onSetActiveClaim(parsedResponse.claim));
      dispatch(onSetErrorMessage(null));
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

      const response = await fetch(`${API_BASE_URL}/api/v1/forms/visible/claims/${inClaim.claim.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(inClaim),
      });

      const responseText = await response.text();

      let parsedResponse: any;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        dispatch(onSetErrorMessage("Respuesta del servidor no válida"));
        return;
      }

      if (!response.ok || parsedResponse?.msg === "error creating claim") {
        console.error("Error creating claim:", parsedResponse.errors || parsedResponse.msg);
        dispatch(
          onSetErrorMessage(
            parsedResponse.errors?.join(" | ") || parsedResponse.msg || "Error desconocido"
          )
        );
        return;
      }
      dispatch(onEditClaim({...parsedResponse,id:inClaim.claim.id}));
      dispatch(onSetActiveClaim(parsedResponse.claim));
      dispatch(onSetErrorMessage(null));
    } catch (error) {
      console.error("Network or unexpected error:", error);
      dispatch(onSetErrorMessage("Error inesperado al enviar el reclamo"));
    }
  };
};
export const startLocalDeleteClaim = (claimId: number) => {
  return async (dispatch: AppDispatch) => {
    dispatch(onCheckingClaims());

    await removeClaimOffline(claimId); // 👈 Aquí tiene que eliminarse
    dispatch(onDeleteClaim(claimId));
    dispatch(onSetActiveClaim(null));
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

      const response = await fetch(`${API_BASE_URL4}/api/v1/forms/visible/claims/${claimId}`, {
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