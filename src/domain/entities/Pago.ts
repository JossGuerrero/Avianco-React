import type { EstadoPago } from '../enums/EstadoPago';

export interface Pago {
  id: number;
  reserva: number;
  metodo_pago: number;
  monto: number | string;
  estado: EstadoPago;
  referencia: string;
}

export interface PagoInput {
  reserva: number;
  metodo_pago: number;
  monto: number;
  estado: EstadoPago;
  referencia: string;
}
