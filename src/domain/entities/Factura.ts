import type { EstadoFactura } from '../enums/EstadoFactura';

export interface Factura {
  id: number;
  reserva: number;
  total: number | string;
  impuestos: number | string;
  estado: EstadoFactura;
}

export interface FacturaInput {
  reserva: number;
  total: number;
  impuestos: number;
  estado: EstadoFactura;
}
