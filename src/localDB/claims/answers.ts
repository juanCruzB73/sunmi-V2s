import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { IAnswer } from '../../types/claims/IAnswer';

//  Crea la tabla 'answers' en SQLite si no existe
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
  await db.executeSql(query); //  Ejecuta la creación de tabla
};

// 📥 Inserta o reemplaza una respuesta en la base local
export const insertAnswer = async (db: SQLiteDatabase, answer: IAnswer): Promise<void> => {
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
  const answers: IAnswer[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows.item(i);
    answers.push({
      id: row.id,
      input_string: row.input_string,
      input_text: row.input_text,
      input_date: row.input_date,
      input_datetime: row.input_datetime,
      options: JSON.parse(row.options), //  Convierte opciones nuevamente a objeto
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
      question: {} as any, //  Placeholder por si querés cargar la pregunta asociada
      isSynced: row.isSynced === 1 //  Convierte a booleano
    });
  }

  return answers; // Devuelve el array de respuestas pendientes
};