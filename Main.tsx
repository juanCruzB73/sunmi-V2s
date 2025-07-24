import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './src/redux/store';
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
        await fixAnswersTableSchema(db); // ✅ Asegura columnas críticas para sincronización

        console.log("✅ Database initialized");

        await eliminarClaimsDePrueba(db);

        const unsynced = await getUnsyncedClaims(db);
        console.log("🧪 Reclamos obtenidos desde SQLite:", unsynced);
        dispatch(onLoadClaims(unsynced));
        console.log(`🚚 Reclamos no sincronizados cargados en Redux: ${unsynced.length}`);

        if (claimsRedux.length > 0) {
          await syncReduxClaimsToSQLite(db, claimsRedux);
        }
      } catch (e) {
        console.error("⛔ DB init failed", e);
      }
    };

    initDB();
  }, [dispatch]);

  return <StackNavigator />;
};