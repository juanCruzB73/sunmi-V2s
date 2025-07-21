import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { getUnsyncedClaims } from '../localDB/claims/claims';
import { IClaim } from '../types/claims/IClaim';
import { api } from './api';


export const syncClaims = async (db: SQLiteDatabase): Promise<void> => {
  const unsyncedClaims: IClaim[] = await getUnsyncedClaims(db);

  for (const claim of unsyncedClaims) {
    try {
      await api.sendClaim(claim); // ← tu endpoint
      await db.executeSql('UPDATE claims SET isSynced = 1 WHERE id = ?', [claim.id]);
    } catch (error) {
      console.log(`[SYNC] Error al sincronizar claim #${claim.id}:`, error);
    }
  }
};