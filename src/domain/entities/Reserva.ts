import type { EstadoReserva } from '../enums/EstadoReserva';

export interface Reserva {
  id: number;
  vuelo: number;
  pasajero: number;
  asiento: string;
  estado: EstadoReserva;
}

export type ReservaInput = Omit<Reserva, 'id'>;
