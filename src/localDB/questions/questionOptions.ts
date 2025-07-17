import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createQuestionOptionsTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS question_options (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT,
      panel_id INTEGER,
      question_id INTEGER,
      created_at TEXT,
      updated_at TEXT
    );
  `;
  await db.executeSql(query);
};

export const dropQuestionOptionsTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `DROP TABLE IF EXISTS question_options;`;
  await db.executeSql(query);
};

export type QuestionOption = {
  id: number;
  name: string;
  panel_id: number;
  question_id: number;
  created_at: string;
  updated_at: string;
};

export const insertQuestionOption = async (db: SQLiteDatabase, option: QuestionOption): Promise<void> => {
  const query = `
    INSERT OR REPLACE INTO question_options (
      id, name, panel_id, question_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?);
  `;
  const params = [
    option.id,
    option.name,
    option.panel_id,
    option.question_id,
    option.created_at,
    option.updated_at
  ];

  await db.executeSql(query, params);
};