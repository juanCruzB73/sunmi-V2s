import { AppDispatch } from '../../store';
import NetInfo from '@react-native-community/netinfo';
import { getOfflineQuestions, getQuestionsByPanel } from '../offline/questionsOffline';
import { onLoadQuestions, onSetErrorMessage } from './questionSlice';

export const startOfflineQuestions = (formId:number) => {
  return async (dispatch: AppDispatch) => {
    const netState = await NetInfo.fetch();

    if (!netState.isConnected) {
      try {
        const offlineQuestions = await getOfflineQuestions(formId);

        const mappedQuestions = offlineQuestions.map(q => ({
          ...q,
          filters: typeof q.filters === 'string' ? JSON.parse(q.filters) : q.filters ?? {},
          required: !!q.required,
          show_list: !!q.show_list,
          catalog_id: q.catalog_id === null ? null : q.catalog_id,
        }));
        console.log("Cargando preguntas desde almacenamiento local")
        const filtered = mappedQuestions.filter(
          (q) => Array.isArray(q.question_options) && q.question_options.length > 0
        );
        dispatch(onLoadQuestions(filtered));
        dispatch(onSetErrorMessage(null));
        return { payload: filtered };;
      } catch (error) {
        console.error('Error loading offline questions:', error);
        dispatch(onSetErrorMessage("Error al cargar preguntas desde almacenamiento local"));
        return;
      }
    }
  };
};

export const startOfflineQuestionsByPanel = (panelId: number) => {
  return async (dispatch: AppDispatch) => {
    const netState = await NetInfo.fetch();

    if (!netState.isConnected) {
      try {
        const offlineQuestions = await getQuestionsByPanel(panelId);

        const mappedQuestions = offlineQuestions.map(q => ({
          ...q,
          filters: typeof q.filters === 'string' ? JSON.parse(q.filters) : q.filters ?? {},
          required: !!q.required,
          show_list: !!q.show_list,
          catalog_id: q.catalog_id === null ? null : q.catalog_id,
        }));
        console.log(`Cargando preguntas del panel ${panelId} desde almacenamiento local`);
        dispatch(onLoadQuestions(mappedQuestions));
        dispatch(onSetErrorMessage(null));
        return { payload: mappedQuestions };;
      } catch (error) {
        console.error('Error loading offline questions by panel:', error);
        dispatch(onSetErrorMessage("Error al cargar preguntas por panel desde almacenamiento local"));
        return;
      }
    }
  };
};
