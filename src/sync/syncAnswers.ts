import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { IAnswer } from '../types/claims/IAnswer';
import { getUnsyncedAnswers } from '../localDB/claims/answers';
import { api } from './api';

export const syncAnswers = async (db: SQLiteDatabase): Promise<void> => {
  const unsyncedAnswers: IAnswer[] = await getUnsyncedAnswers(db);

  for (const answer of unsyncedAnswers) {
    try {
      await api.sendAnswer(answer); // ← tu endpoint
      await db.executeSql('UPDATE answers SET isSynced = 1 WHERE id = ?', [answer.id]);
    } catch (error) {
      console.log(`[SYNC] Error al sincronizar answer #${answer.id}:`, error);
    }
  }
};