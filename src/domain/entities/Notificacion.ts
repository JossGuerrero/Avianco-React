import type { TipoNotificacion } from '../enums/TipoNotificacion';

export interface Notificacion {
  id: number;
  usuario: number;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  leida: boolean;
}

export type NotificacionInput = Omit<Notificacion, 'id'>;
