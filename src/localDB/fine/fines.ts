import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { IFineType } from '../../types/fine/IFineType';
export const createFinesTable = async (db: SQLiteDatabase) => {
  const query = `
    CREATE TABLE IF NOT EXISTS fines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,     -- ID local autogenerado
      fineTypeId INTEGER NOT NULL,              -- ID del tipo de multa
      fineTypeName TEXT NOT NULL,               -- Nombre del tipo de multa
      description TEXT,                         -- Descripción de la infracción
      date TEXT NOT NULL,                       -- Fecha en formato ISO
      synced INTEGER DEFAULT 0                  -- Estado de sincronización (0 = pendiente, 1 = sincronizado)
    );
  `;
  await db.executeSql(query); // Ejecuta la creación de la tabla si aún no existe
};

export const insertFine = async (
  db: SQLiteDatabase,
  fine: IFineType & { description: string; date: Date; synced?: boolean }
) => {
  const query = `
    INSERT INTO fines (fineTypeId, fineTypeName, description, date, synced)
    VALUES (?, ?, ?, ?, ?);
  `;
  await db.executeSql(query, [
    fine.fineTypeId,                          // ID del tipo de multa
    fine.fineTypeName,                        // Nombre descriptivo
    fine.description,                         // Texto de la multa (opcional)
    fine.date.toISOString(),                  // Fecha convertida a string ISO
    fine.synced ? 1 : 0,                      // Flag para saber si ya está sincronizada
  ]);
};

export const getPendingFines = async (
  db: SQLiteDatabase
): Promise<(IFineType & { id: number; description: string; date: string })[]> => {
  const result = await db.executeSql('SELECT * FROM fines WHERE synced = 0;');
  const fines: (IFineType & { id: number; description: string; date: string })[] = [];

  for (let i = 0; i < result[0].rows.length; i++) {
    fines.push(result[0].rows.item(i));       // Extrae cada multa pendiente y la agrega al array
  }

  return fines;                               // Devuelve la lista para que `syncFinesToServer()` la procese
};

export const markFineAsSynced = async (db: SQLiteDatabase, id: number): Promise<void> => {
  await db.executeSql('UPDATE fines SET synced = 1 WHERE id = ?;', [id]); // Actualiza el estado de `synced`

};