import { getAnswersByClaimId } from "../../../localDB/claims/answers";
import { deleteClaim } from "../../../localDB/claims/claims";
import { getOfflineUnsyncedClaims } from "../../../localDB/claims/unSyncedClaim";
import { getDBConnection } from "../../../localDB/db";
import { IClaim } from "../../../types/claims/IClaim";
import { AppDispatch } from "../../store";
import { onDeleteClaim, onLoadClaims, onSetErrorMessage } from "./claimSlice";

export const getOfflineClaims = async (form_id:number): Promise<IClaim[]> => {
  const db = await getDBConnection();
  console.log(form_id);
  const results = await db.executeSql('SELECT * FROM claims WHERE form_id=?;',[form_id]);
  const rows = results[0].rows;
  const claims: IClaim[] = [];
  console.log(rows);
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

export const startOfflineClaims=(form_id:number)=>{  
    return async(dispatch: AppDispatch) =>{
        const offlineClaims = await getOfflineClaims(form_id);
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
        const allClaims=[...unsycedClaims,...mappedClaims]
        dispatch(onLoadClaims(allClaims));
        dispatch(onSetErrorMessage("Cargando claims desde almacenamiento local"));
        return;
    }
};

export const startOfflineDeleteClaim = (claimId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const db = await getDBConnection();
      await deleteClaim(db, claimId);

      dispatch(onDeleteClaim(claimId));
      dispatch(onSetErrorMessage("Claim eliminado localmente sin conexión."));
    } catch (error) {
      console.error("Error al eliminar claim offline:", error);
      dispatch(onSetErrorMessage("Error al eliminar claim desde la base de datos local."));
    }
  };
};