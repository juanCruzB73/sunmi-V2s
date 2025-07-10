import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { IVehicle } from '../../types/modal/IVehicle';

export const createVehicleTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS vehicle (
      vehicleId INTEGER PRIMARY KEY,     -- ID único del vehículo
      patente TEXT NOT NULL,             -- Matrícula del vehículo
      description TEXT,                  -- Descripción opcional
      date TEXT NOT NULL,                -- Fecha de registro (formato ISO)
      synced INTEGER DEFAULT 0           -- Estado de sincronización (0: pendiente, 1: enviado)
    );
  `;
  await db.executeSql(query);           // Crea la tabla si no existe
};

export const insertVehicle = async (
  db: SQLiteDatabase,
  vehicle: IVehicle & { synced?: boolean }
): Promise<void> => {
  const query = `
    INSERT OR REPLACE INTO vehicle (vehicleId, patente, description, date, synced)
    VALUES (?, ?, ?, ?, ?);
  `;
  await db.executeSql(query, [
    vehicle.vehicleId,                       // Identificador único
    vehicle.patente,                         // Patente del vehículo
    vehicle.description,                     // Detalles opcionales
    vehicle.date.toISOString(),              // Fecha como string ISO
    vehicle.synced ? 1 : 0,                  // Marca como sincronizado si se indica
  ]);
};

export const getPendingVehicles = async (
  db: SQLiteDatabase
): Promise<(IVehicle & { synced?: boolean })[]> => {
  const result = await db.executeSql('SELECT * FROM vehicle WHERE synced = 0;');
  const vehicles: (IVehicle & { synced?: boolean })[] = [];

  for (let i = 0; i < result[0].rows.length; i++) {
    vehicles.push(result[0].rows.item(i));   // Extrae fila por fila desde SQLite
  }

  return vehicles;                           // Devuelve todos los vehículos sin sincronizar
};

export const markVehicleAsSynced = async (
  db: SQLiteDatabase,
  vehicleId: number
): Promise<void> => {
  await db.executeSql('UPDATE vehicle SET synced = 1 WHERE vehicleId = ?;', [vehicleId]);
};