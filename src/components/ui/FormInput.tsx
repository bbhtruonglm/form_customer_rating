import { forwardRef } from 'react';
import type {
  ChangeEvent,
  ClipboardEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
} from 'react';

interface FormInputProps {
  disabled?: boolean;
  label: string;
  lang?: string;
  name: string;
  onClick?: (event: MouseEvent<HTMLInputElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (event: ClipboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  value: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
  {
    disabled = false,
    label,
    lang,
    name,
    onClick,
    onChange,
    onFocus,
    onKeyDown,
    onPaste,
    placeholder,
    required = false,
    type = 'text',
    value,
  },
  ref,
) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-base font-bold uppercase tracking-wide text-slate-700 sm:text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        className={`min-h-14 rounded-2xl border px-5 py-4 text-base font-medium outline-none transition-all sm:min-h-0 sm:py-3.5 sm:text-base ${
          disabled
            ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
            : 'border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100'
        }`}
        disabled={disabled}
        lang={lang}
        name={name}
        onChange={onChange}
        onClick={onClick}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        placeholder={placeholder ?? `Nhập ${label.toLowerCase()}...`}
        ref={ref}
        type={type}
        value={value}
      />
    </div>
  );
});

export default FormInput;
