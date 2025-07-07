import SQLite, { SQLiteDatabase, ResultSet } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export interface User {
  id: number;
  name: string;
}

export const getDBConnection = async (): Promise<SQLiteDatabase> => {
  return SQLite.openDatabase({ name: 'mydb.db', location: 'default' });
};

export const createUsersTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);`;
  await db.executeSql(query);
};

export const insertUser = async (db: SQLiteDatabase, name: string): Promise<void> => {
  const query = `INSERT INTO users (name) VALUES (?);`;
  await db.executeSql(query, [name]);
};

export const getUsers = async (db: SQLiteDatabase): Promise<User[]> => {
  const results = await db.executeSql('SELECT * FROM users;');
  const users: User[] = [];
  const rows = results[0].rows;

  for (let i = 0; i < rows.length; i++) {
    users.push(rows.item(i));
  }

  return users;
};
