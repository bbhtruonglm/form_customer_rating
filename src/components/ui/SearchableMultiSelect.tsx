import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

interface SearchableMultiSelectProps {
  items: string[];
  onToggle: (item: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  selectedItems: string[];
  variant?: 'default' | 'staff';
}

export default function SearchableMultiSelect({
  items,
  onToggle,
  placeholder = 'Chọn nhân sự',
  searchPlaceholder = 'Tìm nhân sự...',
  selectedItems,
  variant = 'default',
}: SearchableMultiSelectProps) {
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
  const badgeClass =
    variant === 'staff'
      ? 'bg-slate-100 text-slate-800'
      : 'bg-sky-50 text-sky-700';
  const selectedRowClass =
    variant === 'staff' ? 'bg-slate-900 text-white' : 'bg-sky-50 text-sky-700';
  const idleRowClass =
    variant === 'staff' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-600 hover:bg-slate-50';
  const selectedCheckClass =
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
          {selectedItems.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedItems.slice(0, 2).map((item) => (
                <span
                  key={item}
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${badgeClass}`}
                >
                  {item}
                </span>
              ))}
              {selectedItems.length > 2 ? (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                  +{selectedItems.length - 2}
                </span>
              ) : null}
            </div>
          ) : (
            <span className="text-[13px] font-medium text-slate-400">{placeholder}</span>
          )}
          <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
            {selectedItems.length === 0
              ? 'Chưa chọn nhân sự'
              : `${selectedItems.length} nhân sự đã chọn`}
          </p>
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
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const isSelected = selectedItems.includes(item);

                return (
                  <button
                    key={item}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-[13px] font-semibold transition-colors ${
                      isSelected ? selectedRowClass : idleRowClass
                    }`}
                    onClick={() => onToggle(item)}
                    type="button"
                  >
                    <span>{item}</span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        isSelected ? selectedCheckClass : 'border-slate-300 bg-white text-transparent'
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
