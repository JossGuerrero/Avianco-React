export const RolTripulacion = {
  Piloto: 'piloto',
  Copiloto: 'copiloto',
  Azafata: 'azafata',
  Tecnico: 'tecnico',
} as const;

export type RolTripulacion = (typeof RolTripulacion)[keyof typeof RolTripulacion];
