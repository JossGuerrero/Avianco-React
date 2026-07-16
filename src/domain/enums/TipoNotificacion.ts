export const TipoNotificacion = {
  Info: 'info',
  Alerta: 'alerta',
  Cancelado: 'cancelado',
  Embarque: 'embarque',
} as const;

export type TipoNotificacion = (typeof TipoNotificacion)[keyof typeof TipoNotificacion];
