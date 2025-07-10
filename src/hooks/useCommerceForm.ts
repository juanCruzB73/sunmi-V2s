import { useState } from 'react';

interface ICommerce {
  rutcommerce: string;
  commerceregister: string;
  tipo: string;
  gravedad: string;
  calle: string;
  numeracion: string;
  descripcion: string;
  fecha: string;
}

export const useCommerceForm = () => {
  const [commerce, setCommerce] = useState<ICommerce>({
    rutcommerce: '',
    commerceregister: '',
    tipo: '',
    gravedad: '',
    calle: '',
    numeracion: '',
    descripcion: '',
    fecha: '',
  });

  const handleChange = (field: keyof ICommerce, value: string) => {
    setCommerce(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setCommerce({
      rutcommerce: '',
      commerceregister: '',
      tipo: '',
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

  return {
    commerce,
    handleChange,
    handleReset,
    formatDate,
  };
};