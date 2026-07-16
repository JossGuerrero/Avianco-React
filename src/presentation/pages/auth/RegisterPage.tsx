import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Spinner } from '../../components/Spinner';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [formError, setFormError] = useState<string | null>(null);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formError || error) {
      setFormError(null);
      clearError();
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      setFormError('Todos los campos son obligatorios');
      return;
    }
    const ok = await register({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
    });
    if (ok) navigate('/dashboard', { replace: true });
  }

  const mensajeError = formError ?? error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-dark via-dark to-primary-dark px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 block text-center text-3xl font-black text-white">
          <span className="text-primary">AVIAN</span>CO
        </Link>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-dark-border bg-dark-surface/90 p-8 shadow-2xl backdrop-blur"
        >
          <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>
          <p className="mt-1 text-sm text-gray-400">Únete a Avianco y reserva tus vuelos</p>

          <label className="mt-6 block">
            <span className="text-sm font-medium text-gray-300">Usuario</span>
            <input
              type="text"
              value={form.username}
              onChange={(e) => updateField('username', e.target.value)}
              autoComplete="username"
              className="mt-1 w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-white outline-none transition-colors focus:border-primary"
              placeholder="tu_usuario"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-gray-300">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-white outline-none transition-colors focus:border-primary"
              placeholder="correo@ejemplo.com"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-gray-300">Contraseña</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-white outline-none transition-colors focus:border-primary"
              placeholder="Mínimo 6 caracteres"
            />
          </label>

          {mensajeError && (
            <p className="mt-4 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary-light">
              {mensajeError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-dark to-primary py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? <Spinner /> : 'Crear cuenta'}
          </button>

          <p className="mt-6 text-center text-sm text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-primary-light hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
