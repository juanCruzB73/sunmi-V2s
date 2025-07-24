import { API_BASE_URL } from "@env";
import { AsyncStorage } from "react-native";
import { dropClaimsTable, createClaimsTable, insertClaim, removeClaimOffline, deleteClaim } from "../../../localDB/claims/claims";
import { getDBConnection } from "../../../localDB/db";
import { ICreateEditClaim } from "../../../types/claims/ICreateEditClaim";
import { IAuthToken } from "../../../types/IAuthToken";
import { AppDispatch } from "../../store";
import { onCheckingClaims, onLoadClaims, onSetErrorMessage, onAddClaim, onSetActiveClaim, onEditClaim, onDeleteClaim } from "./claimSlice";


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
            const response = await fetch(`${API}/api/v1/forms/visible/${formId}/claims`,{headers:headers});
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
console.log("🧠 startAddClaim arrancó");
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