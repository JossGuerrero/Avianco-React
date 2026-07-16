export interface AsignacionTripulacion {
  id: number;
  vuelo: number;
  tripulacion: number;
}

export type AsignacionTripulacionInput = Omit<AsignacionTripulacion, 'id'>;
