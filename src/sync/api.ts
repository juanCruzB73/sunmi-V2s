import { IAnswer } from '../types/claims/IAnswer';
import { IClaim } from '../types/claims/IClaim';

const API_BASE = 'https://0c265f18c4b7.ngrok-free.app/api/v1/forms/visible/claims';

export const api = {
  sendAnswer: async (answer: IAnswer): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Authorization: `Bearer ${token}` // ← Si usás autenticación, podés agregarlo
        },
        body: JSON.stringify(answer)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      throw error; // Se maneja en syncAnswers.ts
    }
  },

  sendClaim: async (claim: IClaim): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/claims`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(claim)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      throw error; // Se maneja en syncClaims.ts
    }
  }
};