import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { IQuestion } from '../../types/form/IQuestion';
import { IQuestionOption } from '../../types/form/IQuestionOption';
import { insertQuestionOption } from './questionOptions';

export const createQuestionsTable = async (db: SQLiteDatabase): Promise<void> => {
  await db.executeSql('PRAGMA foreign_keys = ON;');

  const query = `
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY NOT NULL,
      form_id INTEGER,
      name TEXT,
      type TEXT,
      owner TEXT,
      required INTEGER NOT NULL DEFAULT 1,
      "order" INTEGER NOT NULL,
      description TEXT,
      filters TEXT DEFAULT '{}',
      catalog_id INTEGER,
      panel_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      show_list INTEGER NOT NULL DEFAULT 0
    );
  `;
  await db.executeSql(query);
};


export const dropQuestionsTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `DROP TABLE IF EXISTS questions;`;
  await db.executeSql(query);
};

export const getQuestionById=async(db:SQLiteDatabase,questionId:number)=>{
  try {
    const results = await db.executeSql(
      'SELECT * FROM questions WHERE id = ?;',
      [questionId]
    );

    const rows = results[0].rows;

    if (rows.length > 0) {
      const question = rows.item(0);
      return question as IQuestion; // Cast to your interface if needed
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting question by ID:', error);
    return null;
  }
}

export const insertQuestion = async (db: SQLiteDatabase, question: IQuestion): Promise<void> => {
  const query = `
    INSERT OR IGNORE INTO questions (
      id, form_id, name, type, owner, required, "order", description, filters, catalog_id, panel_id, show_list, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  const params = [
    question.id,
    question.form_id,
    question.name,
    question.type,
    question.owner,
    question.required ? 1 : 0,
    question.order,
    question.description,
    typeof question.filters === 'string' ? question.filters : JSON.stringify(question.filters ?? {}),
    question.catalog_id,
    question.panel_id,
    question.show_list ? 1 : 0,
    question.created_at,
    question.updated_at
  ];

  await db.executeSql(query, params);

};

export const insertQuestionWithOptions = async (
  db: SQLiteDatabase,
  question: IQuestion,
  options: IQuestionOption[]
): Promise<void> => {
  try{
    await insertQuestion(db, question);

    for (const option of options) {
      await insertQuestionOption(db, option);
    }
    
    }catch(err){
      console.log(err);
    }
};

