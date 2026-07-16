export interface ReservaServicio {
  id: number;
  reserva: number;
  servicio: number;
  cantidad: number;
  precio_aplicado: number | string;
}

export interface ReservaServicioInput {
  reserva: number;
  servicio: number;
  cantidad: number;
  precio_aplicado: number;
}
