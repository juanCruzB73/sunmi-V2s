import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { IClaim } from '../../types/claims/IClaim';

export const createClaimsTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS claims (
      id INTEGER PRIMARY KEY NOT NULL,
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
      incident_id INTEGER,
      created_at TEXT,
      updated_at TEXT,
      area_id INTEGER,
      isSynced INTEGER DEFAULT 0,
      main_panel_id INTEGER
    );
  `;
<<<<<<< HEAD
  console.log("🧱 Verificando existencia de tabla 'claims'");

  await db.executeSql(query);
  console.log("✅ Tabla 'claims' lista");

=======
  await db.executeSql(query);
};

export const dropClaimsTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `DROP TABLE IF EXISTS claims;`;
  await db.executeSql(query);
>>>>>>> 59cf2f0 (falta implementar claims offline(update,insert,get,delete))
};

export const insertClaim = async (db: SQLiteDatabase, claim: IClaim): Promise<void> => {
  const query = `
    INSERT OR IGNORE INTO claims (
      id, status, type, date, removed_at, removed, reason, user_id, removed_user_id,
      status_type_id, form_id, incident_id, created_at, updated_at, area_id, isSynced, main_panel_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  const params = [
    claim.id,
    claim.status,
    claim.type,
    claim.date,
    claim.removed_at,
    claim.removed ? 1 : 0,
    claim.reason,
    claim.user_id,
    claim.removed_user_id,
   // claim.status_type_id,
    claim.form_id,
    claim.incident_id,
    claim.created_at,
    claim.updated_at,
    claim.area_id,
    0,
    claim.main_panel_id

  ];

  await db.executeSql(query, params);
};

export const updateClaim = async (db: SQLiteDatabase, claim: IClaim): Promise<void> => {
  const query = `
    UPDATE claims SET
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
      incident_id = ?,
      created_at = ?,
      updated_at = ?,
      area_id = ?,
      isSynced = ?,
      main_panel_id = ?
    WHERE id = ?;
  `;

<<<<<<< HEAD
  for (let i = 0; i < claimRows.length; i++) {
    const row = claimRows.item(i);
    claims.push({
      id: row.id,
      status: row.status,
      type: row.type,
      date: row.date,
      removed_at: row.removed_at,
      removed: row.removed === 1,
      reason: row.reason,
      user_id: row.user_id,
      removed_user_id: row.removed_user_id,
      //status_type_id: row.status_type_id,
      form_id: row.form_id,
      incident_id: row.incident_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      area_id: row.area_id,
      isSynced: row.isSynced === 1,
      answers: []
    });
  }

  return claims;
};

// 🧹 Elimina reclamos de prueba con razón "Control de rutina"
export const eliminarClaimsDePrueba = async (db: SQLiteDatabase): Promise<void> => {
  await db.executeSql('DELETE FROM claims WHERE reason = "Control de rutina"');
  console.log("🧹 Reclamos de prueba eliminados manualmente");
};
=======
  const params = [
    claim.status,
    claim.type,
    claim.date,
    claim.removed_at,
    claim.removed ? 1 : 0,
    claim.reason,
    claim.user_id,
    claim.removed_user_id,
    claim.status_type_id,
    claim.form_id,
    claim.incident_id,
    claim.created_at,
    claim.updated_at,
    claim.area_id,
    claim.isSynced,
    claim.main_panel_id,
    claim.id
  ];

  await db.executeSql(query, params);
};

export const deleteClaim = async (db: SQLiteDatabase, claimId: number): Promise<void> => {
  const query = `
    DELETE FROM claims WHERE id = ?;
  `;

  await db.executeSql(query, [claimId]);
};

export const getUnsyncedClaims = async (db: SQLiteDatabase) => {
  const results = await db.executeSql('SELECT * FROM claims WHERE isSynced = 0');

  // `results` is usually an array of [ResultSet], need to extract rows
  const rows: IClaim[] = [];
  const len = results[0].rows.length;
  for (let i = 0; i < len; i++) {
    rows.push(results[0].rows.item(i));
  }

  const mappedUnsyncedClaims: IClaim[] = rows.map((claim: any) => ({
    id: claim.id,
    status: claim.status,
    panel_id: claim.panel_id,
    type: claim.type,
    date: claim.date,
    removed_at: claim.removed_at,
    removed: claim.removed,
    reason: claim.reason,
    user_id: claim.user_id,
    removed_user_id: claim.removed_user_id,
    status_type_id: claim.status_type_id,
    form_id: claim.form_id,
    incident_id: claim.incident_id,
    created_at: claim.created_at,
    updated_at: claim.updated_at,
    area_id: claim.area_id,
    isSynced: claim.isSynced,
    answers: claim.answers,
    main_panel_id: claim.main_panel_id,
  }));

  return mappedUnsyncedClaims;
};
>>>>>>> 59cf2f0 (falta implementar claims offline(update,insert,get,delete))
