import { getDBConnection } from "../localDB/db";
import { onLoadClaims } from "../redux/slices/claims/claimSlice";
import { AppDispatch } from "../redux/store";


export const syncSQLiteToRedux = () => async (dispatch: AppDispatch) => {
  try {
    const db = await getDBConnection();
    const results = await db.executeSql("SELECT * FROM claims");
    const claims = results[0].rows.raw();

    console.log("🔄 Reclamos desde SQLite:", claims);
    dispatch(onLoadClaims(claims)); // 👈 usa onLoadClaims
  } catch (error) {
    console.error("⛔ Error sincronizando SQLite → Redux:", error);
  }
};