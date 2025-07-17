import { getDBConnection } from "../../../localDB/db";
import { Form, insertForm } from "../../../localDB/forms/forms";


export const saveFormOffline = async (form: Form): Promise<void> => {
  const db = await getDBConnection();
  await insertForm(db, form);
};

export const getOfflineForms = async (): Promise<Form[]> => {
  const db = await getDBConnection();
  const results = await db.executeSql('SELECT * FROM forms;');
  const rows = results[0].rows;
  const forms: Form[] = [];

  for (let i = 0; i < rows.length; i++) {
    forms.push(rows.item(i));
  }

  return forms;
};