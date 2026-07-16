import type { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export function FormSelect({
  label,
  options,
  placeholder,
  error,
  className = '',
  ...props
}: FormSelectProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <select
        {...props}
        className={`mt-1 w-full rounded-lg border bg-dark px-4 py-2.5 text-white outline-none transition-colors focus:border-primary ${
          error ? 'border-primary' : 'border-dark-border'
        } ${className}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-xs text-primary-light">{error}</span>}
    </label>
  );
}
