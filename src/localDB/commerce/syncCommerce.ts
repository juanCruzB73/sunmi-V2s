import { getDBConnection } from '../db'; // Abre la conexión a la base de datos local
import { getPendingCommerce, markCommerceAsSynced } from './commerce'; // Funciones para obtener y actualizar el estado de sincronización
import { ICommerce } from '../../types/modal/ICommerce'; // Tipo de datos del comercio

export const syncCommerceToServer = async (): Promise<void> => {
  const db = await getDBConnection(); //  Abre la base de datos
  const pendingCommerce = await getPendingCommerce(db); //  Busca registros no sincronizados

  for (const item of pendingCommerce) { //  Recorre todos los comercios pendientes
    try {
      const response = await fetch('https://your-api.com/commerce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Asegura formato correcto para el backend
        },
        body: JSON.stringify({
          commerceId: item.commerceId,
          rutcommerce: item.rutcommerce,
          description: item.description,
          date: item.date.toISOString?.() ?? item.date, //  Convierte la fecha si es un objeto Date
        }),
      });

      if (response.ok) {
        await markCommerceAsSynced(db, item.commerceId); //  Marca como sincronizado si fue exitoso
      } else {
        console.warn(`Comercio ${item.commerceId} no se pudo sincronizar. Status: ${response.status}`);
      }
    } catch (error) {
      console.warn(`Error al sincronizar comercio ${item.commerceId}:`, error); //  Loguea cualquier error de red o fetch
    }
  }
};