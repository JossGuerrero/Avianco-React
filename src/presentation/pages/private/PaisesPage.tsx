import { CrudPage } from '../../components/CrudPage';
import { useCaseFactory } from '../../../infrastructure/factories/repository.factory';
import { useAuthStore } from '../../store/authStore';

export function PaisesPage() {
  const isStaff = useAuthStore((state) => state.isStaff);

  return (
    <CrudPage
      titulo="Países"
      nombreEntidad="país"
      useCases={useCaseFactory.paises}
      puedeMutar={isStaff}
      columns={[
        {
          header: 'Bandera',
          render: (p) =>
            p.bandera.startsWith('http') ? (
              <img src={p.bandera} alt={p.nombre} className="h-4 w-6 rounded-sm object-cover" />
            ) : (
              p.bandera || '—'
            ),
        },
        { header: 'Nombre', render: (p) => p.nombre },
        { header: 'Código', render: (p) => <span className="font-mono">{p.codigo}</span> },
      ]}
      campos={[
        { name: 'nombre', label: 'Nombre', tipo: 'text', requerido: true, placeholder: 'Ej: Colombia' },
        { name: 'codigo', label: 'Código', tipo: 'text', requerido: true, placeholder: 'Ej: CO', maxLength: 3 },
        { name: 'bandera', label: 'Bandera (URL)', tipo: 'url', placeholder: 'https://flagcdn.com/w80/co.png' },
      ]}
      aInput={(v) => ({
        nombre: String(v.nombre).trim(),
        codigo: String(v.codigo).trim().toUpperCase(),
        bandera: String(v.bandera).trim(),
      })}
    />
  );
}
