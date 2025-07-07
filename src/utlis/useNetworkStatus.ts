import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true); // por defecto true para evitar bloqueos iniciales

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const reachable = state.isInternetReachable;
      if (reachable === null) {
        // fallback temporal si aún no se evaluó
        setIsOnline(state.isConnected ?? false);
      } else {
        setIsOnline(state.isConnected && reachable);
      }
    });
    return () => unsubscribe();
  }, []);

  return isOnline;
};