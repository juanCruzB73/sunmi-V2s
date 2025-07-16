import { getDBConnection } from '../db'; // Abre la conexión local SQLite
import { getPendingVehicles, markVehicleAsSynced } from './vehicle'; // Funciones para leer y actualizar el estado de los registros

export const syncVehicleToServer = async (): Promise<void> => {
  const db = await getDBConnection(); //  Abre la base de datos app_data.db
  const pendingVehicles = await getPendingVehicles(db); //  Obtiene todos los vehículos donde synced = 0

   for (const vehicle of pendingVehicles) {
    try {
      const response = await fetch('https://your-api.com/vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId: vehicle.vehicleId,               // ID único del vehículo
          patente: vehicle.patente,                   // Patente del vehículo
          description: vehicle.description,           // Descripción adicional
          date: vehicle.date.toISOString?.() ?? vehicle.date, //  Convierte la fecha si es tipo Date
        }),
      });

    if (response.ok) {
        await markVehicleAsSynced(db, vehicle.vehicleId); // ☑️ Marca como sincronizado en la base local
      } else {
        console.warn(
          `Vehículo ${vehicle.vehicleId} no se pudo sincronizar. Status: ${response.status}`
        );
      }
    } catch (error) {
      console.warn(`Error al sincronizar vehículo ${vehicle.vehicleId}:`, error); // ⚠️ Captura errores de red u otro tipo
    }
  }
};