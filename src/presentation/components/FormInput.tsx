import type { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormInput({ label, error, className = '', ...props }: FormInputProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <input
        {...props}
        className={`mt-1 w-full rounded-lg border bg-dark px-4 py-2.5 text-white outline-none transition-colors focus:border-primary ${
          error ? 'border-primary' : 'border-dark-border'
        } ${className}`}
      />
      {error && <span className="mt-1 block text-xs text-primary-light">{error}</span>}
    </label>
  );
}
