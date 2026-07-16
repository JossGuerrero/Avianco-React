import { CrudPage } from '../../components/CrudPage';
import { Badge } from '../../components/Badge';
import { TipoMetodoPago } from '../../../domain/enums/TipoMetodoPago';
import { useCaseFactory } from '../../../infrastructure/factories/repository.factory';
import { useAuthStore } from '../../store/authStore';

export function MetodosPagoPage() {
  const isStaff = useAuthStore((state) => state.isStaff);

  return (
    <CrudPage
      titulo="Métodos de pago"
      nombreEntidad="método de pago"
      useCases={useCaseFactory.metodosPago}
      puedeMutar={isStaff}
      columns={[
        { header: 'Nombre', render: (m) => m.nombre },
        { header: 'Tipo', render: (m) => <span className="capitalize">{m.tipo}</span> },
        { header: 'Estado', render: (m) => <Badge estado={m.activo ? 'activo' : 'inactivo'} /> },
      ]}
      campos={[
        { name: 'nombre', label: 'Nombre', tipo: 'text', requerido: true, placeholder: 'Ej: Visa crédito' },
        {
          name: 'tipo',
          label: 'Tipo',
          tipo: 'select',
          requerido: true,
          options: Object.values(TipoMetodoPago).map((t) => ({ value: t, label: t })),
        },
        { name: 'activo', label: 'Activo', tipo: 'checkbox' },
      ]}
      aInput={(v) => ({
        nombre: String(v.nombre).trim(),
        tipo: String(v.tipo) as TipoMetodoPago,
        activo: Boolean(v.activo),
      })}
    />
  );
}
