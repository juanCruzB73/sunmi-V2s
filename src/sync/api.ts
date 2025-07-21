import axios from 'axios';                                   // Cliente HTTP
import { IAnswer } from '../types/claims/IAnswer';           // Interfaz de respuestas
import { IClaim } from '../types/claims/IClaim';             // Interfaz de reclamos

const API_BASE = 'https://0c265f18c4b7.ngrok-free.app/api/v1/forms/visible/claims'; // URL base para tu API

export const api = {
  sendAnswer: async (answer: IAnswer): Promise<void> => {
    try {
      await axios.post(`${API_BASE}/answers`, answer);       // Envia respuesta al endpoint /answers
    } catch (error) {
      throw error; // El error se maneja en syncAnswers.ts
    }
  },

  sendClaim: async (claim: IClaim): Promise<void> => {
    try {
      await axios.post(`${API_BASE}/claims`, claim);         // Envia reclamo al endpoint /claims
    } catch (error) {
      throw error; // El error se maneja en syncClaims.ts
    }
  }
};