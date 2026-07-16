import type { Vuelo } from '../../domain/entities/Vuelo';
import type { Reserva } from '../../domain/entities/Reserva';
import type { Aeropuerto } from '../../domain/entities/Aeropuerto';
import { formatFecha } from './formatters';

export function labelVuelo(vuelo: Vuelo): string {
  const origen = vuelo.origen_detalle?.codigo_iata ?? `#${vuelo.origen}`;
  const destino = vuelo.destino_detalle?.codigo_iata ?? `#${vuelo.destino}`;
  return `${origen} → ${destino} · ${formatFecha(vuelo.fecha_salida)}`;
}

export function labelReserva(reserva: Reserva): string {
  return `Reserva #${reserva.id} · asiento ${reserva.asiento} (${reserva.estado})`;
}

export function labelAeropuerto(aeropuerto: Aeropuerto): string {
  return `${aeropuerto.codigo_iata} · ${aeropuerto.nombre}`;
}
