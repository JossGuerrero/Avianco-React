import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import type { Factura } from '../../../domain/entities/Factura';
import type { Reserva } from '../../../domain/entities/Reserva';
import type { Pasajero } from '../../../domain/entities/Pasajero';
import { EstadoFactura } from '../../../domain/enums/EstadoFactura';
import { useCaseFactory } from '../../../infrastructure/factories/repository.factory';
import { useAuthStore } from '../../store/authStore';
import { DataTable, type Column } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { formatPrecio, getErrorMessage } from '../../utils/formatters';

interface FacturaForm {
  reserva: string;
  total: string;
  impuestos: string;
  estado: EstadoFactura;
}

const FORM_VACIO: FacturaForm = {
  reserva: '',
  total: '',
  impuestos: '',
  estado: EstadoFactura.Pendiente,
};

export function FacturasPage() {
  const { user, isStaff } = useAuthStore();

  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Factura | null>(null);
  const [form, setForm] = useState<FacturaForm>(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [facturasData, reservasData, pasajerosData] = await Promise.all([
        useCaseFactory.facturas.getAll(),
        useCaseFactory.reservas.getAll(),
        useCaseFactory.pasajeros.getAll(),
      ]);
      setFacturas(facturasData);
      setReservas(reservasData);
      setPasajeros(pasajerosData);
    } catch (e) {
      setError(getErrorMessage(e, 'No se pudieron cargar las facturas'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Reservas del usuario actual (para filtrar facturas propias si no es staff)
  const misReservaIds = useMemo(() => {
    if (isStaff) return null;
    const misPasajeros = new Set(
      pasajeros.filter((p) => p.usuario === user?.id).map((p) => p.id),
    );
    return new Set(reservas.filter((r) => misPasajeros.has(r.pasajero)).map((r) => r.id));
  }, [isStaff, pasajeros, reservas, user]);

  const facturasVisibles = useMemo(
    () => (misReservaIds ? facturas.filter((f) => misReservaIds.has(f.reserva)) : facturas),
    [facturas, misReservaIds],
  );

  function abrirCrear() {
    setEditando(null);
    setForm(FORM_VACIO);
    setFormError(null);
    setModalAbierto(true);
  }

  function abrirEditar(factura: Factura) {
    setEditando(factura);
    setForm({
      reserva: String(factura.reserva),
      total: String(factura.total),
      impuestos: String(factura.impuestos),
      estado: factura.estado,
    });
    setFormError(null);
    setModalAbierto(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const total = Number(form.total);
    const impuestos = Number(form.impuestos);
    if (!form.reserva || Number.isNaN(total) || total <= 0 || Number.isNaN(impuestos)) {
      setFormError('Reserva, total e impuestos válidos son obligatorios');
      return;
    }
    setGuardando(true);
    setFormError(null);
    try {
      const input = { reserva: Number(form.reserva), total, impuestos, estado: form.estado };
      if (editando) {
        await useCaseFactory.facturas.update(editando.id, input);
      } else {
        await useCaseFactory.facturas.create(input);
      }
      setModalAbierto(false);
      await cargar();
    } catch (e) {
      setFormError(getErrorMessage(e, 'No se pudo guardar la factura'));
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(factura: Factura) {
    if (!window.confirm(`¿Eliminar la factura #${factura.id}?`)) return;
    try {
      await useCaseFactory.facturas.remove(factura.id);
      await cargar();
    } catch (e) {
      setError(getErrorMessage(e, 'No se pudo eliminar la factura'));
    }
  }

  const columnas: Column<Factura>[] = [
    { header: 'ID', render: (f) => <span className="text-gray-400">#{f.id}</span> },
    { header: 'Reserva', render: (f) => `Reserva #${f.reserva}` },
    { header: 'Total', render: (f) => <span className="font-semibold">{formatPrecio(f.total)}</span> },
    { header: 'Impuestos', render: (f) => formatPrecio(f.impuestos) },
    { header: 'Estado', render: (f) => <Badge estado={f.estado} /> },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-black">
          {isStaff ? '' : 'Mis '}
          <span className="text-primary">Facturas</span>
        </h1>
        {isStaff && <Button onClick={abrirCrear}>+ Nueva factura</Button>}
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-primary/40 bg-primary/10 p-4 text-sm text-primary-light">
          {error}
        </p>
      )}

      <div className="mt-6">
        <DataTable
          columns={columnas}
          data={facturasVisibles}
          getRowId={(f) => f.id}
          loading={loading}
          emptyMessage="No hay facturas registradas"
          actions={
            isStaff
              ? (factura) => (
                  <>
                    <Button variant="secondary" onClick={() => abrirEditar(factura)}>
                      Editar
                    </Button>
                    <Button variant="danger" onClick={() => eliminar(factura)}>
                      Eliminar
                    </Button>
                  </>
                )
              : undefined
          }
        />
      </div>

      <Modal
        open={modalAbierto}
        title={editando ? `Editar factura #${editando.id}` : 'Nueva factura'}
        onClose={() => setModalAbierto(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormSelect
            label="Reserva"
            value={form.reserva}
            onChange={(e) => setForm((f) => ({ ...f, reserva: e.target.value }))}
            placeholder="Selecciona una reserva"
            options={reservas.map((r) => ({
              value: String(r.id),
              label: `Reserva #${r.id} · asiento ${r.asiento} (${r.estado})`,
            }))}
          />
          <FormInput
            label="Total"
            type="number"
            min={0}
            step="0.01"
            value={form.total}
            onChange={(e) => setForm((f) => ({ ...f, total: e.target.value }))}
            placeholder="Ej: 250.00"
          />
          <FormInput
            label="Impuestos"
            type="number"
            min={0}
            step="0.01"
            value={form.impuestos}
            onChange={(e) => setForm((f) => ({ ...f, impuestos: e.target.value }))}
            placeholder="Ej: 47.50"
          />
          <FormSelect
            label="Estado"
            value={form.estado}
            onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value as EstadoFactura }))}
            options={Object.values(EstadoFactura).map((estado) => ({
              value: estado,
              label: estado,
            }))}
          />

          {formError && (
            <p className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary-light">
              {formError}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setModalAbierto(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={guardando}>
              {editando ? 'Guardar cambios' : 'Crear factura'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
