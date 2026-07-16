export const EstadoFactura = {
  Pendiente: 'pendiente',
  Pagada: 'pagada',
  Anulada: 'anulada',
} as const;

export type EstadoFactura = (typeof EstadoFactura)[keyof typeof EstadoFactura];
