import { useCallback, useEffect, useState, type FormEvent } from 'react';
import type { Tripulante } from '../../../domain/entities/Tripulante';
import { RolTripulacion } from '../../../domain/enums/RolTripulacion';
import { useCaseFactory } from '../../../infrastructure/factories/repository.factory';
import { DataTable, type Column } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { FormInput } from '../../components/FormInput';
import { FormSelect } from '../../components/FormSelect';
import { getErrorMessage } from '../../utils/formatters';

interface TripulanteForm {
  nombre: string;
  apellido: string;
  rol: RolTripulacion;
  licencia: string;
  activo: boolean;
}

const FORM_VACIO: TripulanteForm = {
  nombre: '',
  apellido: '',
  rol: RolTripulacion.Piloto,
  licencia: '',
  activo: true,
};

export function TripulacionPage() {
  const [tripulantes, setTripulantes] = useState<Tripulante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Tripulante | null>(null);
  const [form, setForm] = useState<TripulanteForm>(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTripulantes(await useCaseFactory.tripulacion.getAll());
    } catch (e) {
      setError(getErrorMessage(e, 'No se pudo cargar la tripulación'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  function abrirCrear() {
    setEditando(null);
    setForm(FORM_VACIO);
    setFormError(null);
    setModalAbierto(true);
  }

  function abrirEditar(tripulante: Tripulante) {
    setEditando(tripulante);
    setForm({
      nombre: tripulante.nombre,
      apellido: tripulante.apellido,
      rol: tripulante.rol,
      licencia: tripulante.licencia,
      activo: tripulante.activo,
    });
    setFormError(null);
    setModalAbierto(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.nombre.trim() || !form.apellido.trim() || !form.licencia.trim()) {
      setFormError('Nombre, apellido y licencia son obligatorios');
      return;
    }
    setGuardando(true);
    setFormError(null);
    try {
      const input = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        rol: form.rol,
        licencia: form.licencia.trim(),
        activo: form.activo,
      };
      if (editando) {
        await useCaseFactory.tripulacion.update(editando.id, input);
      } else {
        await useCaseFactory.tripulacion.create(input);
      }
      setModalAbierto(false);
      await cargar();
    } catch (e) {
      setFormError(getErrorMessage(e, 'No se pudo guardar el tripulante'));
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(tripulante: Tripulante) {
    if (!window.confirm(`¿Eliminar a ${tripulante.nombre} ${tripulante.apellido}?`)) return;
    try {
      await useCaseFactory.tripulacion.remove(tripulante.id);
      await cargar();
    } catch (e) {
      setError(getErrorMessage(e, 'No se pudo eliminar el tripulante'));
    }
  }

  const columnas: Column<Tripulante>[] = [
    { header: 'Nombre', render: (t) => `${t.nombre} ${t.apellido}` },
    { header: 'Rol', render: (t) => <span className="capitalize">{t.rol}</span> },
    { header: 'Licencia', render: (t) => <span className="font-mono">{t.licencia}</span> },
    { header: 'Estado', render: (t) => <Badge estado={t.activo ? 'activo' : 'inactivo'} /> },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-black">
          <span className="text-primary">Tripulación</span>
        </h1>
        <Button onClick={abrirCrear}>+ Nuevo tripulante</Button>
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-primary/40 bg-primary/10 p-4 text-sm text-primary-light">
          {error}
        </p>
      )}

      <div className="mt-6">
        <DataTable
          columns={columnas}
          data={tripulantes}
          getRowId={(t) => t.id}
          loading={loading}
          emptyMessage="No hay tripulantes registrados"
          actions={(tripulante) => (
            <>
              <Button variant="secondary" onClick={() => abrirEditar(tripulante)}>
                Editar
              </Button>
              <Button variant="danger" onClick={() => eliminar(tripulante)}>
                Eliminar
              </Button>
            </>
          )}
        />
      </div>

      <Modal
        open={modalAbierto}
        title={editando ? `Editar tripulante #${editando.id}` : 'Nuevo tripulante'}
        onClose={() => setModalAbierto(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormInput
            label="Nombre"
            value={form.nombre}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
          />
          <FormInput
            label="Apellido"
            value={form.apellido}
            onChange={(e) => setForm((f) => ({ ...f, apellido: e.target.value }))}
          />
          <FormSelect
            label="Rol"
            value={form.rol}
            onChange={(e) => setForm((f) => ({ ...f, rol: e.target.value as RolTripulacion }))}
            options={Object.values(RolTripulacion).map((rol) => ({ value: rol, label: rol }))}
          />
          <FormInput
            label="Licencia"
            value={form.licencia}
            onChange={(e) => setForm((f) => ({ ...f, licencia: e.target.value }))}
            placeholder="Ej: LIC-00123"
          />
          <label className="flex items-center gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm((f) => ({ ...f, activo: e.target.checked }))}
              className="h-4 w-4 accent-primary"
            />
            Activo
          </label>

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
              {editando ? 'Guardar cambios' : 'Crear tripulante'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
