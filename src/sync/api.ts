import axios from 'axios';
import { IAnswer } from '../types/claims/IAnswer';
import { IClaim } from '../types/claims/IClaim';


const API_BASE = 'https://0c265f18c4b7.ngrok-free.app/api/v1/forms/visible/claims';

export const api = {
  sendAnswer: async (answer: IAnswer): Promise<void> => {
    try {
      await axios.post(`${API_BASE}/answers`, answer);
    } catch (error) {
      throw error; // se maneja en syncAnswers
    }
  },

  sendClaim: async (claim: IClaim): Promise<void> => {
    try {
      await axios.post(`${API_BASE}/claims`, claim);
    } catch (error) {
      throw error;
    }
  }
};