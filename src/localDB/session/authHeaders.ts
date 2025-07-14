import { SQLiteDatabase } from "react-native-sqlite-storage";
import { IAuthHeaders } from "../../types/authentication/auth";

// ⚙️ Verifica si la tabla existe
const tableExists = async (db: SQLiteDatabase, tableName: string): Promise<boolean> => {
  const results = await db.executeSql(
    `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
    [tableName]
  );
  return results[0].rows.length > 0;
};

// 🔧 Crear tabla si no existe
export const createAuthHeadersTable = async (db: SQLiteDatabase): Promise<void> => {
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS auth_headers (
      id INTEGER PRIMARY KEY NOT NULL,
      accessToken TEXT NOT NULL,
      client TEXT NOT NULL,
      uid TEXT NOT NULL
    );
  `);
};

// 💾 Guardar headers
export const saveHeaders = async (db: SQLiteDatabase, headers: IAuthHeaders): Promise<void> => {
  const exists = await tableExists(db, "auth_headers");
  if (!exists) await createAuthHeadersTable(db);

  await db.executeSql(
    `REPLACE INTO auth_headers (id, accessToken, client, uid) VALUES (1, ?, ?, ?)`,
    [headers.accessToken, headers.client, headers.uid]
  );
};

// 📦 Obtener headers
export const getHeaders = async (db: SQLiteDatabase): Promise<IAuthHeaders | null> => {
  const exists = await tableExists(db, "auth_headers");
  if (!exists) return null;

  const results = await db.executeSql(`SELECT * FROM auth_headers WHERE id = 1`);
  const row = results[0].rows.length > 0 ? results[0].rows.item(0) : null;
  return row
    ? {
        accessToken: row.accessToken,
        client: row.client,
        uid: row.uid,
      }
    : null;
};

// 🧼 Borrar headers
export const clearHeaders = async (db: SQLiteDatabase): Promise<void> => {
  const exists = await tableExists(db, "auth_headers");
  if (!exists) return;

  await db.executeSql(`DELETE FROM auth_headers WHERE id = 1`);
};