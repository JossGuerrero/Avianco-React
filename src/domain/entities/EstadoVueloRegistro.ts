import type { EstadoVuelo } from '../enums/EstadoVuelo';

// Historial de cambios de estado de un vuelo (endpoint /estados-vuelo/).
export interface EstadoVueloRegistro {
  id: number;
  vuelo: number;
  estado: EstadoVuelo;
  descripcion: string;
}

export type EstadoVueloRegistroInput = Omit<EstadoVueloRegistro, 'id'>;
