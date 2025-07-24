import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo'; // Librería para detectar conectividad de red

// Hook personalizado que detecta si el dispositivo está online
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true); // Estado que representa si hay conexión

  useEffect(() => {
    // Se suscribe a los cambios de red
    const unsubscribe = NetInfo.addEventListener(state => {
      const reachable = state.isInternetReachable;

      // Determina si el dispositivo está realmente conectado
      const online = reachable === null
        ? state.isConnected ?? false
        : state.isConnected && reachable;

      setIsOnline(online); // Actualiza estado local

      if (online) {
      }
    });

    return () => unsubscribe(); // Limpia la suscripción al desmontar el componente
  }, []);

  return isOnline; // Retorna el estado de red (si se requiere desde el componente)
};