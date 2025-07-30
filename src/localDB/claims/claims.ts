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
  await db.executeSql(query);
};

export const dropClaimsTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `DROP TABLE IF EXISTS claims;`;
  await db.executeSql(query);
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
    claim.status_type_id,
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