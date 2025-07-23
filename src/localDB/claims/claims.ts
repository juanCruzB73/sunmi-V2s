import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { IClaim } from '../../types/claims/IClaim';

// 🧱 Crea la tabla 'claims' en SQLite si no existe
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
      isSynced INTEGER DEFAULT 0
    );
  `;
  console.log("🧱 Verificando existencia de tabla 'claims'");

  await db.executeSql(query);
  console.log("✅ Tabla 'claims' lista");

};

// 📥 Inserta o reemplaza un reclamo en la base local
export const insertClaim = async (db: SQLiteDatabase, claim: IClaim): Promise<void> => {
  const query = `
    INSERT OR REPLACE INTO claims (
      id, status, type, date, removed_at, removed, reason, user_id, removed_user_id,
      status_type_id, form_id, incident_id, created_at, updated_at, area_id, isSynced
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
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
    claim.isSynced ? 1 : 0
  ];

  await db.executeSql(query, params);
};

// 🔍 Obtiene todos los claims que aún no fueron sincronizados
export const getUnsyncedClaims = async (db: SQLiteDatabase): Promise<IClaim[]> => {
  const results = await db.executeSql('SELECT * FROM claims WHERE isSynced = 0');
  const claimRows = results[0].rows;
  const claims: IClaim[] = [];

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