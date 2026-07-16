import { useState, type ReactNode } from 'react';
import { Skeleton } from './Skeleton';

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

// Paginación controlada por el servidor (DRF): la página actual y los datos
// los maneja la página, la tabla solo pinta los controles.
export interface ServerPagination {
  page: number;
  hasNext: boolean;
  hasPrevious: boolean;
  count?: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowId: (row: T) => number;
  loading?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  actions?: (row: T) => ReactNode;
  pagination?: ServerPagination;
}

function BotonPagina({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg border border-dark-border px-3 py-1 transition-all duration-200 hover:border-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  loading = false,
  pageSize = 8,
  emptyMessage = 'Sin registros',
  actions,
  pagination,
}: DataTableProps<T>) {
  const [pageLocal, setPageLocal] = useState(0);

  const totalColumnas = columns.length + (actions ? 1 : 0);

  // Sin paginación de servidor, se pagina en cliente sobre los datos cargados.
  const totalPagesLocal = Math.max(1, Math.ceil(data.length / pageSize));
  const paginaLocal = Math.min(pageLocal, totalPagesLocal - 1);
  const filas = pagination
    ? data
    : data.slice(paginaLocal * pageSize, (paginaLocal + 1) * pageSize);

  return (
    <div className="overflow-hidden rounded-2xl border border-dark-border bg-dark-surface">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-dark-border text-xs uppercase tracking-wide text-gray-400">
              {columns.map((col) => (
                <th key={col.header} className={`px-4 py-3 font-semibold ${col.className ?? ''}`}>
                  {col.header}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right font-semibold">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }, (_, i) => (
                <tr key={i} className="border-b border-dark-border/50 last:border-b-0">
                  {Array.from({ length: totalColumnas }, (_, j) => (
                    <td key={j} className="px-4 py-3.5">
                      <Skeleton className="h-4 w-full max-w-32" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading && filas.length === 0 && (
              <tr>
                <td colSpan={totalColumnas} className="px-4 py-10 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!loading &&
              filas.map((fila) => (
                <tr
                  key={getRowId(fila)}
                  className="border-b border-dark-border/50 text-gray-200 transition-colors last:border-b-0 hover:bg-dark/50"
                >
                  {columns.map((col) => (
                    <td key={col.header} className={`px-4 py-3 ${col.className ?? ''}`}>
                      {col.render(fila)}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">{actions(fila)}</div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación del servidor */}
      {pagination && !loading && (pagination.hasNext || pagination.hasPrevious) && (
        <div className="flex items-center justify-between border-t border-dark-border px-4 py-3 text-sm text-gray-400">
          <span>
            Página {pagination.page}
            {pagination.count !== undefined && ` · ${pagination.count} registros en total`}
          </span>
          <div className="flex gap-2">
            <BotonPagina
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevious}
            >
              Anterior
            </BotonPagina>
            <BotonPagina
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
            >
              Siguiente
            </BotonPagina>
          </div>
        </div>
      )}

      {/* Paginación en cliente (por defecto) */}
      {!pagination && !loading && totalPagesLocal > 1 && (
        <div className="flex items-center justify-between border-t border-dark-border px-4 py-3 text-sm text-gray-400">
          <span>
            Página {paginaLocal + 1} de {totalPagesLocal} · {data.length} registros
          </span>
          <div className="flex gap-2">
            <BotonPagina onClick={() => setPageLocal(paginaLocal - 1)} disabled={paginaLocal === 0}>
              Anterior
            </BotonPagina>
            <BotonPagina
              onClick={() => setPageLocal(paginaLocal + 1)}
              disabled={paginaLocal >= totalPagesLocal - 1}
            >
              Siguiente
            </BotonPagina>
          </div>
        </div>
      )}
    </div>
  );
}
