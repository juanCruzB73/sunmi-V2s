import { AppDispatch } from '../../store';
import { IAuthToken } from '../../../types/IAuthToken';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onCheckingForms, onSetErrorMessage } from './formSlice';
import { getDBConnection } from '../../../localDB/db';
import { createQuestionsTable, dropQuestionsTable, insertQuestionWithOptions } from '../../../localDB/questions/questions';
import { API_BASE_URL3 } from '@env';
import { saveFormOffline, startOfflineForms } from './offlineFormThunk';
import NetInfo from '@react-native-community/netinfo';
import { createFormsTable, dropFormsTable } from '../../../localDB/forms/forms';
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
    const netState = await NetInfo.fetch();
    if (netState.isConnected){
        try {
        dispatch(onCheckingForms());
        const db = await getDBConnection();
       
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
        console.log(headers);
        
        const response = await fetch(`${API_BASE_URL3}/api/v1/forms`, { headers: headers });
        if(response.ok){
          const data = await response.json();
          console.log(data);
          
          console.log("by panel",data);
          
          for (const form of data) {
            await saveFormOffline(form);  
            
            for (const question of form.questions) {
              const questionWithFormId = { ...question, form_id: form.id };
              await insertQuestionWithOptions(db, questionWithFormId, question.question_options ?? []);
            }
          }

        }

        dispatch(startOfflineForms());
        dispatch(onSetErrorMessage(null));

      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(message);
        dispatch(onSetErrorMessage("Error al cargar formularios"));
        return false;
      }
    }else{
      dispatch(startOfflineForms());
    }
  };
};