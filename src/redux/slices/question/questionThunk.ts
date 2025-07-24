import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAuthToken } from "../../../types/IAuthToken";
import { AppDispatch } from "../../store";
import { onCheckingForms } from "../form/formSlice";
import { API_BASE_URL4 } from '@env';
import { onLoadQuestions, onSetErrorMessage } from "./questionSlice";
import { createQuestionsTable, dropQuestionsTable, insertQuestionWithOptions } from "../../../localDB/questions/questions";
import { getDBConnection } from "../../../localDB/db";
import { createQuestionOptionsTable, dropQuestionOptionsTable } from "../../../localDB/questions/questionOptions";
import { getOfflineQuestions, startOfflineQuestionsByPanel } from "../offline/questionsOffline";
import { startOfflineQuestions } from "./offlineQuestionThunk";

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


export const startLoadQuestions=(formId:number)=>{
    return async (dispatch: AppDispatch) =>{
        try{
            dispatch(onCheckingForms());
            //const db = await getDBConnection();
            const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
            const tokenObject: { [key: string]: string | null } = Object.fromEntries(values);
            const tokenData:IAuthToken={accessToken: tokenObject['access-token'] ?? '',client: tokenObject['client'] ?? '',uid: tokenObject['uid'] ?? '',}
            const headers=setTokenHeader(tokenData);
            
            const response=await fetch(`${API_BASE_URL4}/api/v1/forms/visible/${formId}`,{headers:headers});

            if (response.ok) {
              const data=await response.json();
              console.log(data);
              
            };
            
            //dispatch(onLoadQuestions(data.questions));
            const data=dispatch(startOfflineQuestions(formId));
            dispatch(onSetErrorMessage(null));
            return data ;

        }catch (error: unknown) {
            console.log('Error loading questions:', JSON.stringify(error, null, 2));
            return;
        }
    }
};

export const startLoadQuestionsByPanel = (formId: number, panelId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(onCheckingForms());

      const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
      const tokenObject: { [key: string]: string | null } = Object.fromEntries(values);
      const tokenData: IAuthToken = {
        accessToken: tokenObject['access-token'] ?? '',
        client: tokenObject['client'] ?? '',
        uid: tokenObject['uid'] ?? '',
      };
      const headers = setTokenHeader(tokenData);
      const response = await fetch(`${API_BASE_URL4}/api/v1/forms/visible/${formId}/panel/${panelId}`, { headers });

      if (response.ok) {
        const data = await response.json();
      };

      //dispatch(onLoadQuestions(data.questions));
      const data=dispatch(startOfflineQuestionsByPanel(panelId));
      dispatch(onSetErrorMessage(null));
      return data;

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.log('Error loading questions:', JSON.stringify(error, null, 2));

      dispatch(onSetErrorMessage("Error al cargar preguntas por panel"));
    }
  };
};