declare module 'react-native-sqlite-storage' {
  export interface ResultSet {
    rows: {
      length: number;
      item: (index: number) => any;
    };
  }

  export interface SQLiteDatabase {
    executeSql: (
      statement: string,
      params?: any[]
    ) => Promise<ResultSet[]>;
    close: () => Promise<void>;
  }

  const SQLite: {
    enablePromise: (enable: boolean): void;
    openDatabase: (config: { name: string; location: string }) => Promise<SQLiteDatabase>;
  };

  export default SQLite;
}
