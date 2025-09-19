import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { IClaim } from '../../types/claims/IClaim';
import { getDBConnection } from '../db';

export const createClaimsTable = async (db: SQLiteDatabase): Promise<void> => {
  // Crear tabla si no existe
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS claims (
      id INTEGER PRIMARY KEY NOT NULL,   
      local_id INTEGER,                  
      status TEXT,
      type TEXT,
      date TEXT,
      removed_at TEXT,
      removed INTEGER,
      reason TEXT,
      user_id INTEGER,
      removed_user_id INTEGER,
      status_type_id INTEGER,
      form_id INTEGER,
      panel_id INTEGER,
      incident_id INTEGER,
      created_at TEXT,
      updated_at TEXT,
      area_id INTEGER,
      isSynced INTEGER,
      main_panel_id INTEGER
    );
  `);

  // 🔑 Migración: si la tabla ya existía y no tenía local_id, lo agregamos
  try {
    const result = await db.executeSql(`PRAGMA table_info(claims);`);
    const columns = [];
    const rows = result[0].rows;
    for (let i = 0; i < rows.length; i++) {
      columns.push(rows.item(i).name);
    }

    if (!columns.includes("local_id")) {
      await db.executeSql(`ALTER TABLE claims ADD COLUMN local_id INTEGER;`);
      console.log("Columna local_id agregada a claims ✅");
    }
  } catch (e) {
    console.error("Error verificando/agregando columna local_id:", e);
  }
};


export const dropClaimsTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `DROP TABLE IF EXISTS claims;`;
  await db.executeSql(query);
};

export const insertClaim = async (db: SQLiteDatabase, claim: IClaim): Promise<void> => {
  try {
    const insertQuery = `
      INSERT OR REPLACE INTO claims (
        id,
        local_id,
        status,
        type,
        date,
        removed_at,
        removed,
        reason,
        user_id,
        removed_user_id,
        status_type_id,
        form_id,
        panel_id,
        incident_id,
        created_at,
        updated_at,
        area_id,
        isSynced,
        main_panel_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const params = [
      claim.id ?? null,                // remote_id
      (claim as any).local_id ?? null, // 🔑 persistimos el local_id
      claim.status ?? null,
      claim.type ?? null,
      claim.date ?? null,
      claim.removed_at ?? null,
      claim.removed ? 1 : 0,
      claim.reason ?? null,
      claim.user_id ?? null,
      claim.removed_user_id ?? null,
      claim.status_type_id ?? null,
      claim.form_id ?? null,
      claim.panel_id ?? null,
      claim.incident_id ?? null,
      claim.created_at ?? null,
      claim.updated_at ?? null,
      claim.area_id ?? null,
      claim.isSynced ? 1 : 0,
      claim.main_panel_id ?? null,
    ];

    await db.executeSql(insertQuery, params);
  } catch (e) {
    console.error(`Error inserting claim ${claim.id}:`, e);
  }
};




export const updateClaim = async (db: SQLiteDatabase, claim: IClaim): Promise<void> => {
  try {
    const query = `
      UPDATE claims SET
        local_id = ?,          
        status = ?,
        type = ?,
        date = ?,
        removed_at = ?,
        removed = ?,
        reason = ?,
        user_id = ?,
        removed_user_id = ?,
        status_type_id = ?,
        form_id = ?,
        panel_id = ?,
        incident_id = ?,
        created_at = ?,
        updated_at = ?,
        area_id = ?,
        isSynced = ?,
        main_panel_id = ?
      WHERE id = ?;
    `;

    const params = [
      (claim as any).local_id ?? null, // 🔑 persistimos el local_id
      claim.status ?? null,
      claim.type ?? null,
      claim.date ?? null,
      claim.removed_at ?? null,
      claim.removed ? 1 : 0,
      claim.reason ?? null,
      claim.user_id ?? null,
      claim.removed_user_id ?? null,
      claim.status_type_id ?? null,
      claim.form_id ?? null,
      claim.panel_id ?? null,
      claim.incident_id ?? null,
      claim.created_at ?? null,
      claim.updated_at ?? null,
      claim.area_id ?? null,
      claim.isSynced ? 1 : 0,
      claim.main_panel_id ?? null,
      claim.id, // remote_id
    ];

    await db.executeSql(query, params);
  } catch (e) {
    console.error(`Error updating claim ${claim.id}:`, e);
  }
};


export const deleteClaim = async (db: SQLiteDatabase, claimId: number): Promise<void> => {
  const query = `
    DELETE FROM claims WHERE id = ?;
  `;

  await db.executeSql(query, [claimId]);
};

export const removeClaimOffline = async (claimId: number): Promise<void> => {
  const db = await getDBConnection();
  await deleteClaim(db, claimId);

  const res = await db.executeSql('SELECT * FROM claims WHERE id = ?;', [claimId]);
};