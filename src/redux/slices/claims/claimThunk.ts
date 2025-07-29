import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppDispatch } from "../../store";
import { API, API_BASE, API_BASE_URL } from '@env';

import { IAuthToken } from "../../../types/IAuthToken";
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
import { IClaim } from "../../../types/claims/IClaim";

// 🛡️ Header token builder
const setTokenHeader = (tokenData: IAuthToken) => ({
  "access-token": tokenData.accessToken ?? "",
  "client": tokenData.client ?? "",
  "uid": tokenData.uid ?? "",
  "token-type": "Bearer",
  "Accept": "*/*",
  "Content-Type": "application/json"
});

// 🚀 Obtener reclamos desde API por formulario
export const startGetClaims = (formId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const db = await getDBConnection();
      dispatch(onCheckingClaims());

      await dropClaimsTable(db);
      await createClaimsTable(db);

      const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
      const tokenObject = Object.fromEntries(values);
      const tokenData: IAuthToken = {
        accessToken: tokenObject['access-token'] ?? '',
        client: tokenObject['client'] ?? '',
        uid: tokenObject['uid'] ?? ''
      };

      const headers = setTokenHeader(tokenData);
      const response = await fetch(`${API_BASE}/api/v1/forms/visible/${formId}/claims`, {
        headers
      });

      const data = await response.json();
      for (const claim of data) {
        await insertClaim(db, claim);
      }

      dispatch(onLoadClaims(data));
      dispatch(onSetErrorMessage(null));
    } catch (error) {
      console.error("❌ Error en startGetClaims:", error);
      dispatch(onSetErrorMessage("Error al cargar reclamos"));
      return false;
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

      const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
      const tokenObject = Object.fromEntries(values);
      const tokenData: IAuthToken = {
        accessToken: tokenObject['access-token'] ?? '',
        client: tokenObject['client'] ?? '',
        uid: tokenObject['uid'] ?? ''
      };

      const headers = setTokenHeader(tokenData);
      const response = await fetch(`${API_BASE}/api/v1/forms/visible/claims`, {
        method: 'POST',
        headers,
        body: JSON.stringify(inClaim),
      });

      const responseText = await response.text();
      let parsedResponse: any;

      try {
        parsedResponse = JSON.parse(responseText);
      } catch (e) {
        console.error("❌ JSON parse error:", e);
        dispatch(onSetErrorMessage("Respuesta del servidor no válida"));
        return;
      }

      if (!response.ok || parsedResponse?.msg === "error creating claim") {
        dispatch(onSetErrorMessage(parsedResponse.errors?.join(" | ") || parsedResponse.msg || "Error desconocido"));
        return;
      }

      const db = await getDBConnection();
      await insertClaim(db, parsedResponse.claim); // ✅ Guardar en SQLite

      dispatch(onAddClaim(parsedResponse.claim));
      dispatch(onSetActiveClaim(parsedResponse.claim));
      dispatch(onSetErrorMessage(null));
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

      const headers = setTokenHeader(tokenData);
      const response = await fetch(`${API_BASE}/api/v1/forms/visible/claims/${inClaim.claim.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(inClaim)
      });

      const responseText = await response.text();
      let parsedResponse: any;

      try {
        parsedResponse = JSON.parse(responseText);
      } catch (e) {
        console.error("❌ JSON parse error:", e);
        dispatch(onSetErrorMessage("Respuesta del servidor no válida"));
        return;
      }

      if (!response.ok || parsedResponse?.msg === "error creating claim") {
        dispatch(onSetErrorMessage(parsedResponse.errors?.join(" | ") || parsedResponse.msg || "Error desconocido"));
        return;
      }

      dispatch(onEditClaim({ ...parsedResponse, id: inClaim.claim.id }));
      dispatch(onSetActiveClaim(parsedResponse.claim));
      dispatch(onSetErrorMessage(null));
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

      const headers = setTokenHeader(tokenData);
      const response = await fetch(`${API_BASE}/api/v1/forms/visible/claims/${claimId}`, {
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