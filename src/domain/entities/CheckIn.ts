export interface CheckIn {
  id: number;
  reserva: number;
  puerta: number;
  tarjeta_embarque: string;
  estado: string;
}

export type CheckInInput = Omit<CheckIn, 'id'>;
