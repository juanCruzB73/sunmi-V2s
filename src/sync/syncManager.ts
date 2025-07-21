import NetInfo from '@react-native-community/netinfo';
import { syncAnswers } from './syncAnswers';
import { syncClaims } from './syncClaims';
import { getDBConnection } from '../localDB/db';

export const triggerSync = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected || state.type !== 'wifi') return;

  const db = await getDBConnection();
  await syncAnswers(db);
  await syncClaims(db);
};