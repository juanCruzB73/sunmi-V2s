import { getDBConnection } from '../../../localDB/db';
import { createQuestionOptionsTable, dropQuestionOptionsTable } from '../../../localDB/questions/questionOptions';
import { createQuestionsTable, dropQuestionsTable } from '../../../localDB/questions/questions';
import { AppDispatch } from '../../store';
import { getOfflineQuestions, getQuestionsByPanel } from '../offline/questionsOffline';
import { onLoadQuestions, onSetErrorMessage } from './questionSlice';
//import { getDBConnection } from '../../../localDB/db';

export const startOfflineQuestions = (formId:number) => {
  return async (dispatch: AppDispatch) => {
      try {
        //const db = await getDBConnection();

        const offlineQuestions = await getOfflineQuestions(formId);

        const mappedQuestions = offlineQuestions.map(q => ({
          ...q,
          filters: typeof q.filters === 'string' ? JSON.parse(q.filters) : q.filters ?? {},
          required: !!q.required,
          show_list: !!q.show_list,
          catalog_id: q.catalog_id === null ? null : q.catalog_id,
        }));
        
        dispatch(onLoadQuestions(mappedQuestions));
        return { payload: mappedQuestions };
        
      } catch (error) {
        console.error('Error loading offline questions:', error);
        dispatch(onSetErrorMessage("Error al cargar preguntas desde almacenamiento local"));
        return;
      }
  };
};

export const startOfflineQuestionsByPanel = (panelId: number) => {
  return async (dispatch: AppDispatch) => {

    
      try {
        const offlineQuestions = await getQuestionsByPanel(panelId);

        const mappedQuestions = offlineQuestions.map(q => ({
          ...q,
          filters: typeof q.filters === 'string' ? JSON.parse(q.filters) : q.filters ?? {},
          required: !!q.required,
          show_list: !!q.show_list,
          catalog_id: q.catalog_id === null ? null : q.catalog_id,
        }));
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

