import { useMemo } from 'react';
import { CrudPage } from '../../components/CrudPage';
import { useCaseFactory } from '../../../infrastructure/factories/repository.factory';
import { useAuthStore } from '../../store/authStore';
import { useLista } from '../../utils/useLista';
import { labelVuelo } from '../../utils/labels';

export function AsignacionesPage() {
  const isStaff = useAuthStore((state) => state.isStaff);
  const vuelos = useLista(useCaseFactory.vuelos);
  const tripulantes = useLista(useCaseFactory.tripulacion);
  const vuelosPorId = useMemo(() => new Map(vuelos.map((v) => [v.id, v])), [vuelos]);
  const tripulantesPorId = useMemo(
    () => new Map(tripulantes.map((t) => [t.id, t])),
    [tripulantes],
  );

  return (
    <CrudPage
      titulo="Asignaciones de tripulación"
      nombreEntidad="asignación"
      useCases={useCaseFactory.asignaciones}
      puedeMutar={isStaff}
      columns={[
        {
          header: 'Vuelo',
          render: (a) => {
            const vuelo = vuelosPorId.get(a.vuelo);
            return vuelo ? labelVuelo(vuelo) : `Vuelo #${a.vuelo}`;
          },
        },
        {
          header: 'Tripulante',
          render: (a) => {
            const tripulante = tripulantesPorId.get(a.tripulacion);
            return tripulante
              ? `${tripulante.nombre} ${tripulante.apellido} (${tripulante.rol})`
              : `#${a.tripulacion}`;
          },
        },
      ]}
      campos={[
        {
          name: 'vuelo',
          label: 'Vuelo',
          tipo: 'select',
          requerido: true,
          placeholder: 'Selecciona un vuelo',
          options: vuelos.map((v) => ({ value: String(v.id), label: labelVuelo(v) })),
        },
        {
          name: 'tripulacion',
          label: 'Tripulante',
          tipo: 'select',
          requerido: true,
          placeholder: 'Selecciona un tripulante',
          options: tripulantes
            .filter((t) => t.activo)
            .map((t) => ({ value: String(t.id), label: `${t.nombre} ${t.apellido} (${t.rol})` })),
        },
      ]}
      aInput={(v) => ({
        vuelo: Number(v.vuelo),
        tripulacion: Number(v.tripulacion),
      })}
    />
  );
}
