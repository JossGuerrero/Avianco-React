import type { Vuelo } from '../../domain/entities/Vuelo';
import { formatFecha, formatPrecio } from '../utils/formatters';
import { Badge } from './Badge';

interface VueloCardProps {
  vuelo: Vuelo;
  onClick?: () => void;
}

export function VueloCard({ vuelo, onClick }: VueloCardProps) {
  const origen = vuelo.origen_detalle;
  const destino = vuelo.destino_detalle;

  return (
    <article
      onClick={onClick}
      className={`rounded-2xl bg-gradient-to-br from-dark-surface to-dark border border-dark-border p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-xl ${
        onClick ? 'cursor-pointer hover:border-primary/60' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary-light">
          Vuelo #{vuelo.id}
        </span>
        <Badge estado={vuelo.estado} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-2xl font-bold text-white">{origen?.codigo_iata ?? `#${vuelo.origen}`}</p>
          <p className="text-sm text-gray-300">{origen?.ciudad ?? ''}</p>
          <p className="text-xs text-gray-400">{formatFecha(vuelo.fecha_salida)}</p>
        </div>
        <div className="flex-1 px-2">
          <div className="relative h-px bg-gradient-to-r from-transparent via-primary to-transparent">
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-primary" />
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">
            {destino?.codigo_iata ?? `#${vuelo.destino}`}
          </p>
          <p className="text-sm text-gray-300">{destino?.ciudad ?? ''}</p>
          <p className="text-xs text-gray-400">{formatFecha(vuelo.fecha_llegada)}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-dark-border pt-4">
        <p className="text-xl font-bold text-primary-light">{formatPrecio(vuelo.precio)}</p>
        {vuelo.aeronave_detalle && (
          <p className="text-xs text-gray-400">{vuelo.aeronave_detalle.modelo}</p>
        )}
      </div>
    </article>
  );
}
