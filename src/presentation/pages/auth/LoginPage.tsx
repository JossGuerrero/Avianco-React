import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Spinner } from '../../components/Spinner';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    if (!username.trim() || !password.trim()) {
      setFormError('Ingresa tu usuario y contraseña');
      return;
    }
    const ok = await login(username.trim(), password);
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
          <h1 className="text-2xl font-bold text-white">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-gray-400">Bienvenido de vuelta a Avianco</p>

          <label className="mt-6 block">
            <span className="text-sm font-medium text-gray-300">Usuario</span>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (mensajeError) {
                  setFormError(null);
                  clearError();
                }
              }}
              autoComplete="username"
              className="mt-1 w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-white outline-none transition-colors focus:border-primary"
              placeholder="tu_usuario"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-gray-300">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (mensajeError) {
                  setFormError(null);
                  clearError();
                }
              }}
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-white outline-none transition-colors focus:border-primary"
              placeholder="••••••••"
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
            {isLoading ? <Spinner /> : 'Entrar'}
          </button>

          <p className="mt-6 text-center text-sm text-gray-400">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-semibold text-primary-light hover:underline">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
