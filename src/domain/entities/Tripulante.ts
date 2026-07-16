import type { RolTripulacion } from '../enums/RolTripulacion';

export interface Tripulante {
  id: number;
  nombre: string;
  apellido: string;
  rol: RolTripulacion;
  licencia: string;
  activo: boolean;
}

export type TripulanteInput = Omit<Tripulante, 'id'>;
