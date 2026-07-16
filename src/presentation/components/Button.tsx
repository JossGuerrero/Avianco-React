import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

const estilos: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-primary-dark to-primary text-white hover:opacity-90 disabled:opacity-60',
  secondary:
    'border border-dark-border bg-dark-surface text-gray-200 hover:border-primary hover:text-white disabled:opacity-60',
  danger:
    'border border-primary/60 text-primary-light hover:bg-primary hover:text-white disabled:opacity-60',
  ghost: 'text-gray-300 hover:text-white hover:bg-dark-surface disabled:opacity-60',
};

export function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed ${estilos[variant]} ${className}`}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}
