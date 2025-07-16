import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { ICommerce } from '../../types/modal/ICommerce';

export const createCommerceTable = async (db: SQLiteDatabase) => {
  const query = `
    CREATE TABLE IF NOT EXISTS commerce (
      commerceId INTEGER PRIMARY KEY,          // Clave única del comercio
      rutcommerce TEXT NOT NULL,               // Identificador tributario (rut)
      description TEXT,                        // Descripción opcional del comercio
      date TEXT NOT NULL,                      // Fecha de registro
      synced INTEGER DEFAULT 0                 // Flag para saber si está sincronizado (0: pendiente, 1: enviado)
    );
  `;
  await db.executeSql(query); // Ejecuta la creación de la tabla en SQLite
};


export const insertCommerce = async (
  db: SQLiteDatabase,
  commerce: ICommerce & { synced?: boolean }
): Promise<void> => {
  const query = `
    INSERT OR REPLACE INTO commerce (commerceId, rutcommerce, description, date, synced)
    VALUES (?, ?, ?, ?, ?);
  `;
  await db.executeSql(query, [
    commerce.commerceId,                      // ID único del comercio
    commerce.rutcommerce,                     // RUT del comercio
    commerce.description,                     // Descripción del caso
    commerce.date.toISOString(),              // Fecha en formato ISO
    commerce.synced ? 1 : 0,                  // Lo marcamos como sincronizado si viene definido
  ]);
};


export const getPendingCommerce = async (
  db: SQLiteDatabase
): Promise<(ICommerce & { synced?: boolean })[]> => {
  const result = await db.executeSql('SELECT * FROM commerce WHERE synced = 0;');  // Consulta para obtener comercios pendientes de sincronización
  const pending: (ICommerce & { synced?: boolean })[] = [];

  for (let i = 0; i < result[0].rows.length; i++) {
    pending.push(result[0].rows.item(i));
  }

  return pending;
};

export const markCommerceAsSynced = async (db: SQLiteDatabase, commerceId: number): Promise<void> => {
  await db.executeSql('UPDATE commerce SET synced = 1 WHERE commerceId = ?;', [commerceId]); // Actualiza el estado de sincronización del comercio
};

//update
//delete