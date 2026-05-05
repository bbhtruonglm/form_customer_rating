interface ChipMultiSelectProps {
  compact?: boolean;
  disabled?: boolean;
  items: string[];
  label?: string;
  onToggle: (item: string) => void;
  selectedItems: string[];
  theme?: 'light' | 'dark';
}

export default function ChipMultiSelect({
  compact = false,
  disabled = false,
  items,
  label,
  onToggle,
  selectedItems,
  theme = 'light',
}: ChipMultiSelectProps) {
  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col ${compact ? 'gap-2' : 'gap-3'}`}>
      {label ? (
        <label
          className={`${compact ? 'text-[11px]' : 'text-xs sm:text-[10px]'} font-black uppercase ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          {label}
        </label>
      ) : null}
      <div
        className={`flex flex-wrap rounded-2xl border transition-colors ${
          compact ? 'gap-2 p-3' : 'min-h-[68px] gap-2.5 p-4 sm:min-h-[56px]'
        } ${
          isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-100 bg-slate-50'
        }`}
      >
        {items.map((item) => {
          const isSelected = selectedItems.includes(item);

          return (
            <button
              key={item}
              className={`rounded-xl font-black uppercase transition-all duration-200 ${
                compact ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-xs sm:px-4 sm:py-1.5 sm:text-[10px]'
              } ${
                isSelected
                  ? isDark
                    ? 'border border-emerald-400 bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'border border-sky-500 bg-sky-50 text-sky-700 shadow-sm shadow-sky-200/70'
                  : isDark
                    ? 'border border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
                    : 'border border-slate-200 bg-white text-slate-500 hover:border-slate-400'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={disabled}
              onClick={() => onToggle(item)}
              type="button"
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
