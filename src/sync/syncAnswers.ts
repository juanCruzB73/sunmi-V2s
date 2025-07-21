import { SQLiteDatabase } from 'react-native-sqlite-storage'; // Acceso a base de datos local
import { IAnswer } from '../types/claims/IAnswer';             // Interfaz de respuesta (answer)
import { getUnsyncedAnswers } from '../localDB/claims/answers';// Obtiene answers no sincronizados
import { api } from './api';                                   // Cliente HTTP para enviar datos al backend

export const syncAnswers = async (db: SQLiteDatabase): Promise<void> => {
  const unsyncedAnswers: IAnswer[] = await getUnsyncedAnswers(db); // Obtiene todos los answers pendientes

  for (const answer of unsyncedAnswers) {
    try {
      await api.sendAnswer(answer); // Envia al servidor vía HTTP
      await db.executeSql('UPDATE answers SET isSynced = 1 WHERE id = ?', [answer.id]); // Marca como sincronizado
    } catch (error) {
      console.log(`[SYNC] Error al sincronizar answer #${answer.id}:`, error); // Registra error si falla
    }
  }
};