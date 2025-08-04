import { SQLiteDatabase } from 'react-native-sqlite-storage';
import * as Keychain from 'react-native-keychain';
import bcrypt from 'bcryptjs';

bcrypt.setRandomFallback(() => {
  const randomBytes: number[] = [];
  for (let i = 0; i < 16; i++) {
    randomBytes[i] = Math.floor(Math.random() * 256);
  }
  return randomBytes;
});


export const dropOfflineAuthTable = async (db: SQLiteDatabase): Promise<void> => {
  await db.executeSql(`DROP TABLE IF EXISTS offlineAuth`);
};

export const createOfflineAuthTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS offlineAuth (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      lastname TEXT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      uid TEXT,
      last_login DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await db.executeSql(query);
};

export const registerOfflineUser = async (
  db: SQLiteDatabase,
  {
    userId,
    name,
    lastname,
    email,
    plainPassword,
    uid,
  }: {
    userId: number;
    name: string;
    lastname: string;
    email: string;
    plainPassword: string;
    uid: string;
  }
): Promise<void> => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(plainPassword, salt);

    const query = `
      INSERT OR REPLACE INTO offlineAuth (user_id, name, lastname, email, password_hash, uid, last_login)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'));
    `;
    await db.executeSql(query, [
      userId,
      name.trim(),
      lastname?.trim() ?? '',
      normalizedEmail,
      passwordHash,
      uid,
    ]);

    console.log("🟢 Usuario offline registrado");
  } catch (error) {
    console.error('🔴 Error al registrar usuario offline:', error);
  }
};

export const getOfflineUser = async (
    db: SQLiteDatabase,
    email: string
  ) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const [results] = await db.executeSql(
        `SELECT user_id, email, password_hash, name, lastname FROM offlineAuth WHERE email = ?`,
        [normalizedEmail]
      );

      if (results.rows.length > 0) {
        return results.rows.item(0);
      }

      return null;
    } catch (error) {
      console.error('Error al obtener usuario offline:', error instanceof Error ? error.message : error);
      return null;
    }
  };

export const printAllOfflineUsers = async (db: SQLiteDatabase) => {
  try {
    const [results] = await db.executeSql(`SELECT * FROM offlineAuth`);
    for (let i = 0; i < results.rows.length; i++) {
      console.log('Usuario offline registrado:', results.rows.item(i));
    }
  } catch (error) {
    console.error('Error al listar usuarios offline:', error);
  }
};



export const loginOffline = async (
  db: SQLiteDatabase,
  email: string,
  plainPassword: string
): Promise<false | { userId: number; name: string; email: string }> => {
  const user = await getOfflineUser(db, email);
  console.log('[DEBUG] Usuario encontrado offline:', user);

  if (!user) {
    return false;
  }

  await Keychain.setGenericPassword(email, plainPassword);

  const passwordMatch = bcrypt.compareSync(plainPassword, user.password_hash);

  if (plainPassword && passwordMatch) {
    return {
      userId: user.user_id,
      name: user.name,
      email: user.email,
    };
  }

  return false;
};