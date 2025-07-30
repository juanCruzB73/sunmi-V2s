import { SQLiteDatabase } from "react-native-sqlite-storage";

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
    console.log("created");
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
  const answers: { input_string: string; question_id: number }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const item = rows.item(i);
    answers.push({
      input_string: item.input_string,
      question_id: item.question_id,
    });
  }

  return answers;
};


export const insertUnsyncedAnswer=async(db:SQLiteDatabase,unsyncedAnswer:any)=>{
  try{
    console.log(unsyncedAnswer);
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
}