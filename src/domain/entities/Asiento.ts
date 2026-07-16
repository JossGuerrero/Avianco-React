import type { ClaseTarifa } from '../enums/ClaseTarifa';

export interface Asiento {
  id: number;
  vuelo: number;
  codigo: string;
  clase: ClaseTarifa;
  fila: number;
  columna: string;
  disponible: boolean;
}

export type AsientoInput = Omit<Asiento, 'id'>;
