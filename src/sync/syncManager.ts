import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { syncClaims } from './syncClaims';

// 🔁 Ejecuta sincronización de claims y luego respuestas
export const triggerSync = async (db: SQLiteDatabase): Promise<void> => {
  console.log('🟡 triggerSync ejecutado');

  try {
    console.log('syncManager.ts:16  EJECUTANDO SYNCCLAIMS');
    await syncClaims(db);


    console.log('✅ Sincronización completa');
  } catch (error) {
    console.log('⛔ Error en triggerSync:', error);
  }
};