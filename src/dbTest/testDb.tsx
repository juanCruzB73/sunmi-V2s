import React, { useEffect, useState } from 'react';
import { View, Button, Text, ScrollView, StyleSheet } from 'react-native';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

interface User {
  id: number;
  name: string;
}

const getDBConnection = async (): Promise<SQLiteDatabase> => {
  return SQLite.openDatabase({ name: 'mydb.db', location: 'default' });
};

const createUsersTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);`;
  await db.executeSql(query);
};

const insertUser = async (db: SQLiteDatabase, name: string): Promise<void> => {
  const query = `INSERT INTO users (name) VALUES (?);`;
  await db.executeSql(query, [name]);
};

const getUsers = async (db: SQLiteDatabase): Promise<User[]> => {
  const results = await db.executeSql('SELECT * FROM users;');
  const users: User[] = [];

  const rows = results[0].rows;
  for (let i = 0; i < rows.length; i++) {
    users.push(rows.item(i));
  }

  return users;
};

const TestDb = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const setupDb = async () => {
      try {
        const db = await getDBConnection();
        await createUsersTable(db);
        const initialUsers = await getUsers(db);
        setUsers(initialUsers);
      } catch (err) {
        console.error('DB init error:', err);
      }
    };

    setupDb();
  }, []);

  const handleAddUser = async () => {
    try {
      const db = await getDBConnection();
      const name = `User_${Math.floor(Math.random() * 1000)}`;
      await insertUser(db, name);
      const updatedUsers = await getUsers(db);
      setUsers(updatedUsers);
    } catch (err) {
      console.error('Insert error:', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="➕ Add User" onPress={handleAddUser} />
      {users.map((user) => (
        <Text key={user.id} style={styles.userText}>
          👤 {user.name} (id: {user.id})
        </Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  userText: {
    marginVertical: 8,
    fontSize: 16,
  },
});

export default TestDb;