import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { triggerSync } from '../sync/syncManager'; // ruta desde utils hacia sync

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const reachable = state.isInternetReachable;
      const online = reachable === null
        ? state.isConnected ?? false
        : state.isConnected && reachable;

      setIsOnline(online);

      if (online) {
        triggerSync(); // ← Esto dispara la sincronización
      }
    });

    return () => unsubscribe();
  }, []);

  return isOnline;
};