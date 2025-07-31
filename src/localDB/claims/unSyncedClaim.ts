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
        main_panel_id INTEGER,
        isSynced INTEGER
      );
    `);
  } catch (err) {
    console.error("Error creating unsynced_claims table:", err);
  }
};


export const getOfflineUnsyncedClaims = async ():Promise<unSyncedClaim[]> => {
    const db = await getDBConnection();
    const results = await db.executeSql(`SELECT * FROM unsynced_claims;`);
    const rows = results[0].rows;
    const claims: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    const claimRow = rows.item(i);
    const answers = await getUnsycedAnswersByClaimId(db, claimRow.id);
    const answersFormatted = answers.map(answer => ({
      id:answer.id,
      input_string: answer.input_string,
      question_id: answer.question_id,
      question: answer.question
    }));

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
  return claims;
};

export const insertUnsyncedClaim=async(db:SQLiteDatabase,unsyncedClaim:any)=>{
  
    const result=await db.executeSql(
      `INSERT OR REPLACE INTO unsynced_claims(
        form_id, incident_id, area_id, main_panel_id, isSynced
      ) VALUES (?, ?, ?, ?, ?);`,
    [
      unsyncedClaim.form_id,
      unsyncedClaim.incident_id,
      unsyncedClaim.area_id,
      unsyncedClaim.main_panel_id,
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

export const deleteUnsyncedClaim=async(db:SQLiteDatabase,claimId:number)=>{
  await db.executeSql(
      `DELETE FROM unsynced_claims WHERE id = ?;`,
    [claimId]
    );
}

export const getUnsyncedClaimById=async(db:SQLiteDatabase,claimId:number)=>{
    const result=await db.executeSql(
      `SELECT * FROM unsynced_claims WHERE id = ?;`,
    [claimId]
    );
    const row = result[0].rows.item(0);
    const answer = await getUnsycedAnswersByClaimId(db, row.id);
    const answersFormatted = answer.map(answer => ({
      id:answer.id,
      input_string: answer.input_string,
      question_id: answer.question_id,
      question: answer.question
    }));
    const data={
      id: row.id,
      status: row.status,
      form_id: row.form_id,
      panel_id: row.panel_id,
      type: row.type || 'default',
      date: row.date || new Date().toISOString(),
      removed_at: row.removed_at || null,
      removed: row.removed || false,
      reason: row.reason || null,
      user_id: row.user_id,
      removed_user_id: row.removed_user_id || null,
      status_type_id: row.status_type_id || 0,
      claim_id: row.id,
      incident_id: row.incident_id || 0,
      created_at: row.created_at || new Date().toISOString(),
      updated_at: row.updated_at || new Date().toISOString(),
      area_id: row.area_id || 0,
      isSynced: false,
      answers: answersFormatted,
      main_panel_id: row.main_panel_id || 0
    }
    return data;
}