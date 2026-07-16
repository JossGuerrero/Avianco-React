// tsconfig usa erasableSyntaxOnly: los `enum` de TS no están permitidos,
// por eso se modela como objeto const + tipo unión.
export const EstadoVuelo = {
  Programado: 'programado',
  Abordando: 'abordando',
  Despegado: 'despegado',
  Aterrizado: 'aterrizado',
  Cancelado: 'cancelado',
} as const;

export type EstadoVuelo = (typeof EstadoVuelo)[keyof typeof EstadoVuelo];
