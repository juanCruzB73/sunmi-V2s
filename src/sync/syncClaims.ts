import { SQLiteDatabase } from 'react-native-sqlite-storage';     // Base de datos local
import { getUnsyncedClaims } from '../localDB/claims/claims';     // Reclamos no sincronizados
import { IClaim } from '../types/claims/IClaim';                  // Interfaz del modelo claim
import { api } from './api';                                      // Cliente Axios

export const syncClaims = async (db: SQLiteDatabase): Promise<void> => {
  const unsyncedClaims: IClaim[] = await getUnsyncedClaims(db); // Recupera reclamos pendientes

  for (const claim of unsyncedClaims) {
    try {
      await api.sendClaim(claim); // Envia al backend
      await db.executeSql('UPDATE claims SET isSynced = 1 WHERE id = ?', [claim.id]); // Marca como sincronizado
    } catch (error) {
      console.log(`[SYNC] Error al sincronizar claim #${claim.id}:`, error); // Registra fallo en consola
    }
  }
};