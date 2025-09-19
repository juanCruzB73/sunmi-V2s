import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAuthToken } from "../../../types/IAuthToken";
import { AppDispatch } from "../../store";
import { onAddClaim, onCheckingClaims, onDeleteClaim, onEditClaim, onSetActiveClaim, onSetErrorMessage } from "./claimSlice";
import { API_BASE_URL2, API_BASE_URL3 } from '@env';
import { ICreateEditClaim } from "../../../types/claims/ICreateEditClaim";
import {  createClaimsTable, insertClaim } from "../../../localDB/claims/claims";
import { getDBConnection } from "../../../localDB/db";
import { startOfflineClaims, startOfflineDeleteClaim } from "./claimOffLineThunk";
import NetInfo from '@react-native-community/netinfo';
import { insertAnswer } from "../../../localDB/claims/answers";
import { createUnsyncedClaimTable, deleteUnsyncedClaim, getOfflineUnsyncedClaims, getUnsyncedClaimById, getUnsyncedClaimsToFetch, insertUnsyncedClaim } from "../../../localDB/claims/unSyncedClaim";
import { createUnsyncedAnswerTable, insertUnsyncedAnswer, updateUnsyncedAnswer } from "../../../localDB/claims/unSyncedAnswer";
import { unSyncedClaim } from "../../../types/unSyncedClaim";
import { IClaim } from "../../../types/claims/IClaim";

function isIClaim(claim: IClaim | unSyncedClaim): claim is IClaim {
  return (claim as IClaim).answers !== undefined;
}


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

      //await dropClaimsTable(db);
      await createClaimsTable(db);
      await createUnsyncedClaimTable(db);
      await createUnsyncedAnswerTable(db);
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
            const response = await fetch(`${API_BASE_URL3}/api/v1/forms/${formId}/claims`,{headers:headers});
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
      await dispatch(startOfflineClaims(formId));
      dispatch(onSetErrorMessage(null));
      return; 
    }
};

export const startAddClaim = (inClaim: ICreateEditClaim) => {
  console.log(inClaim);
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

        const response = await fetch(`${API_BASE_URL3}/api/v1/forms/${inClaim.claim.form_id}/claims`, {
          method: 'POST',
          headers,
          body: JSON.stringify(inClaim),
        });
        const data= await response.json();
        await insertClaim(db, data);
        if(data.answers.length){
          for (const answer of data.answers) {
            await insertAnswer(db,answer);
          }
        }
        dispatch(onAddClaim({...data,isSynced:true}));
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
        main_panel_id:inClaim.claim.main_panel_id,
        isSynced: 0
      });
      console.log(unsyncedClaim);
      
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

export const startEditClaim = (inClaim: ICreateEditClaim) => {
  console.log(inClaim);
  return async (dispatch: AppDispatch) => {
    const netState = await NetInfo.fetch();
    const db = await getDBConnection();
    if (netState.isConnected){
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
      const response = await fetch(`${API_BASE_URL3}/api/v1/forms/${inClaim.claim.form_id}/claims/${inClaim.claim.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(inClaim),
      });
      const data = await response.json();
      dispatch(onEditClaim({...data,id:inClaim.claim.id,isSynced:true}));
      dispatch(onSetActiveClaim(data.claim));
      dispatch(onSetErrorMessage(null));
      return;
      }catch (error) {
        console.error("Network or unexpected error:", error);
        dispatch(onSetErrorMessage("Error inesperado al enviar el reclamo"));
      }
    }
  }
};

export const startEditClaimUnsync = (inClaim: ICreateEditClaim) => {
  return async (dispatch: AppDispatch) => {
    const db = await getDBConnection();
    
      for (const answer of inClaim.claim.answers_attributes) {
        await updateUnsyncedAnswer(db,answer);
      }
        const data=await getUnsyncedClaimById(db,inClaim.claim.id);
        dispatch(onEditClaim(data));
        dispatch(onSetActiveClaim(data));
        dispatch(onSetErrorMessage(null));
        return;
      }
};

export const startDeleteClaim=(claimId:number,formId:number)=>{
  return async (dispatch: AppDispatch) =>{
      const netState = await NetInfo.fetch();
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

          const headers = {
            ...setTokenHeader(tokenData),
            'Content-Type': 'application/json',
          };
          const response = await fetch(`${API_BASE_URL3}/api/v1/forms/${formId}/claims/${claimId}`, {
            method: 'DELETE',
            headers,
          });

          if(!response.ok){
            console.log("error borrando claim");
            return;
          }
          
          dispatch(startOfflineDeleteClaim(claimId));
          
        }catch (error) {
          console.error("Network or unexpected error:", error);
          dispatch(onSetErrorMessage("Error inesperado al enviar el reclamo"));
        }
      }
    }
}
export const startDeleteUnsycClaim=(claimId:number)=>{
  return async (dispatch: AppDispatch) =>{
        const db = await getDBConnection();
        await deleteUnsyncedClaim(db,claimId);
        dispatch(startOfflineDeleteClaim(claimId));
  }
}

export const uploadUnsyncedClaims = () => {
  return async (dispatch: AppDispatch) => {
    const netState = await NetInfo.fetch();
    const db = await getDBConnection();

    if (netState.isConnected) {
      try {
        const unsyncedClaims = await getOfflineUnsyncedClaims();

        // Recuperamos tokens de sesión una sola vez
        const values = await AsyncStorage.multiGet([
          "access-token",
          "client",
          "uid",
        ]);
        const tokenObject: { [key: string]: string | null } =
          Object.fromEntries(values);
        const tokenData: IAuthToken = {
          accessToken: tokenObject["access-token"] ?? "",
          client: tokenObject["client"] ?? "",
          uid: tokenObject["uid"] ?? "",
        };
        const headers = setTokenHeader(tokenData);

        for (const unsyncedClaim of unsyncedClaims) {
          const claimPayload = {
            claim: {
              form_id: unsyncedClaim.form_id,
              incident_id: unsyncedClaim.incident_id,
              area_id: unsyncedClaim.area_id,
              main_panel_id: unsyncedClaim.main_panel_id,
              answers_attributes: unsyncedClaim.answers_attributes,
              local_id: unsyncedClaim.id, // 🔑 propagamos el id local
            },
          };

          const response = await fetch(
            `${API_BASE_URL2}/api/v1/forms/${unsyncedClaim.form_id}/claims`,
            {
              method: "POST",
              headers,
              body: JSON.stringify(claimPayload),
            }
          );

          const data = await response.json();

         console.log("➡️ Insertando con local_id:", unsyncedClaim.id, "y data.id:", data.id);

await insertClaim(db, {
  ...data,
  isSynced: true,
  local_id: unsyncedClaim.local_id, // 🔑 debería ser el id local
});

          // Eliminamos de la tabla unsynced
          await deleteUnsyncedClaim(db, unsyncedClaim.id);

          // Actualizamos Redux
          dispatch(onDeleteClaim(unsyncedClaim.id));
          dispatch(
            onAddClaim({ ...data, local_id: unsyncedClaim.id, isSynced: true })
          );
        }
      } catch (err) {
        console.error("Error al sincronizar reclamos:", err);
        dispatch(onSetErrorMessage("Error al sincronizar reclamos"));
      }
    } else {
      dispatch(onSetErrorMessage("Necesitas conexión a internet para sincronizar"));
    }
  };
};


export const uploadSingleUnsyncedClaim = (unsyncedClaim: unSyncedClaim) => {
  return async (dispatch: AppDispatch) => {
    const netState = await NetInfo.fetch();
    const db = await getDBConnection();

    if (netState.isConnected) {
      try {
        // Construimos el payload con el local_id
        const claimPayload = {
          claim: {
            form_id: unsyncedClaim.form_id,
            incident_id: unsyncedClaim.incident_id,
            area_id: unsyncedClaim.area_id,
            main_panel_id: unsyncedClaim.main_panel_id,
            answers_attributes: unsyncedClaim.answers_attributes,
            local_id: unsyncedClaim.id, // 🔑 propagamos el id local
          },
        };

        // Recuperamos tokens de sesión
        const values = await AsyncStorage.multiGet([
          "access-token",
          "client",
          "uid",
        ]);
        const tokenObject: { [key: string]: string | null } =
          Object.fromEntries(values);
        const tokenData: IAuthToken = {
          accessToken: tokenObject["access-token"] ?? "",
          client: tokenObject["client"] ?? "",
          uid: tokenObject["uid"] ?? "",
        };

        // Construimos headers
        const headers = setTokenHeader(tokenData);

        // Subimos el reclamo al servidor
        const response = await fetch(
          `${API_BASE_URL2}/api/v1/forms/${unsyncedClaim.form_id}/claims`,
          {
            method: "POST",
            headers,
            body: JSON.stringify(claimPayload),
          }
        );

        const data = await response.json();

        // Guardamos en claims con ambos IDs
       console.log("➡️ Insertando con local_id:", unsyncedClaim.id, "y data.id:", data.id);

await insertClaim(db, {
  ...data,
  isSynced: true,
  local_id: unsyncedClaim.local_id, // 🔑 debería ser el id local
});

// 🔎 Debug: ver qué quedó en la DB
const res = await db.executeSql("SELECT id, local_id FROM claims;");
console.log("Claims en DB:", res[0].rows.raw());

        // Eliminamos de la tabla unsynced
        await deleteUnsyncedClaim(db, unsyncedClaim.id);

        // Actualizamos Redux
        dispatch(onDeleteClaim(unsyncedClaim.id)); // borro el offline
        dispatch(
          onAddClaim({ ...data, local_id: unsyncedClaim.id, isSynced: true })
        ); // inserto el sincronizado
      } catch (err) {
        console.error("Error al sincronizar reclamo individual:", err);
        dispatch(
          onSetErrorMessage("Error al sincronizar el reclamo seleccionado")
        );
      }
    } else {
      dispatch(
        onSetErrorMessage("Necesitas conexión a internet para sincronizar")
      );
    }
  };
};

