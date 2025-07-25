import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch  } from './src/redux/store';
import StackNavigator from './src/router/StackNavigator';
import { restoreAuthState } from './src/redux/slices/auth/authThunk';
import { createTables, getDBConnection } from './src/localDB/db';

export const Main = () => {    
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(restoreAuthState());
  }, [dispatch]);

  useEffect(() => {
    const initDB = async () => {
      try {
        const db = await getDBConnection();
        await createTables(db);
        console.log("Database initialized");
      } catch (e) {
        console.error("DB init failed", e);
      }
    };
  
    initDB();
  }, []);

  return <StackNavigator />;
};