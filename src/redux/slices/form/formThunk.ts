import { AppDispatch } from '../../store';
import { IAuthToken } from '../../../types/IAuthToken';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onCheckingForms, onLoadForms, onSetErrorMessage } from './formSlice';
import { getDBConnection } from '../../../localDB/db';
import { createFormsTable, dropFormsTable, insertForm } from '../../../localDB/forms/forms';
import { createQuestionsTable, dropQuestionsTable } from '../../../localDB/questions/questions';
import { createQuestionOptionsTable, dropQuestionOptionsTable } from '../../../localDB/questions/questionOptions';
<<<<<<< HEAD
=======
import { API_BASE_URL3 } from '@env';
>>>>>>> 80b9552 (commit before main_panel in claim)

const setTokenHeader = (tokenData: IAuthToken) => {
  const headers = {
    "access-token": tokenData.accessToken ?? "",
    "client": tokenData.client ?? "",
    "uid": tokenData.uid ?? "",
    "token-type": "Bearer",
    "Accept": "*/*",
    "ngrok-skip-browser-warning": "69420"
  };
  return headers;
};

export const startLoadForms = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(onCheckingForms());
      
      const db = await getDBConnection();
      await dropFormsTable(db)
      await dropQuestionOptionsTable(db);
      await dropQuestionsTable(db);
      await createQuestionOptionsTable(db);
      await createQuestionsTable(db);
      await createFormsTable(db);

      const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
      const tokenObject: { [key: string]: string | null } = Object.fromEntries(values);
      const tokenData: IAuthToken = {
        accessToken: tokenObject['access-token'] ?? '',
        client: tokenObject['client'] ?? '',
        uid: tokenObject['uid'] ?? '',
      };
      const headers = setTokenHeader(tokenData);
<<<<<<< HEAD

      const response = await fetch(`https://6fb2b3471d09.ngrok-free.app/api/v1/forms/visible`, { headers: headers });
=======
      const response = await fetch(`${API_BASE_URL3}/api/v1/forms/visible`, { headers: headers });
>>>>>>> 80b9552 (commit before main_panel in claim)
      const data = await response.json();
      console.log('Forms data:', data);
      console.log('Headers:', response);
      for (const form of data) {
        
        await insertForm(db, form);
      }

      dispatch(onLoadForms(data))
      dispatch(onSetErrorMessage(null));

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(message);
      dispatch(onSetErrorMessage("Error al cargar formularios"));
      return false;
    }
  };
};