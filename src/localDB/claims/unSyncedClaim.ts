import { SQLiteDatabase } from "react-native-sqlite-storage";
import { getUnsycedAnswersByClaimId } from "./unSyncedAnswer";
import { getDBConnection } from "../db";
import { unSyncedClaim } from "../../types/unSyncedClaim";

export const createUnsyncedClaimTable = async (db: SQLiteDatabase): Promise<void> => {
  try {
    //await db.executeSql(`DROP TABLE IF EXISTS unsynced_claims;`);
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS unsynced_claims (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        form_id INTEGER,
        incident_id INTEGER,
        area_id INTEGER,
        isSynced INTEGER
      );
    `);
  } catch (err) {
    console.error("Error creating unsynced_claims table:", err);
  }
};


export const getOfflineUnsyncedClaims = async ():Promise<unSyncedClaim[]> => {
    console.log("firing");
    const db = await getDBConnection();
    const results = await db.executeSql(`SELECT * FROM unsynced_claims;`);
    console.log(results);
    const rows = results[0].rows;
    const claims: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    const claimRow = rows.item(i);
    const answers = await getUnsycedAnswersByClaimId(db, claimRow.id);
    const answersFormatted = answers.map(answer => ({
      input_string: answer.input_string,
      question_id: answer.question_id,
    }));
    console.log("answers",answersFormatted);
    
    claims.push({
      id: claimRow.id,
      status: claimRow.status,
      form_id: claimRow.form_id,
      panel_id: claimRow.panel_id,
      type: claimRow.type || 'default',
      date: claimRow.date || new Date().toISOString(),
      removed_at: claimRow.removed_at || null,
      removed: claimRow.removed || false,
      reason: claimRow.reason || null,
      user_id: claimRow.user_id,
      removed_user_id: claimRow.removed_user_id || null,
      status_type_id: claimRow.status_type_id || 0,
      claim_id: claimRow.id,
      incident_id: claimRow.incident_id || 0,
      created_at: claimRow.created_at || new Date().toISOString(),
      updated_at: claimRow.updated_at || new Date().toISOString(),
      area_id: claimRow.area_id || 0,
      isSynced: false,
      answers: answersFormatted,
      main_panel_id: claimRow.main_panel_id || 0
    });
  }
  console.log(claims);
  return claims;
};

export const insertUnsyncedClaim=async(db:SQLiteDatabase,unsyncedClaim:any)=>{
    const result=await db.executeSql(
  `INSERT OR REPLACE INTO unsynced_claims(
    form_id, incident_id, area_id, isSynced
  ) VALUES (?, ?, ?, ?);`,
  [
    unsyncedClaim.form_id,
    unsyncedClaim.incident_id,
    unsyncedClaim.area_id,
    unsyncedClaim.isSynced
  ]
);
  const insertId = (result[0] as any).insertId;

  if (!insertId) return null;


  const selectResult = await db.executeSql(
    `SELECT * FROM unsynced_claims WHERE id = ?;`,
    [insertId]
  );

  const rows = selectResult[0].rows;
  if (rows.length > 0) {
    return rows.item(0); 
  }

  return null;

}