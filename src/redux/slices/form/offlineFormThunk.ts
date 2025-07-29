import { AppDispatch } from '../../store';
import { onLoadForms, onSetErrorMessage } from './formSlice';
import { IForm } from '../../../types/form/IForm';
import { getDBConnection } from "../../../localDB/db";
import { Form, insertForm } from "../../../localDB/forms/forms";


export const saveFormOffline = async (form: Form): Promise<void> => {
  const db = await getDBConnection();
  await insertForm(db, form);
};

export const getOfflineForms = async (): Promise<Form[]> => {
  const db = await getDBConnection();

  //await dropFormsTable(db)
  //await dropQuestionOptionsTable(db);
  //await dropQuestionsTable(db);
  //await createQuestionOptionsTable(db);
  //await createQuestionsTable(db);
  //await createFormsTable(db);

  const results = await db.executeSql('SELECT * FROM forms;');
  const rows = results[0].rows;
  const forms: Form[] = [];

  for (let i = 0; i < rows.length; i++) {
    forms.push(rows.item(i));
  }

  return forms;
};

export const startOfflineForms=()=>{  
    return async(dispatch: AppDispatch) =>{

        const offlineForms = await getOfflineForms();

        const mappedForms: IForm[] = offlineForms.map(form => ({
          id: form.id,
          name: form.name,
          publish: form.publish,
          description: form.description,
          incident_id: form.incident_id,
          user_id: form.user_id,
          created_at: form.created_at,
          updated_at: form.updated_at,
          area_id: 0 as number,
          visible_app: true,
          question: []
        }));
        dispatch(onLoadForms(mappedForms));
        dispatch(onSetErrorMessage("Cargando formularios desde almacenamiento local"));
        return;
    }
}