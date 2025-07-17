import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

import { createOfflineAuthTable } from './session/offlineAuth';

import { createFormsTable } from './forms/forms';
import { createQuestionsTable } from './questions/questions';
import { createUsersTable } from './users/users';
import { createQuestionOptionsTable } from './questions/questionOptions';

SQLite.enablePromise(true);

export const getDBConnection = async (): Promise<SQLiteDatabase> => {
  return SQLite.openDatabase({ name: 'app_data.db', location: 'default' });
};

export const createTables = async (db: SQLiteDatabase): Promise<void> => {

  await createOfflineAuthTable(db);

  await createFormsTable(db);
  await createQuestionsTable(db);
  await createQuestionOptionsTable(db);
  await createUsersTable(db);
};