import { AppDispatch } from '../../store';
import { IAuthToken } from '../../../types/IAuthToken';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onCheckingForms, onLoadForms, onSetErrorMessage } from './formSlice';
import { getDBConnection } from '../../../localDB/db';

import { saveFormOffline, startOfflineForms } from './offlineFormThunk';
import { API_BASE_URL } from '@env';
import { insertQuestionWithOptions } from '../../../localDB/questions/questions';


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
      const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
      const tokenObject: { [key: string]: string | null } = Object.fromEntries(values);
      const tokenData: IAuthToken = {
        accessToken: tokenObject['access-token'] ?? '',
        client: tokenObject['client'] ?? '',
        uid: tokenObject['uid'] ?? '',
      };
      const headers = setTokenHeader(tokenData);
      const response = await fetch(`${API_BASE_URL}/api/v1/forms/visible`, { headers: headers });
      if(response.ok){
        const data = await response.json();

        for (const form of data) {
          //console.log(form)
          await saveFormOffline(form);
          for (const question of form.questions) {
            insertQuestionWithOptions(db,question,question.question_options??[]);
          }
        }

      }

      dispatch(startOfflineForms())
      //dispatch(onLoadForms(data))
      dispatch(onSetErrorMessage(null));

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(message);
      dispatch(onSetErrorMessage("Error al cargar formularios"));
      return false;
    }
  };
};