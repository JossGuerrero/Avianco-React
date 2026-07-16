import { useMemo } from 'react';
import { CrudPage } from '../../components/CrudPage';
import { useCaseFactory } from '../../../infrastructure/factories/repository.factory';
import { useAuthStore } from '../../store/authStore';
import { useLista } from '../../utils/useLista';

export function CiudadesPage() {
  const isStaff = useAuthStore((state) => state.isStaff);
  const paises = useLista(useCaseFactory.paises);
  const paisesPorId = useMemo(() => new Map(paises.map((p) => [p.id, p])), [paises]);

  return (
    <CrudPage
      titulo="Ciudades"
      nombreEntidad="ciudad"
      useCases={useCaseFactory.ciudades}
      puedeMutar={isStaff}
      columns={[
        { header: 'Nombre', render: (c) => c.nombre },
        { header: 'País', render: (c) => paisesPorId.get(c.pais)?.nombre ?? `#${c.pais}` },
      ]}
      campos={[
        { name: 'nombre', label: 'Nombre', tipo: 'text', requerido: true, placeholder: 'Ej: Medellín' },
        {
          name: 'pais',
          label: 'País',
          tipo: 'select',
          requerido: true,
          placeholder: 'Selecciona un país',
          options: paises.map((p) => ({ value: String(p.id), label: p.nombre })),
        },
      ]}
      aInput={(v) => ({
        nombre: String(v.nombre).trim(),
        pais: Number(v.pais),
      })}
    />
  );
}
