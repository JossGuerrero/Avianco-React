import { useEffect, useState } from 'react';

interface Listable<T> {
  getAll(): Promise<T[]>;
}

// Carga una lista relacionada (para dropdowns). La fuente debe ser estable
// (una instancia de la factory), no una arrow function creada en el render.
export function useLista<T>(fuente: Listable<T>): T[] {
  const [datos, setDatos] = useState<T[]>([]);

  useEffect(() => {
    let cancelado = false;
    fuente
      .getAll()
      .then((lista) => {
        if (!cancelado) setDatos(lista);
      })
      .catch(() => {
        // La página principal ya muestra su propio error; el dropdown queda vacío.
      });
    return () => {
      cancelado = true;
    };
  }, [fuente]);

  return datos;
}
