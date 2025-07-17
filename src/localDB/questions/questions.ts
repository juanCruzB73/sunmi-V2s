import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createQuestionsTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT,
      type TEXT,
      owner TEXT,
      required INTEGER,
      "order" INTEGER,
      description TEXT,
      filters TEXT,
      catalog_id INTEGER,
      panel_id INTEGER,
      show_list INTEGER,
      created_at TEXT,
      updated_at TEXT
    );
  `;
  await db.executeSql(query);
};

export const dropQuestionsTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `DROP TABLE IF EXISTS questions;`;
  await db.executeSql(query);
};

export type Question = {
  id: number;
  name: string;
  type: string;
  owner: string;
  required: boolean;
  order: number;
  description: string;
  filters: string;
  catalog_id: number;
  panel_id: number;
  show_list: boolean;
  created_at: string;
  updated_at: string;
};

export const insertQuestion = async (db: SQLiteDatabase, question: Question): Promise<void> => {
  const query = `
    INSERT OR REPLACE INTO questions (
      id, name, type, owner, required, "order", description, filters, catalog_id, panel_id, show_list, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  const params = [
    question.id,
    question.name,
    question.type,
    question.owner,
    question.required ? 1 : 0,
    question.order,
    question.description,
    question.filters,
    question.catalog_id,
    question.panel_id,
    question.show_list ? 1 : 0,
    question.created_at,
    question.updated_at
  ];

  await db.executeSql(query, params);
};