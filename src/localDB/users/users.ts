import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const createUsersTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT,
      flastname TEXT,
      identifier TEXT,
      email TEXT,
      encrypted_password TEXT
    );
  `;
  await db.executeSql(query);
};

export const dropUsersTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `DROP TABLE IF EXISTS users;`;
  await db.executeSql(query);
};

export type User = {
  id: number;
  name: string;
  flastname: string;
  identifier: string;
  email: string;
  encrypted_password: string;
};

export const insertUser = async (db: SQLiteDatabase, user: User): Promise<void> => {
  const query = `
    INSERT OR REPLACE INTO users (
      id, name, flastname, identifier, email, encrypted_password
    ) VALUES (?, ?, ?, ?, ?, ?);
  `;
  const params = [
    user.id,
    user.name,
    user.flastname,
    user.identifier,
    user.email,
    user.encrypted_password
  ];

  await db.executeSql(query, params);
};