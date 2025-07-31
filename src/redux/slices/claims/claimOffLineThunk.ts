import { getAnswersByClaimId } from "../../../localDB/claims/answers";
import { getOfflineUnsyncedClaims } from "../../../localDB/claims/unSyncedClaim";
import { getDBConnection } from "../../../localDB/db";
import { deleteClaim, updateClaim } from "../../../localDB/claims/claims";
import { updateAnswers } from "../../../localDB/claims/answers";
import { ICreateEditClaim } from "../../../types/claims/ICreateEditClaim";
import { IClaim } from "../../../types/claims/IClaim";
import { IAnswer } from "../../../types/claims/IAnswer";
import { onEditClaim, onSetActiveClaim, onSetErrorMessage, onDeleteClaim, onLoadClaims } from "./claimSlice";
import { startEditClaim } from "./claimThunk";
import { AppDispatch } from "../../store";
import NetInfo from '@react-native-community/netinfo';

// 🔄 Mapeo correcto de answers_attributes → IAnswer[]
const mapAnswersAttributesToAnswers = (
  attributes: { id?: number; input_string: string; question_id: string }[],
  claimId: number
): IAnswer[] => {
  return attributes.map(attr => ({
    id: attr.id ?? Date.now(),
    input_string: attr.input_string,
    input_text: null,
    input_date: null,
    input_datetime: null,
    options: [],
    latitude: null,
    longitude: null,
    item_id: null,
    person_id: null,
    address_id: null,
    question_id: Number(attr.question_id),
    owner_type: "",
    owner_id: null,
    answerable_type: "Claim",
    answerable_id: claimId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    isSynced: false,
    tag: null,
    question: {
      id: Number(attr.question_id),
      label: "",
      type: "",
      required: false,
      order_position: 0,
      name: "",
      owner: "", // 👈 cambio clave para evitar el error
      order: 0,
      description: "",
      active: true,
      form_id: 0,
      created_at: new Date().toISOString(),
      filters: {},
      catalog_id: 0,
      updated_at: new Date().toISOString(),
      panel_id: 0,
      show_list: false
    }
  }));
};

// ✏️ Transformador de ICreateEditClaim a IClaim
const toClaim = (raw: ICreateEditClaim): IClaim => {
  const claimId = raw.claim.id ?? Date.now();
  return {
    id: claimId,
    status: raw.claim.status,
    panel_id: raw.claim.panel_id,
    main_panel_id: raw.claim.main_panel_id,
    type: raw.claim.type,
    date: raw.claim.date,
    removed_at: raw.claim.removed_at,
    removed: raw.claim.removed,
    reason: raw.claim.reason,
    user_id: raw.claim.user_id,
    removed_user_id: raw.claim.removed_user_id,
    status_type_id: raw.claim.status_type_id,
    form_id: raw.claim.form_id,
    incident_id: raw.claim.incident_id,
    created_at: raw.claim.created_at,
    area_id: raw.claim.area_id,
    updated_at: new Date().toISOString(),
    isSynced: false,
    answers: mapAnswersAttributesToAnswers(raw.claim.answers_attributes, claimId)
  };
};

// 🚀 Thunk principal listo para edición offline
export const startOfflineEditClaim = (inClaim: ICreateEditClaim) => {
  return async (dispatch: AppDispatch) => {
    try {
      const netState = await NetInfo.fetch();
      if (netState.isConnected) {
        console.log("Conectado a internet, edición offline omitida.");
        return;
      }

      const db = await getDBConnection();
      const claimToSave = toClaim(inClaim);

      await updateClaim(db, claimToSave);
      await updateAnswers(db, claimToSave.answers);

      dispatch(onEditClaim(claimToSave));
      dispatch(onSetActiveClaim(claimToSave));
      dispatch(onSetErrorMessage("Reclamo editado localmente sin conexión."));
    } catch (error) {
      console.error("Error al editar reclamo offline:", error);
      dispatch(onSetErrorMessage("Error al actualizar el reclamo en SQLite."));
    }
  };
};
export const editClaimSmart = (inClaim: ICreateEditClaim, navigation?: any) => {
  return async (dispatch: AppDispatch) => {
    const netState = await NetInfo.fetch();
    if (netState.isConnected) {
      dispatch(startEditClaim(inClaim, navigation)); // 👉 se pasa navigation al thunk
    } else {
      dispatch(startOfflineEditClaim(inClaim));
    }
  };
};

export const getOfflineClaims = async (): Promise<IClaim[]> => {
  const db = await getDBConnection();

  const results = await db.executeSql('SELECT * FROM claims;');
  const rows = results[0].rows;
  const claims: IClaim[] = [];

  for (let i = 0; i < rows.length; i++) {
    const claimRow = rows.item(i);
    const answers = await getAnswersByClaimId(db, claimRow.id);

    for (let j = 0; j < answers.length; j++) {
      const param = answers[j].question_id;
      const questionResult = await db.executeSql(`SELECT * FROM questions WHERE id=?;`, [param]);

      const questionRows = questionResult[0].rows;

      if (questionRows.length > 0) {
        const question = questionRows.item(0);
        answers[j] = {
          ...answers[j],
          question,
        };
      }
    }
    
    claims.push({
      ...claimRow,
      answers
    });
  }
  
  return claims;
};
export const startOfflineDeleteClaim = (claimId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const netState = await NetInfo.fetch();

      if (netState.isConnected) {
        console.log("Conectado a internet, omitiendo eliminación offline.");
        return;
      }

      const db = await getDBConnection();
      await deleteClaim(db, claimId);

      dispatch(onDeleteClaim(claimId));
      dispatch(onSetErrorMessage("Claim eliminado localmente sin conexión."));
    } catch (error) {
      console.error("Error al eliminar claim offline:", error);
      dispatch(onSetErrorMessage("Error al eliminar claim desde la base de datos local."));
    }
  };
}
export const startOfflineClaims=()=>{  
    return async(dispatch: AppDispatch) =>{
        const offlineClaims = await getOfflineClaims();
        const mappedClaims: IClaim[] = offlineClaims.map(claim => ({
            id: claim.id,
            status: claim.status,
            form_id:claim.form_id,
            panel_id: claim.panel_id,
            type: claim.type || 'default',
            date: claim.date || new Date().toISOString(),
            removed_at: claim.removed_at || null,
            removed: claim.removed || false,
            reason: claim.reason || null,
            user_id: claim.user_id,
            removed_user_id: claim.removed_user_id || null,
            status_type_id: claim.status_type_id || 0,
            claim_id: claim.id,
            incident_id: claim.incident_id || 0,
            created_at: claim.created_at || new Date().toISOString(),
            updated_at: claim.updated_at || new Date().toISOString(),
            area_id: claim.area_id || 0,
            isSynced: claim.isSynced || false,
            answers: claim.answers || [],
            main_panel_id: claim.main_panel_id || 0
        }));
        const unsycedClaims=await getOfflineUnsyncedClaims();
        console.log("claim unsycedClaims",unsycedClaims);
        const allClaims=[...unsycedClaims,...mappedClaims]
        console.log(allClaims);
        console.log(allClaims);
        dispatch(onLoadClaims(allClaims));
        dispatch(onSetErrorMessage("Cargando claims desde almacenamiento local"));
        return;
        
    }
    
}