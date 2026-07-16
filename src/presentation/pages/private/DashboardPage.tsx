import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface Acceso {
  to: string;
  titulo: string;
  descripcion: string;
  soloStaff?: boolean;
}

const ACCESOS: Acceso[] = [
  { to: '/vuelos', titulo: 'Vuelos', descripcion: 'Consulta los vuelos disponibles' },
  { to: '/reservas', titulo: 'Reservas', descripcion: 'Gestiona tus reservas de vuelo' },
  { to: '/pasajeros', titulo: 'Pasajeros', descripcion: 'Administra los perfiles de pasajero' },
  { to: '/facturas', titulo: 'Facturas', descripcion: 'Revisa tus facturas' },
  { to: '/pagos', titulo: 'Pagos', descripcion: 'Consulta el estado de tus pagos' },
  {
    to: '/tripulacion',
    titulo: 'Tripulación',
    descripcion: 'Gestión de tripulantes (solo staff)',
    soloStaff: true,
  },
];

export function DashboardPage() {
  const { user, isStaff } = useAuthStore();

  const accesos = ACCESOS.filter((acceso) => !acceso.soloStaff || isStaff);

  return (
    <div>
      <section className="rounded-2xl bg-gradient-to-r from-primary-dark via-primary to-primary-light p-8 shadow-lg">
        <h1 className="text-3xl font-black">Hola, {user?.firstName || user?.username || 'viajero'}</h1>
        <p className="mt-2 text-red-100">
          Rol:{' '}
          <span className="rounded-full bg-black/30 px-3 py-1 text-sm font-semibold">
            {isStaff ? 'Staff / Administrador' : 'Cliente'}
          </span>
        </p>
      </section>

      <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {accesos.map((acceso) => (
          <Link
            key={acceso.to}
            to={acceso.to}
            className="rounded-2xl border border-dark-border bg-dark-surface p-6 transition-colors hover:border-primary"
          >
            <h2 className="text-lg font-bold">{acceso.titulo}</h2>
            <p className="mt-1 text-sm text-gray-400">{acceso.descripcion}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
