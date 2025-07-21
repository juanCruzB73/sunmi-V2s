import { AppDispatch } from '../../store';
import { IAuthToken } from '../../../types/IAuthToken';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onCheckingForms, onLoadForms, onSetErrorMessage } from './formSlice';
import { getDBConnection } from '../../../localDB/db';
import { createFormsTable, dropFormsTable, insertForm } from '../../../localDB/forms/forms';
import { createQuestionsTable, dropQuestionsTable } from '../../../localDB/questions/questions';
import { createQuestionOptionsTable, dropQuestionOptionsTable } from '../../../localDB/questions/questionOptions';

const setTokenHeader = (tokenData: IAuthToken) => {
  const headers = {
    "access-token": tokenData.accessToken ?? "",
    "client": tokenData.client ?? "",
    "uid": tokenData.uid ?? "",
    "token-type": "Bearer",
    "Accept": "*/*"
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

      const response = await fetch(`https://0c265f18c4b7.ngrok-free.app/api/v1/forms/visible`, { headers: headers });
      const data = await response.json();
      
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