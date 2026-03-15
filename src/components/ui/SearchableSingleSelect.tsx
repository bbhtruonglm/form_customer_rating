import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

interface SearchableSingleSelectProps {
  items: string[];
  onSelect: (item: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  value: string;
  variant?: 'default' | 'staff';
}

export default function SearchableSingleSelect({
  items,
  onSelect,
  placeholder = 'Chọn nhân sự',
  searchPlaceholder = 'Tìm nhân sự...',
  value,
  variant = 'default',
}: SearchableSingleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = items.filter((item) =>
    item.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi')),
  );

  const triggerClass =
    variant === 'staff'
      ? isOpen
        ? 'border-slate-400 ring-4 ring-slate-200/70'
        : 'border-slate-300 hover:border-slate-400'
      : isOpen
        ? 'border-sky-400 ring-4 ring-sky-100'
        : 'border-slate-200 hover:border-sky-200';
  const panelClass =
    variant === 'staff'
      ? 'border-slate-200 bg-white shadow-lg shadow-slate-200/80'
      : 'border-sky-100 bg-white shadow-lg shadow-sky-100/70';
  const searchBoxClass =
    variant === 'staff'
      ? 'border-slate-200 bg-slate-100'
      : 'border-slate-200 bg-slate-50';
  const activeRowClass =
    variant === 'staff' ? 'bg-slate-900 text-white' : 'bg-sky-50 text-sky-700';
  const idleRowClass =
    variant === 'staff' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-600 hover:bg-slate-50';
  const activeCheckClass =
    variant === 'staff'
      ? 'border-slate-900 bg-slate-900 text-white'
      : 'border-sky-500 bg-sky-500 text-white';

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <button
        className={`flex min-h-10 w-full items-center justify-between rounded-xl border bg-white px-2.5 py-2 text-left transition-colors ${triggerClass}`}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <div className="min-w-0">
          <span className={`block truncate text-[14px] font-semibold ${value ? 'text-slate-800' : 'text-slate-400'}`}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen ? (
        <div className={`rounded-2xl border p-2.5 ${panelClass}`}>
          <div className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 ${searchBoxClass}`}>
            <Search className="h-4 w-4 text-slate-400" />
            <input
              className="w-full bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              value={query}
            />
            {query ? (
              <button
                className="text-slate-400 transition-colors hover:text-slate-600"
                onClick={() => setQuery('')}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <div className="mt-2.5 max-h-64 space-y-1 overflow-y-auto">
            <button
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-[13px] font-semibold transition-colors ${
                value === '' ? activeRowClass : idleRowClass
              }`}
              onClick={() => {
                onSelect('');
                setIsOpen(false);
              }}
              type="button"
            >
              <span>-- Chọn nhân viên --</span>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  value === ''
                    ? activeCheckClass
                    : 'border-slate-300 bg-white text-transparent'
                }`}
              >
                <Check className="h-3.5 w-3.5" />
              </span>
            </button>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const isSelected = value === item;

                return (
                  <button
                    key={item}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-[13px] font-semibold transition-colors ${
                      isSelected ? activeRowClass : idleRowClass
                    }`}
                    onClick={() => {
                      onSelect(item);
                      setIsOpen(false);
                    }}
                    type="button"
                  >
                    <span>{item}</span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        isSelected ? activeCheckClass : 'border-slate-300 bg-white text-transparent'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="rounded-xl bg-slate-50 px-3 py-3 text-center text-[13px] text-slate-400">
                Không tìm thấy nhân sự phù hợp.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
