import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAuthToken } from "../../../types/IAuthToken";
import { AppDispatch } from "../../store";
import { onCheckingForms } from "../form/formSlice";
<<<<<<< HEAD
import { API_BASE_URL as API_BASE } from '@env';
=======
import { API_BASE_URL3 } from '@env';
>>>>>>> 80b9552 (commit before main_panel in claim)
import { onLoadQuestions, onSetErrorMessage } from "./questionSlice";
import { createQuestionsTable, dropQuestionsTable, insertQuestionWithOptions } from "../../../localDB/questions/questions";
import { getDBConnection } from "../../../localDB/db";
import { createQuestionOptionsTable, dropQuestionOptionsTable } from "../../../localDB/questions/questionOptions";

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
<<<<<<< HEAD
            console.log("response", `${API_BASE}/api/v1/forms/visible/${formId}`);
=======
            
            const response=await fetch(`${API_BASE_URL3}/api/v1/forms/visible/${formId}`,{headers:headers});
>>>>>>> 80b9552 (commit before main_panel in claim)

            const response=await fetch(`${API_BASE}/api/v1/forms/visible/${formId}`,{headers:headers});
            if (!response.ok) {
              const text = await response.text();
              console.error(`HTTP ${response.status}: ${text}`);
              throw new Error(`Request failed with status ${response.status}`);
            };
            
            const data=await response.json();
            //console.log(data.questions)
            for (const q of data.questions) {
              const questionToInsert = {
                ...q,
                form_id: formId,
                filters: JSON.stringify(q.filters ?? {}),
                catalog_id: q.catalog_id ?? null,
              };
              await insertQuestionWithOptions(db, questionToInsert, q.question_options??[]);
            }
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
<<<<<<< HEAD

<<<<<<< HEAD
      const response = await fetch(`${API_BASE}/api/v1/forms/visible/${formId}/panel/${panelId}`, { headers });
=======
=======
      console.log(`${API_BASE_URL3}/api/v1/forms/visible/${formId}/panel/${panelId}`);
>>>>>>> fbc09aa (update And delete from app to api updated)
      const response = await fetch(`${API_BASE_URL3}/api/v1/forms/visible/${formId}/panel/${panelId}`, { headers });
>>>>>>> 80b9552 (commit before main_panel in claim)

      if (!response.ok) {
        const text = await response.text();
        console.error(`HTTP ${response.status}: ${text}`);
        throw new Error(`Request failed with status ${response.status}`);
      };

      const data = await response.json();
      console.log(data);
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