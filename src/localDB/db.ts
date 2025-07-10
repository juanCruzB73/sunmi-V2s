import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { createFinesTable } from './fine/fines';
import { createCommerceTable } from './commerce/commerce';
import { createVehicleTable } from './vehicle/vehicle';

SQLite.enablePromise(true);  // Habilita el uso de promesas en SQLite para manejar operaciones asíncronas


export const getDBConnection = async (): Promise<SQLiteDatabase> => {
  return SQLite.openDatabase({ name: 'app_data.db', location: 'default' });// Abre o crea la base de datos 'app_data.db' en la ubicación predeterminada
};

export const createTables = async (db: SQLiteDatabase): Promise<void> => {
  await createFinesTable(db);       // Crea la tabla para guardar multas offline
  await createCommerceTable(db);    // Crea la tabla para comercios
  await createVehicleTable(db);     // Crea la tabla para vehículos
};
