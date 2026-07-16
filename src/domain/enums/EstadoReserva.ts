export const EstadoReserva = {
  Confirmada: 'confirmada',
  Cancelada: 'cancelada',
  Embarcado: 'embarcado',
} as const;

export type EstadoReserva = (typeof EstadoReserva)[keyof typeof EstadoReserva];
