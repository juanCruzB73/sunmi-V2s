import {  API} from '@env';

const CLAIMS_ENDPOINT = `${API}/api/v1/forms/visible/claims`;

interface AnswerAttribute {
  input_string: string;
  question_id: number | string;
}

interface ClaimWrapper {
  claim: {
    form_id: number;
    incident_id: number;
    //status_type_id: number;
    area_id: number;
    answers_attributes: AnswerAttribute[];
  };
}

export const api = {
  sendClaim: async (claimWrapper: ClaimWrapper): Promise<void> => {
    try {
      console.log('📤 Enviando claim con payload:', JSON.stringify(claimWrapper, null, 2));
      console.log('🧪 Claves internas:', Object.keys(claimWrapper.claim));

      const response = await fetch(CLAIMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(claimWrapper)
      });

      const text = await response.text();

      // 🔍 Extraer mensaje útil desde el HTML si hay error
      let errorMessage = '❌ No se pudo extraer mensaje útil del HTML';
      const preMatch = text.match(/<pre[^>]*>(.*?)<\/pre>/s);
      if (preMatch) {
        errorMessage = preMatch[1].trim();
      } else {
        const divMatch = text.match(/<div class="message">(.+?)<\/div>/s);
        if (divMatch) {
          errorMessage = divMatch[1].trim();
        } else {
          const spanMatch = text.match(/<span class="message">(.+?)<\/span>/s);
          if (spanMatch) {
            errorMessage = spanMatch[1].trim();
          }
        }
      }

      console.log(`📨 Respuesta del servidor (claim): ${response.status}`);
      console.log(`🧵 Error Rails extraído:\n${errorMessage}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  },
  
};