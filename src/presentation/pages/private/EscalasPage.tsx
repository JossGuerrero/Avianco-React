import { useMemo } from 'react';
import { CrudPage } from '../../components/CrudPage';
import { useCaseFactory } from '../../../infrastructure/factories/repository.factory';
import { useAuthStore } from '../../store/authStore';
import { useLista } from '../../utils/useLista';
import { labelAeropuerto, labelVuelo } from '../../utils/labels';
import { formatFecha } from '../../utils/formatters';

export function EscalasPage() {
  const isStaff = useAuthStore((state) => state.isStaff);
  const vuelos = useLista(useCaseFactory.vuelos);
  const aeropuertos = useLista(useCaseFactory.aeropuertos);
  const vuelosPorId = useMemo(() => new Map(vuelos.map((v) => [v.id, v])), [vuelos]);
  const aeropuertosPorId = useMemo(
    () => new Map(aeropuertos.map((a) => [a.id, a])),
    [aeropuertos],
  );

  return (
    <CrudPage
      titulo="Escalas"
      nombreEntidad="escala"
      useCases={useCaseFactory.escalas}
      puedeMutar={isStaff}
      columns={[
        {
          header: 'Vuelo',
          render: (e) => {
            const vuelo = vuelosPorId.get(e.vuelo);
            return vuelo ? labelVuelo(vuelo) : `Vuelo #${e.vuelo}`;
          },
        },
        {
          header: 'Aeropuerto',
          render: (e) => {
            const aeropuerto = aeropuertosPorId.get(e.aeropuerto);
            return aeropuerto ? labelAeropuerto(aeropuerto) : `#${e.aeropuerto}`;
          },
        },
        { header: 'Orden', render: (e) => e.orden },
        { header: 'Llegada', render: (e) => formatFecha(e.llegada) },
        { header: 'Salida', render: (e) => formatFecha(e.salida) },
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
          name: 'aeropuerto',
          label: 'Aeropuerto',
          tipo: 'select',
          requerido: true,
          placeholder: 'Selecciona un aeropuerto',
          options: aeropuertos.map((a) => ({ value: String(a.id), label: labelAeropuerto(a) })),
        },
        { name: 'orden', label: 'Orden', tipo: 'number', requerido: true, defaultValue: '1' },
        { name: 'llegada', label: 'Llegada', tipo: 'datetime-local', requerido: true },
        { name: 'salida', label: 'Salida', tipo: 'datetime-local', requerido: true },
      ]}
      aInput={(v) => {
        const orden = Number(v.orden);
        if (Number.isNaN(orden) || orden <= 0) return 'El orden debe ser un número positivo';
        return {
          vuelo: Number(v.vuelo),
          aeropuerto: Number(v.aeropuerto),
          orden,
          llegada: String(v.llegada),
          salida: String(v.salida),
        };
      }}
    />
  );
}
