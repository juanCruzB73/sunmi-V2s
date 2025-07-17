import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAuthToken } from "../../../types/IAuthToken";
import { AppDispatch } from "../../store";
import { onCheckingForms } from "../form/formSlice";
import { API_BASE_URL } from '@env';
import { onLoadQuestions, onSetErrorMessage } from "./questionSlice";
import NetInfo from '@react-native-community/netinfo';
import { IQuestion } from "../../../types/form/IQuestion";
import { getOfflineQuestionsByForm, saveQuestionOffline } from "../offline/questionsOffline";

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

export const startLoadQuestionsByPanel = (formId: number, panelId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(onCheckingForms());

      const netState = await NetInfo.fetch();
      const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
      const tokenObject: { [key: string]: string | null } = Object.fromEntries(values);
      const tokenData: IAuthToken = {
        accessToken: tokenObject['access-token'] ?? '',
        client: tokenObject['client'] ?? '',
        uid: tokenObject['uid'] ?? '',
      };
      const headers = setTokenHeader(tokenData);

      if (!netState.isConnected) {
        const offlineQuestions = await getOfflineQuestionsByForm(formId);
        const filtered = offlineQuestions.filter(q => q.panel_id === panelId);
        const mappedQuestions: IQuestion[] = filtered.map(q => ({
          id: q.id,
          name: q.name,
          type: q.type,
          owner: q.owner,
          required: q.required,
          order: q.order,
          description: q.description,
          catalog_id: q.catalog_id,
          panel_id: q.panel_id,
          created_at: q.created_at,
          updated_at: q.updated_at,
          show_list: q.show_list,
          filters: (() => {
            try {
              return JSON.parse(q.filters || '{}');
            } catch {
              return {};
            }
          })(),
          question_options: []
        }));
        dispatch(onLoadQuestions(mappedQuestions));
        dispatch(onSetErrorMessage("Preguntas cargadas desde almacenamiento local"));
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/forms/visible/${formId}/panel/${panelId}`, { headers });
      const data = await response.json();
      console.log(data);

      for (const question of data.questions) {
        await saveQuestionOffline(question);
      }

      dispatch(onLoadQuestions(data.questions));
      dispatch(onSetErrorMessage(null));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(message);
      dispatch(onSetErrorMessage("Error al cargar preguntas por panel"));
    }
  };
};