import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { syncFinesToServer } from '../db/fine/syncFines';
import { syncCommerceToServer } from '../db/commerce/syncCommerce';
import { syncVehicleToServer } from '../db/vehicle/syncVehicle';

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
        syncFinesToServer();
        syncCommerceToServer();
        syncVehicleToServer();
      }
    });

    return () => unsubscribe();
  }, []);

  return isOnline;
};