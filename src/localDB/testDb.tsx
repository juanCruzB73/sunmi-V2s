import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

// Funciones que interactúan con la base SQLite
import { getDBConnection } from './db';
import { getPendingFines } from './fine/fines';
import { getPendingCommerce } from './commerce/commerce';
import { getPendingVehicles } from './vehicle/vehicle';

const TestDbScreen = () => {
  // Estados locales para cada categoría pendiente de sincronización
  const [fines, setFines] = useState<any[]>([]);
  const [commerce, setCommerce] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    // Carga los datos de multas, comercios y vehículos desde SQLite
    const loadData = async () => {
      const db = await getDBConnection();

      const finesData = await getPendingFines(db);           // Obtiene multas con synced = 0
      const commerceData = await getPendingCommerce(db);     // Obtiene comercios pendientes
      const vehicleData = await getPendingVehicles(db);      // Obtiene vehículos pendientes

      setFines(finesData);           // Guarda en estado local para renderizado
      setCommerce(commerceData);
      setVehicles(vehicleData);
    };

    loadData(); // Ejecuta la carga al montar el componente
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Sección de multas */}
      <Text style={styles.sectionTitle}>Multas pendientes</Text>
      {fines.map((f, index) => (
        <Text key={index} style={styles.item}>
          {`${f.fineTypeName} - ${f.description}`}
        </Text>
      ))}

      {/* Sección de comercios */}
      <Text style={styles.sectionTitle}>Comercios pendientes</Text>
      {commerce.map((c, index) => (
        <Text key={index} style={styles.item}>
          {`${c.rutcommerce} - ${c.description}`}
        </Text>
      ))}

      {/* Sección de vehículos */}
      <Text style={styles.sectionTitle}>Vehículos pendientes</Text>
      {vehicles.map((v, index) => (
        <Text key={index} style={styles.item}>
          {`${v.patente} - ${v.description}`}
        </Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  item: {
    fontSize: 16,
    paddingVertical: 4,
    color: '#333',
  },
});

export default TestDbScreen;

//Codigo Juan

/*import React, { useEffect, useState } from 'react';
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

export default TestDb; */