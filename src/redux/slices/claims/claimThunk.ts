import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAuthToken } from "../../../types/IAuthToken";
import { AppDispatch } from "../../store";
import { ClaimType, onAddClaim, onCheckingClaims, onDeleteClaim, onEditClaim, onSetActiveClaim, onSetErrorMessage } from "./claimSlice";
import { API_BASE, API_BASE_URL8 } from '@env';
import { ICreateEditClaim } from "../../../types/claims/ICreateEditClaim";
import {  deleteClaim, insertClaim } from "../../../localDB/claims/claims";
import { getDBConnection } from "../../../localDB/db";
import { startOfflineClaims } from "./claimOffLineThunk";
import NetInfo from '@react-native-community/netinfo';
import { insertAnswer } from "../../../localDB/claims/answers";
import { createUnsyncedClaimTable, insertUnsyncedClaim } from "../../../localDB/claims/unSyncedClaim";
import { createUnsyncedAnswerTable, insertUnsyncedAnswer } from "../../../localDB/claims/unSyncedAnswer";
import { unSyncedClaim } from "../../../types/unSyncedClaim";
import { API_BASE_URL } from "../../../config/config";

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
      const netState = await NetInfo.fetch();
      const db = await getDBConnection();

      //createClaimsTable(db);
      createUnsyncedClaimTable(db);
      createUnsyncedAnswerTable(db);
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
            const response = await fetch(`${API_BASE}/api/v1/forms/visible/${formId}/claims`,{headers:headers});
            const data=await response.json();
            for (const claim of data) {
              await insertClaim(db, {...claim,isSynced:true});
              if(claim.answers.length){
                for (const answer of claim.answers) {
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

export const startAddClaim = (inClaim: ICreateEditClaim) => {
  return async (dispatch: AppDispatch) => {
      dispatch(onCheckingClaims());
      const netState = await NetInfo.fetch();
      const db = await getDBConnection();

      if (netState.isConnected){
        try {
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

        console.log(`${API_BASE}/api/v1/forms/visible/claims`);

        const response = await fetch(`${API_BASE}/api/v1/forms/visible/claims`, {
          method: 'POST',
          headers,
          body: JSON.stringify(inClaim),
        });
        if(response.ok){
          console.log("ERROR ON POST CLAIM");
        }
        const data= await response.json();
        await insertClaim(db, data);
        if(data.answers.length){
          for (const answer of data.answers) {
            await insertAnswer(db,answer);
          }
        }
        dispatch(onAddClaim(data));
        dispatch(onSetActiveClaim(data));
        dispatch(onSetErrorMessage(null));
      } catch (error) {
        console.error("Network or unexpected error:", error);
        dispatch(onSetErrorMessage("Error inesperado al enviar el reclamo"));
      }
    }else{
      const unsyncedClaim = await insertUnsyncedClaim(db, {
        form_id: inClaim.claim.form_id,
        incident_id: inClaim.claim.incident_id,
        area_id: inClaim.claim.area_id,
        isSynced: 0
      });

      if (!unsyncedClaim?.id) {
        console.error("unsyncedClaim is undefined or has no id");
        return;
      }

      const unsyncedAnswers = [];

      for (const answerAtribute of inClaim.claim.answers_attributes) {
        const unsyncedAnswer = await insertUnsyncedAnswer(db, {
          input_string: answerAtribute.input_string,
          question_id: answerAtribute.question_id,
          answerable_id: unsyncedClaim.id
        });
      
        if (unsyncedAnswer) {
          unsyncedAnswers.push(unsyncedAnswer);
        }
      }

      const finalUnsyncedClaim: unSyncedClaim = {
        ...unsyncedClaim,
        answers_attributes: unsyncedAnswers
      };

    dispatch(onAddClaim(finalUnsyncedClaim));

    }
  };
};

export const startEditClaim = (inClaim: ICreateEditClaim, navigation?: any) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(onCheckingClaims());

      if (!inClaim.claim.id) {
        console.error("❌ No se puede hacer PUT sin claim.id");
        dispatch(onSetErrorMessage("No se puede editar el reclamo porque no tiene ID"));
        return;
      }

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

      const response = await fetch(`${API_BASE}/api/v1/forms/visible/claims/${inClaim.claim.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(inClaim),
      });

      if (!response.ok) {
        throw new Error(`Error en PUT: ${response.status}`);
      }

      const data = await response.json();

      dispatch(onEditClaim({ ...data, id: inClaim.claim.id }));
      dispatch(onSetActiveClaim(data.claim));
      dispatch(onSetErrorMessage(null));

      // ✅ Navegación solo si se pasó navigation y fue exitoso
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate('ClaimSearcher');
      }

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

      const response = await fetch(`${API_BASE}/api/v1/forms/visible/claims/${claimId}`, {
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