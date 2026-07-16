import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Vuelo } from '../../../domain/entities/Vuelo';
import type { Pasajero } from '../../../domain/entities/Pasajero';
import type { Asiento } from '../../../domain/entities/Asiento';
import type { MetodoPago } from '../../../domain/entities/MetodoPago';
import type { Reserva } from '../../../domain/entities/Reserva';
import type { Factura } from '../../../domain/entities/Factura';
import { EstadoReserva } from '../../../domain/enums/EstadoReserva';
import { EstadoPago } from '../../../domain/enums/EstadoPago';
import { EstadoFactura } from '../../../domain/enums/EstadoFactura';
import { useCaseFactory } from '../../../infrastructure/factories/repository.factory';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/Button';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { PaisSelect } from '../../components/PaisSelect';
import { Skeleton } from '../../components/Skeleton';
import { formatFecha, formatPrecio, getErrorMessage } from '../../utils/formatters';

const TASA_IMPUESTOS = 0.12;

type EstadoPaso = 'pendiente' | 'ok' | 'error';

interface Paso {
  nombre: string;
  estado: EstadoPaso;
  detalle?: string;
}

interface ResultadoCompra {
  reserva: Reserva;
  factura: Factura | null;
  total: number;
}

const PASOS_INICIALES: Paso[] = [
  { nombre: 'Crear reserva', estado: 'pendiente' },
  { nombre: 'Registrar pago', estado: 'pendiente' },
  { nombre: 'Emitir factura', estado: 'pendiente' },
  { nombre: 'Bloquear asiento', estado: 'pendiente' },
];

export function CheckoutPage() {
  const { vueloId } = useParams();
  const { user, isStaff } = useAuthStore();

  const [vuelo, setVuelo] = useState<Vuelo | null>(null);
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([]);
  const [asientos, setAsientos] = useState<Asiento[]>([]);
  const [metodos, setMetodos] = useState<MetodoPago[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selecciones
  const [pasajeroId, setPasajeroId] = useState('');
  const [asientoSel, setAsientoSel] = useState('');
  const [metodoId, setMetodoId] = useState('');

  // Creación rápida de pasajero
  const [creandoPasajero, setCreandoPasajero] = useState(false);
  const [nuevoPasajero, setNuevoPasajero] = useState({
    numero_pasaporte: '',
    nacionalidad: '',
    fecha_nacimiento: '',
    telefono: '',
  });
  const [errorPasajero, setErrorPasajero] = useState<string | null>(null);
  const [guardandoPasajero, setGuardandoPasajero] = useState(false);

  // Proceso de compra
  const [pasos, setPasos] = useState<Paso[]>(PASOS_INICIALES);
  const [comprando, setComprando] = useState(false);
  const [errorCompra, setErrorCompra] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoCompra | null>(null);

  const cargar = useCallback(async () => {
    const id = Number(vueloId);
    if (!id) {
      setError('Vuelo inválido');
      setCargando(false);
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const [vueloData, pasajerosData, asientosData, metodosData] = await Promise.all([
        useCaseFactory.vuelos.getById(id),
        useCaseFactory.pasajeros.getAll(),
        useCaseFactory.asientos.getAll({ vuelo: id }).catch(() => [] as Asiento[]),
        useCaseFactory.metodosPago.getAll().catch(() => [] as MetodoPago[]),
      ]);
      setVuelo(vueloData);
      setPasajeros(pasajerosData);
      setAsientos(asientosData.filter((a) => a.disponible));
      setMetodos(metodosData.filter((m) => m.activo));
    } catch (e) {
      setError(getErrorMessage(e, 'No se pudo cargar la información del vuelo'));
    } finally {
      setCargando(false);
    }
  }, [vueloId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const misPasajeros = useMemo(
    () => (isStaff ? pasajeros : pasajeros.filter((p) => p.usuario === user?.id)),
    [pasajeros, isStaff, user],
  );

  useEffect(() => {
    if (misPasajeros.length === 1 && !pasajeroId) {
      setPasajeroId(String(misPasajeros[0].id));
    }
  }, [misPasajeros, pasajeroId]);

  const precio = Number(vuelo?.precio ?? 0);
  const impuestos = Math.round(precio * TASA_IMPUESTOS * 100) / 100;
  const total = Math.round((precio + impuestos) * 100) / 100;

  function marcarPaso(indice: number, estado: EstadoPaso, detalle?: string) {
    setPasos((previos) =>
      previos.map((paso, i) => (i === indice ? { ...paso, estado, detalle } : paso)),
    );
  }

  async function crearPasajeroRapido() {
    if (!nuevoPasajero.numero_pasaporte.trim() || !nuevoPasajero.nacionalidad || !nuevoPasajero.fecha_nacimiento) {
      setErrorPasajero('Pasaporte, nacionalidad y fecha de nacimiento son obligatorios');
      return;
    }
    setGuardandoPasajero(true);
    setErrorPasajero(null);
    try {
      const creado = await useCaseFactory.pasajeros.create({
        usuario: user?.id ?? 0,
        numero_pasaporte: nuevoPasajero.numero_pasaporte.trim(),
        nacionalidad: nuevoPasajero.nacionalidad,
        fecha_nacimiento: nuevoPasajero.fecha_nacimiento,
        telefono: nuevoPasajero.telefono.trim(),
      });
      setPasajeros((previos) => [...previos, creado]);
      setPasajeroId(String(creado.id));
      setCreandoPasajero(false);
    } catch (e) {
      setErrorPasajero(getErrorMessage(e, 'No se pudo crear el pasajero'));
    } finally {
      setGuardandoPasajero(false);
    }
  }

  async function confirmarYPagar() {
    if (!vuelo) return;
    const codigoAsiento = asientoSel.trim().toUpperCase();
    if (!pasajeroId || !codigoAsiento || !metodoId) {
      setErrorCompra('Selecciona pasajero, asiento y método de pago');
      return;
    }
    setComprando(true);
    setErrorCompra(null);
    setPasos(PASOS_INICIALES);

    // Paso 1: reserva
    let reserva: Reserva;
    try {
      reserva = await useCaseFactory.reservas.create({
        vuelo: vuelo.id,
        pasajero: Number(pasajeroId),
        asiento: codigoAsiento,
        estado: EstadoReserva.Confirmada,
      });
      marcarPaso(0, 'ok', `Reserva #${reserva.id}`);
    } catch (e) {
      marcarPaso(0, 'error', getErrorMessage(e, 'Falló la creación de la reserva'));
      setErrorCompra('No se pudo crear la reserva. No se realizó ningún cobro.');
      setComprando(false);
      return;
    }

    // Paso 2: pago
    try {
      await useCaseFactory.pagos.create({
        reserva: reserva.id,
        metodo_pago: Number(metodoId),
        monto: total,
        estado: EstadoPago.Completado,
        referencia: `WEB-${Date.now()}`,
      });
      marcarPaso(1, 'ok', formatPrecio(total));
    } catch (e) {
      marcarPaso(1, 'error', getErrorMessage(e, 'Falló el registro del pago'));
      setErrorCompra(
        `La reserva #${reserva.id} se creó pero el pago falló. Puedes reintentar el pago desde el módulo Pagos o cancelar la reserva.`,
      );
      setComprando(false);
      return;
    }

    // Paso 3: factura
    let factura: Factura | null = null;
    try {
      factura = await useCaseFactory.facturas.create({
        reserva: reserva.id,
        total,
        impuestos,
        estado: EstadoFactura.Pagada,
      });
      marcarPaso(2, 'ok', `Factura #${factura.id}`);
    } catch (e) {
      marcarPaso(2, 'error', getErrorMessage(e, 'Falló la emisión de la factura'));
      setErrorCompra(
        `Reserva y pago quedaron registrados, pero la factura no se pudo emitir. Repórtalo al staff.`,
      );
    }

    // Paso 4 (opcional): marcar asiento como no disponible si venía del catálogo
    const asientoCatalogo = asientos.find((a) => a.codigo.toUpperCase() === codigoAsiento);
    if (asientoCatalogo) {
      try {
        await useCaseFactory.asientos.update(asientoCatalogo.id, { disponible: false });
        marcarPaso(3, 'ok', codigoAsiento);
      } catch {
        // Los usuarios normales no siempre pueden editar asientos: no es fatal.
        marcarPaso(3, 'error', 'El asiento no se pudo bloquear (permisos), la reserva sigue válida');
      }
    } else {
      marcarPaso(3, 'ok', 'Asiento manual, sin bloqueo en catálogo');
    }

    setResultado({ reserva, factura, total });
    setComprando(false);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (cargando) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !vuelo) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="rounded-lg border border-primary/40 bg-primary/10 p-4 text-sm text-primary-light">
          {error ?? 'Vuelo no encontrado'}
        </p>
        <Link to="/vuelos" className="mt-4 inline-block text-sm text-primary-light hover:underline">
          ← Volver a vuelos
        </Link>
      </div>
    );
  }

  // Pantalla de éxito
  if (resultado) {
    return (
      <div className="mx-auto max-w-xl animate-fade-in">
        <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20">
            <svg className="h-7 w-7 text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-black text-white">¡Compra confirmada!</h1>
          <p className="mt-2 text-sm text-gray-300">Tu vuelo quedó reservado y pagado.</p>

          <dl className="mt-6 space-y-2 rounded-xl bg-dark p-5 text-left text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-400">Reserva</dt>
              <dd className="font-bold text-white">#{resultado.reserva.id} · asiento {resultado.reserva.asiento}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">Factura</dt>
              <dd className="font-bold text-white">
                {resultado.factura ? `#${resultado.factura.id}` : 'Pendiente de emisión'}
              </dd>
            </div>
            <div className="flex justify-between border-t border-dark-border pt-2">
              <dt className="text-gray-400">Total pagado</dt>
              <dd className="text-lg font-black text-primary-light">{formatPrecio(resultado.total)}</dd>
            </div>
          </dl>

          <div className="mt-6 flex justify-center gap-3">
            <Link to="/reservas">
              <Button variant="secondary">Ver mis reservas</Button>
            </Link>
            <Link to="/vuelos">
              <Button>Buscar otro vuelo</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sinPasajero = misPasajeros.length === 0;

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <h1 className="text-3xl font-black">
        Finalizar <span className="text-primary">compra</span>
      </h1>

      {/* Resumen del vuelo */}
      <div className="mt-6 rounded-2xl border border-dark-border bg-dark-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-white">
              {vuelo.origen_detalle?.codigo_iata ?? `#${vuelo.origen}`} →{' '}
              {vuelo.destino_detalle?.codigo_iata ?? `#${vuelo.destino}`}
            </p>
            <p className="text-sm text-gray-400">
              {vuelo.origen_detalle?.ciudad} — {vuelo.destino_detalle?.ciudad}
            </p>
            <p className="mt-1 text-xs text-gray-400">Sale {formatFecha(vuelo.fecha_salida)}</p>
          </div>
          <p className="text-2xl font-bold text-primary-light">{formatPrecio(vuelo.precio)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Formulario */}
        <div className="space-y-4 rounded-2xl border border-dark-border bg-dark-surface p-5">
          {/* Pasajero */}
          {sinPasajero && !creandoPasajero ? (
            <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-4 text-sm text-yellow-300">
              Aún no tienes perfil de pasajero.{' '}
              <button
                onClick={() => setCreandoPasajero(true)}
                className="font-semibold underline transition-colors hover:text-yellow-200"
              >
                Crear uno ahora
              </button>
            </div>
          ) : (
            !creandoPasajero && (
              <div>
                <FormSelect
                  label="Pasajero"
                  value={pasajeroId}
                  onChange={(e) => setPasajeroId(e.target.value)}
                  placeholder="Selecciona un pasajero"
                  options={misPasajeros.map((p) => ({
                    value: String(p.id),
                    label: p.nombre_completo || p.numero_pasaporte,
                  }))}
                />
                <button
                  onClick={() => setCreandoPasajero(true)}
                  className="mt-1 text-xs text-primary-light transition-colors hover:underline"
                >
                  + Registrar otro pasajero
                </button>
              </div>
            )
          )}

          {creandoPasajero && (
            <div className="space-y-3 rounded-xl border border-dark-border bg-dark p-4 animate-fade-in">
              <p className="text-sm font-bold text-white">Nuevo pasajero</p>
              <FormInput
                label="Número de pasaporte"
                value={nuevoPasajero.numero_pasaporte}
                onChange={(e) =>
                  setNuevoPasajero((f) => ({ ...f, numero_pasaporte: e.target.value }))
                }
                placeholder="Ej: AB123456"
              />
              <PaisSelect
                label="Nacionalidad"
                value={nuevoPasajero.nacionalidad}
                onChange={(nombre) => setNuevoPasajero((f) => ({ ...f, nacionalidad: nombre }))}
              />
              <FormInput
                label="Fecha de nacimiento"
                type="date"
                value={nuevoPasajero.fecha_nacimiento}
                onChange={(e) =>
                  setNuevoPasajero((f) => ({ ...f, fecha_nacimiento: e.target.value }))
                }
              />
              <FormInput
                label="Teléfono"
                type="tel"
                value={nuevoPasajero.telefono}
                onChange={(e) => setNuevoPasajero((f) => ({ ...f, telefono: e.target.value }))}
              />
              {errorPasajero && (
                <p className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs text-primary-light">
                  {errorPasajero}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setCreandoPasajero(false)}>
                  Cancelar
                </Button>
                <Button isLoading={guardandoPasajero} onClick={crearPasajeroRapido}>
                  Guardar pasajero
                </Button>
              </div>
            </div>
          )}

          {/* Asiento */}
          {asientos.length > 0 ? (
            <FormSelect
              label="Asiento"
              value={asientoSel}
              onChange={(e) => setAsientoSel(e.target.value)}
              placeholder="Selecciona un asiento disponible"
              options={asientos.map((a) => ({
                value: a.codigo,
                label: `${a.codigo} · ${a.clase} (fila ${a.fila})`,
              }))}
            />
          ) : (
            <FormInput
              label="Asiento"
              value={asientoSel}
              onChange={(e) => setAsientoSel(e.target.value)}
              placeholder="Ej: 12A (este vuelo no tiene mapa de asientos cargado)"
              maxLength={4}
            />
          )}

          {/* Método de pago */}
          <FormSelect
            label="Método de pago"
            value={metodoId}
            onChange={(e) => setMetodoId(e.target.value)}
            placeholder="Selecciona un método de pago"
            options={metodos.map((m) => ({ value: String(m.id), label: `${m.nombre} (${m.tipo})` }))}
          />
          {metodos.length === 0 && (
            <p className="text-xs text-yellow-300">
              No hay métodos de pago activos configurados. Pídele al staff que registre uno.
            </p>
          )}
        </div>

        {/* Desglose */}
        <aside className="h-fit rounded-2xl border border-dark-border bg-dark-surface p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Desglose</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-400">Vuelo</dt>
              <dd className="text-white">{formatPrecio(precio)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">Impuestos (12%)</dt>
              <dd className="text-white">{formatPrecio(impuestos)}</dd>
            </div>
            <div className="flex justify-between border-t border-dark-border pt-2">
              <dt className="font-bold text-white">Total</dt>
              <dd className="text-lg font-black text-primary-light">{formatPrecio(total)}</dd>
            </div>
          </dl>
          <Button
            className="mt-4 w-full"
            isLoading={comprando}
            disabled={sinPasajero || metodos.length === 0}
            onClick={confirmarYPagar}
          >
            Confirmar y pagar
          </Button>
        </aside>
      </div>

      {errorCompra && (
        <p className="mt-4 rounded-lg border border-primary/40 bg-primary/10 p-4 text-sm text-primary-light animate-fade-in">
          {errorCompra}
        </p>
      )}

      {/* Progreso de los pasos (visible durante/después del intento) */}
      {pasos.some((p) => p.estado !== 'pendiente') && (
        <ol className="mt-4 space-y-2 rounded-2xl border border-dark-border bg-dark-surface p-5 animate-fade-in">
          {pasos.map((paso) => (
            <li key={paso.nombre} className="flex items-center gap-3 text-sm">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  paso.estado === 'ok'
                    ? 'bg-green-400'
                    : paso.estado === 'error'
                      ? 'bg-primary'
                      : 'bg-gray-600'
                }`}
              />
              <span className="text-gray-200">{paso.nombre}</span>
              {paso.detalle && <span className="text-xs text-gray-400">— {paso.detalle}</span>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
