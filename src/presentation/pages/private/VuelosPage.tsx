import { useCallback, useEffect, useState } from 'react';
import type { Vuelo } from '../../../domain/entities/Vuelo';
import { useCaseFactory } from '../../../infrastructure/factories/repository.factory';
import { VueloCard } from '../../components/VueloCard';
import { VueloDetalleModal } from '../../components/VueloDetalleModal';
import { SkeletonCard } from '../../components/Skeleton';
import { getErrorMessage } from '../../utils/formatters';

export function VuelosPage() {
  const [vuelos, setVuelos] = useState<Vuelo[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vueloDetalle, setVueloDetalle] = useState<Vuelo | null>(null);

  const cargar = useCallback(async (pagina: number) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await useCaseFactory.vuelos.getPage({ page: pagina });
      setVuelos(resultado.items);
      setHasNext(resultado.hasNext);
      setHasPrevious(resultado.hasPrevious);
      setCount(resultado.count);
    } catch (e) {
      setError(getErrorMessage(e, 'No se pudieron cargar los vuelos'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar(page);
  }, [cargar, page]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-black">
          Todos los <span className="text-primary">vuelos</span>
        </h1>
        {count > 0 && <p className="text-sm text-gray-400">{count} vuelos en total</p>}
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-primary/40 bg-primary/10 p-4 text-sm text-primary-light">
          {error}
        </p>
      )}

      {!loading && !error && vuelos.length === 0 && (
        <p className="mt-6 text-gray-400">No hay vuelos registrados.</p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
          : vuelos.map((vuelo) => (
              <VueloCard key={vuelo.id} vuelo={vuelo} onClick={() => setVueloDetalle(vuelo)} />
            ))}
      </div>

      {!loading && (hasNext || hasPrevious) && (
        <div className="mt-8 flex items-center justify-center gap-3 text-sm">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={!hasPrevious}
            className="rounded-lg border border-dark-border px-4 py-2 text-gray-300 transition-all duration-200 hover:border-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-gray-400">Página {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNext}
            className="rounded-lg border border-dark-border px-4 py-2 text-gray-300 transition-all duration-200 hover:border-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}

      <VueloDetalleModal vuelo={vueloDetalle} onClose={() => setVueloDetalle(null)} />
    </div>
  );
}
