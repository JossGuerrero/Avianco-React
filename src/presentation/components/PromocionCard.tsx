import type { Promocion } from '../../domain/entities/Promocion';
import { formatFechaCorta } from '../utils/formatters';

interface PromocionCardProps {
  promocion: Promocion;
}

export function PromocionCard({ promocion }: PromocionCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-dark via-primary to-primary-light p-6 shadow-lg transition-transform hover:-translate-y-1">
      <span className="absolute -right-4 -top-4 text-8xl font-black text-white/10 select-none">
        %
      </span>
      <p className="text-3xl font-black text-white">-{Number(promocion.descuento)}%</p>
      <p className="mt-2 inline-block rounded-lg bg-black/30 px-3 py-1 font-mono text-sm font-bold text-white">
        {promocion.codigo}
      </p>
      <p className="mt-3 text-sm text-red-100">{promocion.descripcion}</p>
      <p className="mt-4 text-xs text-red-200">
        Válida del {formatFechaCorta(promocion.fecha_inicio)} al{' '}
        {formatFechaCorta(promocion.fecha_fin)}
      </p>
    </article>
  );
}
