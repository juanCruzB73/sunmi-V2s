import { useState } from 'react';

export const useVehicleForm = () => {
  const [vehicle, setVehicle] = useState({
    patente: '',
    marca: '',
    modelo: '',
    color: '',
    tipo: '',
    anio: '',
    gravedad: '',
    calle: '',
    numeracion: '',
    descripcion: '',
    fecha: '',
  });

  const handleChange = (field: keyof typeof vehicle, value: string) => {
    setVehicle(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setVehicle({
      patente: '',
      marca: '',
      modelo: '',
      color: '',
      tipo: '',
      anio: '',
      gravedad: '',
      calle: '',
      numeracion: '',
      descripcion: '',
      fecha: '',
    });
  };

  const formatDate = (date: Date): string =>
    `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;

  return { vehicle, handleChange, handleReset, formatDate };
};