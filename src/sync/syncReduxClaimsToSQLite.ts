import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { getUnsyncedClaims, insertClaim } from '../localDB/claims/claims';
import { IClaim } from '../types/claims/IClaim';

export const syncReduxClaimsToSQLite = async (
  db: SQLiteDatabase,
  reduxClaims: IClaim[]
): Promise<void> => {
  const unsyncedInDB = await getUnsyncedClaims(db);
  const unsyncedIdsInDB = new Set(unsyncedInDB.map(c => c.id));

  for (const claim of reduxClaims) {
    if (!unsyncedIdsInDB.has(claim.id)) {
      await insertClaim(db, { ...claim, isSynced: false });
      console.log(`📥 Claim insertado manualmente en SQLite: ${claim.id}`);
    }
  }

  console.log(`✅ Reclamos sincronizados con SQLite: ${reduxClaims.length}`);
};