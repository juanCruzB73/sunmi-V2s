import { getAnswersByClaimId } from "../../../localDB/claims/answers";
import { deleteClaim } from "../../../localDB/claims/claims";
import { getDBConnection } from "../../../localDB/db";
import { IClaim } from "../../../types/claims/IClaim";
import { AppDispatch } from "../../store";
import { onDeleteClaim, onLoadClaims, onSetErrorMessage } from "./claimSlice";
import NetInfo from "@react-native-community/netinfo"; // ✅ Agregalo acá


export const getOfflineClaims = async (): Promise<IClaim[]> => {
  const db = await getDBConnection();

  const results = await db.executeSql('SELECT * FROM claims;');
  const rows = results[0].rows;
  const claims: IClaim[] = [];

  for (let i = 0; i < rows.length; i++) {
    
    const claimRow = rows.item(i);
    console.log(claimRow);
    const answers = await getAnswersByClaimId(db, claimRow.id);
    console.log("asdw",answers)
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
        console.log("claim offline",offlineClaims);

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
        console.log("claims mapped correctly");
        dispatch(onLoadClaims(mappedClaims));
        dispatch(onSetErrorMessage("Cargando claims desde almacenamiento local"));
        return;
        
    }
    
}