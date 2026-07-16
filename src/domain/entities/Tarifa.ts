import type { ClaseTarifa } from '../enums/ClaseTarifa';

export interface Tarifa {
  id: number;
  nombre: string;
  clase: ClaseTarifa;
  descripcion: string;
  descuento: number | string;
}

export interface TarifaInput {
  nombre: string;
  clase: ClaseTarifa;
  descripcion: string;
  descuento: number;
}
