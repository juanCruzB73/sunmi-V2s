import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';


export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true); // por defecto true para evitar bloqueos iniciales

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const reachable = state.isInternetReachable;
      const online = reachable === null
        ? state.isConnected ?? false
        : state.isConnected && reachable;

      setIsOnline(online);

      // Sincronización automática al recuperar conexión
      if (online) {
        
      }
    });

    return () => unsubscribe();
  }, []);

  return isOnline;
};