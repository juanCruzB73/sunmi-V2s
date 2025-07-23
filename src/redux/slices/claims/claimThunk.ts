import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAuthToken } from "../../../types/IAuthToken";
import { AppDispatch } from "../../store";
import { onAddClaim, onCheckingClaims, onLoadClaims, onSetActiveClaim, onSetErrorMessage } from "./claimSlice";
import { API_BASE_URL3 } from '@env';
import { ICreateClaim } from "../../../types/claims/ICreateClaim";

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
            dispatch(onCheckingClaims());
            const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
            const tokenObject: { [key: string]: string | null } = Object.fromEntries(values);
            const tokenData: IAuthToken = {
              accessToken: tokenObject['access-token'] ?? '',
              client: tokenObject['client'] ?? '',
              uid: tokenObject['uid'] ?? '',
            };
            const headers = setTokenHeader(tokenData);
            const response = await fetch(`${API_BASE_URL3}/api/v1/forms/visible/${formId}/claims`,{headers:headers});
            const data=await response.json();
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

export const startAddClaim = (inClaim: ICreateClaim) => {
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

      const response = await fetch(`${API_BASE_URL3}/api/v1/forms/visible/claims`, {
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
      console.log(parsedResponse.claim);
      dispatch(onSetErrorMessage(null));
    } catch (error) {
      console.error("Network or unexpected error:", error);
      dispatch(onSetErrorMessage("Error inesperado al enviar el reclamo"));
    }
  };
};
