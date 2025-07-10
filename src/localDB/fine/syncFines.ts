import { getDBConnection } from '../db'; // Abre la conexión a la base SQLite
import { getPendingFines, markFineAsSynced } from './fines'; // Obtiene multas pendientes y permite marcarlas como sincronizadas
import { IFineType } from '../../types/fine/IFineType'; // Tipo de datos que representa la multa


export const syncFinesToServer = async (): Promise<void> => {
  const db = await getDBConnection(); // Abre la base de datos
  const fines = await getPendingFines(db); // Obtiene las multas que aún no se han sincronizado

   for (const fine of fines) {
    try {
      const response = await fetch('https://your-api.com/fines', { // 🛰️ Endpoint para crear multas en el backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Asegura formato correcto de payload
        },
        body: JSON.stringify({
          fineTypeId: fine.fineTypeId,       // Campo obligatorio (tipo de multa)
          fineTypeName: fine.fineTypeName,   // Nombre amigable del tipo
          description: fine.description,     // Texto descriptivo de la multa
          date: fine.date,                   // Fecha como string o ISO (dependiendo de cómo se guardó)
        }),
      });

          if (response.ok) {
        await markFineAsSynced(db, fine.id); // Se marca como sincronizada en SQLite
      } else {
        console.warn(`Multa ${fine.id} no se pudo sincronizar. Status: ${response.status}`);
      }
    } catch (error) {
      console.warn(`Error al sincronizar multa ${fine.id}:`, error); //  Captura errores de red o de JSON inválido
    }
  }
};