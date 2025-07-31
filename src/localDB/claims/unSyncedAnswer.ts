import { SQLiteDatabase } from "react-native-sqlite-storage";
import { getQuestionById } from "../questions/questions";

export const createUnsyncedAnswerTable=async(db:SQLiteDatabase):Promise<void>=>{
    //await db.executeSql(`DROP TABLE IF EXISTS unsynced_answers;`);
    await db.executeSql(`
        CREATE TABLE IF NOT EXISTS unsynced_answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            input_string TEXT,
            question_id INTEGER,
            answerable_id INTEGER
        );
    `);
};

export const getUnsycedAnswersByClaimId = async (
  db: SQLiteDatabase,
  claimId: number
): Promise<{ input_string: string; question_id: number }[]> => {
  const results = await db.executeSql(
    `SELECT * FROM unsynced_answers WHERE answerable_id = ?`,
    [claimId]
  );

  const rows = results[0].rows;
  const answers: { id:number,input_string: string; question_id: number, question:any }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const item = rows.item(i);
    const question=await getQuestionById(db,item.question_id)
    answers.push({
      id:item.id,
      input_string: item.input_string,
      question_id: item.question_id,
      question:question,
    });
  }

  return answers;
};


export const insertUnsyncedAnswer=async(db:SQLiteDatabase,unsyncedAnswer:any)=>{
  try{
    const result=await db.executeSql(
      `INSERT OR REPLACE INTO unsynced_answers(
        input_string, question_id, answerable_id
      ) VALUES (?, ?, ?);`,
    [
      unsyncedAnswer.input_string,
      unsyncedAnswer.question_id,
      unsyncedAnswer.answerable_id
    ]
  );
  const insertId = (result[0] as any).insertId;

  if (!insertId) return null;

   const selectResult = await db.executeSql(
    `SELECT * FROM unsynced_answers WHERE id = ?;`,
    [insertId]
  );

  const rows = selectResult[0].rows;
  if (rows.length > 0) {
    return rows.item(0);
  }

  return null;
  }catch(err){
    console.error("Error creating unsynced_claims table:", err);
  }
};

export const updateUnsyncedAnswer = async (
  db: SQLiteDatabase,
  unsyncedAnswer: {
    id: number;
    input_string: string;
    question_id: number;
    answerable_id: number;
  }
) => {
  try {
    await db.executeSql(
      `UPDATE unsynced_answers SET input_string = ?, question_id = ? WHERE id = ?;`,
      [
        unsyncedAnswer.input_string,
        unsyncedAnswer.question_id,
        unsyncedAnswer.id,
      ]
    );
    const result = await db.executeSql(
      `SELECT * FROM unsynced_answers WHERE id = ?;`,
      [unsyncedAnswer.id]
    );
    const rows = result[0].rows;
    if (rows.length > 0) {
      console.log(rows.item(0));
      return rows.item(0);
    }

    return null;
  } catch (err) {
    console.error("Error updating unsynced_answer:", err);
    return null;
  }
};
