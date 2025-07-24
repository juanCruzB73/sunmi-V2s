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
