import { getOfflineUnsyncedClaims } from "../../../localDB/claims/unSyncedClaim";
import { AppDispatch } from "../../store";
import { onAddClaim } from "./../../slices/claims/claimSlice";

export const startLoadUnsyncedClaims = () => {
  return async (dispatch: AppDispatch) => {
    const unsyncedClaims = await getOfflineUnsyncedClaims();
    unsyncedClaims.forEach((claim) => {
      dispatch(onAddClaim({ ...claim, isSynced: false }));
    });
  };
};