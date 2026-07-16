export const TipoEquipaje = {
  Cabina: 'cabina',
  Bodega: 'bodega',
  Especial: 'especial',
} as const;

export type TipoEquipaje = (typeof TipoEquipaje)[keyof typeof TipoEquipaje];
