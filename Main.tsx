import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './src/redux/store';
import StackNavigator from './src/router/StackNavigator';
import { restoreAuthState } from './src/redux/slices/auth/authThunk';
import { createTables, getDBConnection } from './src/localDB/db';
import { useNetworkStatus } from './src/utlis/useNetworkStatus';
import { eliminarClaimsDePrueba, getUnsyncedClaims } from './src/localDB/claims/claims';
import { onLoadClaims } from './src/redux/slices/claims/claimSlice';
import { fixAnswersTableSchema } from './src/localDB/claims/answers';
import { syncReduxClaimsToSQLite } from './src/sync/syncReduxClaimsToSQLite';

export const Main = () => {
  const dispatch = useDispatch<AppDispatch>();
  useNetworkStatus(); // 🧠 Activador de triggerSync
  const claimsRedux = useSelector((state: RootState) => state.claim.claims);

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