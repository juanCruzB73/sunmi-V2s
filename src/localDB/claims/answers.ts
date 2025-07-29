import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { IAnswer } from '../../types/claims/IAnswer';

// 🧱 Crea la tabla 'answers' si no existe
export const createAnswersTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY NOT NULL,
      input_string TEXT,
      input_text TEXT,
      input_date TEXT,
      input_datetime TEXT,
      options TEXT,
      latitude REAL,
      longitude REAL,
      item_id INTEGER,
      person_id INTEGER,
      address_id INTEGER,
      question_id INTEGER,
      owner_type TEXT,
      owner_id INTEGER,
      answerable_type TEXT,
      answerable_id INTEGER,
      created_at TEXT,
      updated_at TEXT,
      tag TEXT,
      isSynced INTEGER DEFAULT 0
    );
  `;
  await db.executeSql(query);
};

// 🛠️ Asegura todas las columnas necesarias
export const fixAnswersTableSchema = async (db: SQLiteDatabase): Promise<void> => {
  const result = await db.executeSql('PRAGMA table_info(answers)');
  const columns = result[0].rows.raw().map((col: { name: string }) => col.name);

  const requiredColumns = [
    { name: 'owner_type', type: 'TEXT' },
    { name: 'owner_id', type: 'INTEGER' },
    { name: 'isSynced', type: 'INTEGER DEFAULT 0' },
    { name: 'input_string', type: 'TEXT' },
    { name: 'input_text', type: 'TEXT' },
    { name: 'input_date', type: 'TEXT' },
    { name: 'input_datetime', type: 'TEXT' },
    { name: 'options', type: 'TEXT' },
    { name: 'latitude', type: 'REAL' },
    { name: 'longitude', type: 'REAL' },
    { name: 'item_id', type: 'INTEGER' },
    { name: 'person_id', type: 'INTEGER' },
    { name: 'address_id', type: 'INTEGER' },
    { name: 'answerable_type', type: 'TEXT' },
    { name: 'answerable_id', type: 'INTEGER' },
    { name: 'created_at', type: 'TEXT' },
    { name: 'updated_at', type: 'TEXT' },
    { name: 'tag', type: 'TEXT' } // ✅ Agregada aquí
  ];

  for (const col of requiredColumns) {
    if (!columns.includes(col.name)) {
      await db.executeSql(`ALTER TABLE answers ADD COLUMN ${col.name} ${col.type}`);
      console.log(`🛠️ Columna ${col.name} agregada`);
    }
  }
};

// 📥 Inserta o reemplaza una respuesta
export const insertAnswer = async (db: SQLiteDatabase, answer: IAnswer): Promise<void> => {
  try{
    const query = `
      INSERT OR REPLACE INTO answers (
        id, input_string, input_text, input_date, input_datetime, options, latitude, longitude,
        item_id, person_id, address_id, question_id, owner_type, owner_id, answerable_type,
        answerable_id, created_at, updated_at, tag, isSynced
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

  const params = [
    answer.id,
    answer.input_string,
    answer.input_text,
    answer.input_date,
    answer.input_datetime,
    JSON.stringify(answer.options), // Convierte opciones a string JSON
    answer.latitude,
    answer.longitude,
    answer.item_id,
    answer.person_id,
    answer.address_id,
    answer.question_id,
    answer.owner_type,
    answer.owner_id,
    answer.answerable_type,
    answer.answerable_id,
    answer.created_at,
    answer.updated_at,
    answer.tag,
    answer.isSynced ? 1 : 0 //  Marcado como sincronizado (1) o pendiente (0)
  ];

  await db.executeSql(query, params); //  Guarda en la base
};

//  Obtiene todos los answers que aún no fueron sincronizados
export const getUnsyncedAnswers = async (db: SQLiteDatabase): Promise<IAnswer[]> => {
  const results = await db.executeSql('SELECT * FROM answers WHERE isSynced = 0');
  const rows = results[0].rows;
  console.log("🎯 Respuestas no sincronizadas:", rows.raw());

  const answers: IAnswer[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows.item(i);
    answers.push({
      id: row.id,
      input_string: row.input_string,
      input_text: row.input_text,
      input_date: row.input_date,
      input_datetime: row.input_datetime,
      options: row.options ? JSON.parse(row.options) : [],
      latitude: row.latitude,
      longitude: row.longitude,
      item_id: row.item_id,
      person_id: row.person_id,
      address_id: row.address_id,
      question_id: row.question_id,
      owner_type: row.owner_type,
      owner_id: row.owner_id,
      answerable_type: row.answerable_type,
      answerable_id: row.answerable_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      tag: row.tag,
      question: {} as any,
      isSynced: row.isSynced === 1
    });
  }

  return answers;
};

// 🔗 Answers por claim
export const getAnswersByClaimId = async (
  db: SQLiteDatabase,
  claimId: number
): Promise<IAnswer[]> => {
  const results = await db.executeSql(
    'SELECT * FROM answers WHERE owner_type = "Claim" AND owner_id = ?',
    [claimId]
  );
  const rows = results[0].rows;
  console.log(`🔗 Respuestas para claim #${claimId}:`, rows.raw());

  const answers: IAnswer[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows.item(i);
    answers.push({
      id: row.id,
      input_string: row.input_string,
      input_text: row.input_text,
      input_date: row.input_date,
      input_datetime: row.input_datetime,
      options: row.options ? JSON.parse(row.options) : [],
      latitude: row.latitude,
      longitude: row.longitude,
      item_id: row.item_id,
      person_id: row.person_id,
      address_id: row.address_id,
      question_id: row.question_id,
      owner_type: row.owner_type,
      owner_id: row.owner_id,
      answerable_type: row.answerable_type,
      answerable_id: row.answerable_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      tag: row.tag,
      question: {} as any,
      isSynced: row.isSynced === 1
    });
  }

  return answers;
};

export const getAnswersByClaimId = async (
  db: SQLiteDatabase,
  claimId: number
): Promise<IAnswer[]> => {
  const results = await db.executeSql(
  `SELECT * FROM answers WHERE answerable_id = ?`,
  [claimId]
);


  const rows = results[0].rows;
  const answers: IAnswer[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows.item(i);
    answers.push({
      id: row.id,
      input_string: row.input_string,
      input_text: row.input_text,
      input_date: row.input_date,
      input_datetime: row.input_datetime,
      options: JSON.parse(row.options || '[]'),
      latitude: row.latitude,
      longitude: row.longitude,
      item_id: row.item_id,
      person_id: row.person_id,
      address_id: row.address_id,
      question_id: row.question_id,
      owner_type: row.owner_type,
      owner_id: row.owner_id,
      answerable_type: row.answerable_type,
      answerable_id: row.answerable_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      tag: row.tag,
      isSynced: row.isSynced === 1,
      question: {} as any
    });
  }

  return answers;
};
