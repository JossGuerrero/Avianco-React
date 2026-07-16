export const EstadoPago = {
  Pendiente: 'pendiente',
  Completado: 'completado',
  Fallido: 'fallido',
  Reembolsado: 'reembolsado',
} as const;

export type EstadoPago = (typeof EstadoPago)[keyof typeof EstadoPago];
