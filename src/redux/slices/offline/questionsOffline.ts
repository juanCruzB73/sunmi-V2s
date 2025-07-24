import { getDBConnection } from "../../../localDB/db";
import { insertQuestion } from "../../../localDB/questions/questions";
import { IQuestion } from "../../../types/form/IQuestion";
import { IQuestionOption } from "../../../types/form/IQuestionOption";
import { AppDispatch } from "../../store";
import { onLoadQuestions } from "../question/questionSlice";


export const saveQuestionOffline = async (question: IQuestion): Promise<void> => {
  const db = await getDBConnection();
  console.log("Saving question: ", question);
  await insertQuestion(db, question);
};

export const getOfflineQuestions = async (formId:number): Promise<IQuestion[]> => {
  
  const db = await getDBConnection();
  const results = await db.executeSql('SELECT * FROM questions WHERE form_id = ?;', [formId]);
  const rows = results[0].rows;
  const questions: IQuestion[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows.item(i);
    const questionId = row.id;
    const [optionsResult] = await db.executeSql(
      'SELECT * FROM question_options WHERE question_id = ?;',
      [questionId]
    );

    const options: IQuestionOption[] = [];

    for (let j = 0; j < optionsResult.rows.length; j++) {
      options.push(optionsResult.rows.item(j));
    }

    questions.push({
      ...row,
      filters: JSON.parse(row.filters || '{}'),
      required: !!row.required,
      show_list: !!row.show_list,
      catalog_id: row.catalog_id === null ? null : row.catalog_id,
      question_options: options,
    });
  };
  return questions;
};

export const getQuestionsByPanel = async (panelId: number) =>{
  const db = await getDBConnection();
  const query = `SELECT * FROM questions WHERE panel_id = ?;`;
  const [result] = await db.executeSql(query, [panelId]);

  const questions: IQuestion[] = [];

  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows.item(i);
    questions.push({
      ...row,
      filters: JSON.parse(row.filters || '{}'),
      required: !!row.required,
      show_list: !!row.show_list,
      catalog_id: row.catalog_id === null ? null : row.catalog_id,
    });
  }

  return questions;
};

export const startOfflineQuestionsByPanel = (panelId: number) => {
  return async (dispatch: AppDispatch) => {
    const questions = await getQuestionsByPanel(panelId);
    dispatch(onLoadQuestions(questions));
    return
  };
};

