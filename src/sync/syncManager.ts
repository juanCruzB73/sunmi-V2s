<<<<<<< HEAD
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
=======
//import NetInfo from '@react-native-community/netinfo'; // Detecta estado de red
//import { syncAnswers } from './syncAnswers';           // Sincroniza respuestas
//import { syncClaims } from './syncClaims';             // Sincroniza reclamos
//import { getDBConnection } from '../localDB/db';       // Abre conexión a la DB
//
//export const triggerSync = async () => {
//  const state = await NetInfo.fetch(); // Obtiene estado de red actual
//  if (!state.isConnected || state.type !== 'wifi') return; // Evita sincronizar si no hay conexión o no es WiFi
//
//  const db = await getDBConnection(); // Abre conexión a SQLite
//  await syncAnswers(db);              // Ejecuta sincronización de answers
//  await syncClaims(db);               // Ejecuta sincronización de claims
//};
>>>>>>> 783637a (DELETE de claims DBLocal implementado)
