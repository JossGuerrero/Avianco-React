export const TipoMetodoPago = {
  Tarjeta: 'tarjeta',
  Paypal: 'paypal',
  Transferencia: 'transferencia',
  Efectivo: 'efectivo',
} as const;

export type TipoMetodoPago = (typeof TipoMetodoPago)[keyof typeof TipoMetodoPago];
