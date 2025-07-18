import { SQLiteDatabase } from 'react-native-sqlite-storage';
import bcrypt from 'bcryptjs';

// Fallback para entropía en React Native
bcrypt.setRandomFallback(() => {
  const randomBytes: number[] = [];
  for (let i = 0; i < 16; i++) {
    randomBytes[i] = Math.floor(Math.random() * 256);
  }
  return randomBytes;
});

export const createOfflineAuthTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS offlineAuth (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      last_login DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await db.executeSql(query);
};

export const registerOfflineUser = async (
  db: SQLiteDatabase,
  username: string,
  plainPassword: string,
  userId: number
): Promise<void> => {
  try {
    const normalizedUsername = username.trim().toLowerCase();
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(plainPassword, salt);

    const query = `
      INSERT OR REPLACE INTO offlineAuth (user_id, username, password_hash, last_login)
      VALUES (?, ?, ?, datetime('now'));
    `;
    await db.executeSql(query, [userId, normalizedUsername, passwordHash]);
    console.log("user saved")
  } catch (error) {
    console.error('Error al registrar usuario offline:', error);
  }
};


export const getOfflineUser = async (
  db: SQLiteDatabase,
  username: string
): Promise<{ user_id: number; username: string; password_hash: string } | null> => {
  try {
    const normalizedUsername = username.trim().toLowerCase();
    const [results] = await db.executeSql(
      `SELECT user_id, username, password_hash FROM offlineAuth WHERE username = ?`,
      [normalizedUsername]
    );
    if (results.rows.length > 0) {
      return results.rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Error al obtener usuario offline:', error);
    return null;
  }
};


export const loginOffline = async (
  db: SQLiteDatabase,
  username: string,
  plainPassword: string
): Promise<false | { userId: number; username: string }> => {
  const user = await getOfflineUser(db, username);
  if (!user) return false;

  if (!plainPassword || bcrypt.compareSync(plainPassword, user.password_hash)) {
    return {
      userId: user.user_id,
      username: user.username,
    };
  }

  return false;
};


// Obtiene la última fecha de login
export const getLastLogin = async (
  db: SQLiteDatabase,
  username: string
): Promise<string | null> => {
  try {
    const normalizedUsername = username.trim().toLowerCase();
    const [results] = await db.executeSql(
      `SELECT last_login FROM offlineAuth WHERE username = ?`,
      [normalizedUsername]
    );
    if (results.rows.length > 0) {
      return results.rows.item(0).last_login;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener fecha de último login:', error);
    return null;
  }
};