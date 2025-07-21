import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAuthToken } from "../../../types/IAuthToken";
import { AppDispatch } from "../../store";
import { onCheckingForms } from "../form/formSlice";
import { API_BASE_URL } from '@env';
import { onLoadQuestions, onSetErrorMessage } from "./questionSlice";
import { createQuestionsTable, dropQuestionsTable, insertQuestionWithOptions } from "../../../localDB/questions/questions";
import { getDBConnection } from "../../../localDB/db";
import { createQuestionOptionsTable, dropQuestionOptionsTable, insertQuestionOption } from "../../../localDB/questions/questionOptions";
import QuestionInput from "../../../components/question-option/QuestionInput";

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
            const db = await getDBConnection();
            await dropQuestionOptionsTable(db);
            await dropQuestionsTable(db);
            await createQuestionOptionsTable(db);
            await createQuestionsTable(db);

            const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
            const tokenObject: { [key: string]: string | null } = Object.fromEntries(values);
            const tokenData:IAuthToken={accessToken: tokenObject['access-token'] ?? '',client: tokenObject['client'] ?? '',uid: tokenObject['uid'] ?? '',}
            const headers=setTokenHeader(tokenData);
            
            const response=await fetch(`${API_BASE_URL}/api/v1/forms/visible/${formId}`,{headers:headers});

            if (!response.ok) {
              const text = await response.text();
              console.error(`HTTP ${response.status}: ${text}`);
              throw new Error(`Request failed with status ${response.status}`);
            };
            
            const data=await response.json();
            console.log(data.questions)
            for (const q of data.questions) {
              const questionToInsert = {
                ...q,
                form_id: formId,
                filters: JSON.stringify(q.filters ?? {}),
                catalog_id: q.catalog_id ?? null,
              };
              await insertQuestionWithOptions(db, questionToInsert, q.question_options??[]);
            }
            console.log("firind");
            
            dispatch(onLoadQuestions(data.questions));
            dispatch(onSetErrorMessage(null));
            return { payload: data.questions };
        }catch (error: unknown) {
            //const message = error instanceof Error ? error.message : String(error);
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

      const response = await fetch(`${API_BASE_URL}/api/v1/forms/visible/${formId}/panel/${panelId}`, { headers });

      if (!response.ok) {
        const text = await response.text();
        console.error(`HTTP ${response.status}: ${text}`);
        throw new Error(`Request failed with status ${response.status}`);
      };

      const data = await response.json();
      dispatch(onLoadQuestions(data.questions));
      dispatch(onSetErrorMessage(null));
      return { payload: data.questions };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.log('Error loading questions:', JSON.stringify(error, null, 2));

      dispatch(onSetErrorMessage("Error al cargar preguntas por panel"));
    }
  };
};