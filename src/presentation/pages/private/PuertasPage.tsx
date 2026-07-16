import { useMemo } from 'react';
import { CrudPage } from '../../components/CrudPage';
import { Badge } from '../../components/Badge';
import { useCaseFactory } from '../../../infrastructure/factories/repository.factory';
import { useAuthStore } from '../../store/authStore';
import { useLista } from '../../utils/useLista';

export function PuertasPage() {
  const isStaff = useAuthStore((state) => state.isStaff);
  const terminales = useLista(useCaseFactory.terminales);
  const terminalesPorId = useMemo(() => new Map(terminales.map((t) => [t.id, t])), [terminales]);

  return (
    <CrudPage
      titulo="Puertas"
      nombreEntidad="puerta"
      useCases={useCaseFactory.puertas}
      puedeMutar={isStaff}
      columns={[
        { header: 'Código', render: (p) => <span className="font-mono font-bold">{p.codigo}</span> },
        { header: 'Terminal', render: (p) => terminalesPorId.get(p.terminal)?.nombre ?? `#${p.terminal}` },
        { header: 'Estado', render: (p) => <Badge estado={p.activa ? 'activa' : 'inactivo'} /> },
      ]}
      campos={[
        {
          name: 'terminal',
          label: 'Terminal',
          tipo: 'select',
          requerido: true,
          placeholder: 'Selecciona una terminal',
          options: terminales.map((t) => ({ value: String(t.id), label: t.nombre })),
        },
        { name: 'codigo', label: 'Código', tipo: 'text', requerido: true, placeholder: 'Ej: A12' },
        { name: 'activa', label: 'Activa', tipo: 'checkbox' },
      ]}
      aInput={(v) => ({
        terminal: Number(v.terminal),
        codigo: String(v.codigo).trim().toUpperCase(),
        activa: Boolean(v.activa),
      })}
    />
  );
}
