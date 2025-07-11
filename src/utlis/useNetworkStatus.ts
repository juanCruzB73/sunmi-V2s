import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { syncCommerceToServer } from '../localDB/commerce/syncCommerce';
import { syncFinesToServer } from '../localDB/fine/syncFines';
import { syncVehicleToServer } from '../localDB/vehicle/syncVehicle';


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