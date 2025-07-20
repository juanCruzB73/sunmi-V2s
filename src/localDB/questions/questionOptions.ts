import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { IQuestionOption } from '../../types/form/IQuestionOption';

export const createQuestionOptionsTable = async (db: SQLiteDatabase): Promise<void> => {
  await db.executeSql('PRAGMA foreign_keys = ON;');

  const query = `
    CREATE TABLE IF NOT EXISTS question_options (
      id INTEGER PRIMARY KEY NOT NULL,
      form_id INTEGER,
      name TEXT NOT NULL,
      panel_id INTEGER,
      question_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );
  `;
  await db.executeSql(query);

  await db.executeSql('CREATE INDEX IF NOT EXISTS idx_qo_panel_id ON question_options (panel_id);');
  await db.executeSql('CREATE INDEX IF NOT EXISTS idx_qo_question_id ON question_options (question_id);');
};


export const dropQuestionOptionsTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `DROP TABLE IF EXISTS question_options;`;
  await db.executeSql(query);
};

export const insertQuestionOption = async (db: SQLiteDatabase, option: IQuestionOption): Promise<void> => {
  const query = `
    INSERT OR REPLACE INTO question_options (
      id, form_id, name, panel_id, question_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  const params = [
    option.id,
    option.form_id,
    option.name,
    option.panel_id,
    option.question_id,
    option.created_at,
    option.updated_at
  ];

  await db.executeSql(query, params);
};