import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

import { createOfflineAuthTable, dropOfflineAuthTable } from './session/offlineAuth';

import { createFormsTable, dropFormsTable } from './forms/forms';
import { createQuestionsTable, dropQuestionsTable } from './questions/questions';
import { createUsersTable } from './users/users';
import { createQuestionOptionsTable, dropQuestionOptionsTable } from './questions/questionOptions';
import { createClaimsTable, dropClaimsTable } from './claims/claims';
import { createAnswersTable, dropAnswerTable } from './claims/answers';
import { createUnsyncedClaimTable, dropUnsyncquedClaimTable } from './claims/unSyncedClaim';
import { createUnsyncedAnswerTable, dropUnsyncedAnswerTable } from './claims/unSyncedAnswer';

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
  await createClaimsTable(db);
  await createAnswersTable(db);
  await createUnsyncedClaimTable(db);
  await createUnsyncedAnswerTable(db);
};

export const dropTables = async(db:SQLiteDatabase):Promise<void>=>{
  await dropUnsyncedAnswerTable(db);
  await dropAnswerTable(db);
  await dropQuestionOptionsTable(db);
  await dropQuestionsTable(db);
  await dropFormsTable(db);
  await dropOfflineAuthTable(db);
  await dropClaimsTable(db);
  await dropUnsyncquedClaimTable(db);
}