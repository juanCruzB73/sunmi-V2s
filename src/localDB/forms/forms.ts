import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createFormsTable = async (db: SQLiteDatabase): Promise<void> => {

  const query = `
    CREATE TABLE IF NOT EXISTS forms (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT,
      publish INTEGER,
      description TEXT,
      incident_id INTEGER,
      user_id INTEGER,
      created_at TEXT,
      updated_at TEXT
    );
  `;
  await db.executeSql(query);
};

export const dropFormsTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `DROP TABLE IF EXISTS forms;`;
  await db.executeSql(query);
};

export type Form = {
  id: number;
  name: string;
  publish: boolean;
  description: string;
  incident_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
};

export const insertForm = async (db: SQLiteDatabase, form: Form): Promise<void> => {
  const query = `
    INSERT OR IGNORE INTO forms (
      id, name, publish, description, incident_id, user_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;
  const params = [
    form.id,
    form.name,
    form.publish ? 1 : 0,
    form.description,
    form.incident_id,
    form.user_id,
    form.created_at,
    form.updated_at
  ];
  
  await db.executeSql(query, params);
};