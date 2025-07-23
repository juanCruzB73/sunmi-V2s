import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { getUnsyncedClaims } from '../localDB/claims/claims';
import { IClaim } from '../types/claims/IClaim';
import { IAnswer } from '../types/claims/IAnswer';
import { api } from './api';
import { getAnswersByClaimId } from '../localDB/claims/answers';

const validarClaim = (claim: IClaim): string[] => {
  const errores: string[] = [];

  if (!claim.form_id) errores.push('🛑 form_id es requerido');
  if (!claim.incident_id) errores.push('🛑 incident_id es requerido');
  if (!claim.area_id) errores.push('🛑 area_id es requerido');

  if (!Array.isArray(claim.answers) || claim.answers.length === 0) {
    errores.push('🛑 No hay answers disponibles');
  } else {
    claim.answers.forEach((answer, i) => {
      if (!answer.input_string?.trim()) errores.push(`🛑 input_string vacío en answer[${i}]`);
      if (!answer.question_id) errores.push(`🛑 question_id faltante en answer[${i}]`);
    });
  }

  return errores;
};

export const syncClaims = async (db: SQLiteDatabase): Promise<void> => {
  console.log("🧠 syncClaims arrancó");

  const claims: IClaim[] = await getUnsyncedClaims(db);
  console.log(`📦 Reclamos pendientes: ${claims.length}`);

  for (const claim of claims) {
    try {
      const answers: IAnswer[] = await getAnswersByClaimId(db, claim.id);
      claim.answers = answers;

      const errores = validarClaim(claim);
      if (errores.length > 0) {
        console.log(`⚠️ Claim #${claim.id} contiene errores:`);
        errores.forEach(err => console.log(err));
        continue;
      }

      const payload = {
        claim: {
          form_id: claim.form_id,
          incident_id: claim.incident_id,
          //status_type_id: claim.status_type_id,
          area_id: claim.area_id,
          answers_attributes: answers.map(a => ({
            input_string: a.input_string,
            question_id: String(a.question_id)
          }))
        }
      };

      console.log(`📤 Enviando claim #${claim.id}:`, JSON.stringify(payload, null, 2));
      await api.sendClaim(payload);
      console.log("🧾 Payload para claim #" + claim.id, JSON.stringify(payload, null, 2));

      await db.executeSql('UPDATE claims SET isSynced = 1 WHERE id = ?', [claim.id]);
      console.log(`✅ Claim #${claim.id} marcado como sincronizado`);
    } catch (error) {
      console.log(`[SYNC] ❌ Error al sincronizar claim #${claim.id}:`, error);
    }
  }
};