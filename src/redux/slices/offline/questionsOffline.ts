import { getDBConnection } from "../../../localDB/db";
import { Question, insertQuestion } from "../../../localDB/questions/questions";

export const saveQuestionOffline = async (question: Question): Promise<void> => {
  const db = await getDBConnection();
  await insertQuestion(db, question);
};

export const getOfflineQuestionsByForm = async (formId: number): Promise<Question[]> => {
  const db = await getDBConnection();
  const results = await db.executeSql('SELECT * FROM questions WHERE catalog_id = ?;', [formId]);
  const rows = results[0].rows;
  const questions: Question[] = [];

  for (let i = 0; i < rows.length; i++) {
    questions.push(rows.item(i));
  }

  return questions;
};