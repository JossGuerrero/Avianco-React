export const TipoServicio = {
  Comida: 'comida',
  Equipaje: 'equipaje',
  Asiento: 'asiento',
  Wifi: 'wifi',
  Seguro: 'seguro',
  Otro: 'otro',
} as const;

export type TipoServicio = (typeof TipoServicio)[keyof typeof TipoServicio];
