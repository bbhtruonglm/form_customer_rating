import type { ChangeEvent } from 'react';

interface FormTextareaProps {
  disabled?: boolean;
  label: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  value: string;
}

export default function FormTextarea({
  disabled = false,
  label,
  name,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  value,
}: FormTextareaProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-base font-bold uppercase tracking-wide text-slate-700 sm:text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        className={`min-h-32 resize-none rounded-2xl border px-5 py-4 text-base font-medium outline-none transition-all sm:min-h-0 ${
          disabled
            ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
            : 'border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100'
        }`}
        disabled={disabled}
        name={name}
        onChange={onChange}
        placeholder={placeholder ?? `Nhập ${label.toLowerCase()}...`}
        rows={rows}
        value={value}
      />
    </div>
  );
}
