import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface DateSelectProps {
  name: string;
  nameTime?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value: string;
  valueTime?: string;
  variant?: 'default' | 'staff';
}

function formatDisplayDate(value: string) {
  if (!value) {
    return '';
  }

  const [year, month, day] = value.split('-');
  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function createSyntheticEvent(name: string, value: string) {
  return {
    target: { name, value },
  } as ChangeEvent<HTMLInputElement>;
}

function parseDateValue(value: string) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isSameDate(left: Date | null, right: Date) {
  return (
    left !== null &&
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function getCalendarDays(visibleMonth: Date) {
  const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
}

export default function DateSelect({
  name,
  nameTime,
  onChange,
  placeholder = 'Chọn ngày thực hiện',
  value,
  valueTime,
  variant = 'default',
}: DateSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedDate = parseDateValue(value);
  const [visibleMonth, setVisibleMonth] = useState<Date>(selectedDate ?? new Date());

  useEffect(() => {
    if (selectedDate) {
      setVisibleMonth(selectedDate);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthLabel = visibleMonth.toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric',
  });
  const calendarDays = getCalendarDays(visibleMonth);
  const weekdayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
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
      ? 'border-slate-200 bg-white shadow-lg shadow-slate-200/80 z-20 absolute mt-1 w-[280px]'
      : 'border-sky-100 bg-white shadow-lg shadow-sky-100/70 z-20 absolute mt-1 w-full max-w-[320px]';
  const selectedDayClass = variant === 'staff' ? 'bg-slate-900 text-white' : 'bg-sky-600 text-white';

  const changeMonth = (step: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + step, 1));
  };

  const handleSelectDate = (date: Date) => {
    onChange(createSyntheticEvent(name, formatDateValue(date)));
    setVisibleMonth(date);
    // Don't auto-close if time selection is enabled
    if (!nameTime) {
      setIsOpen(false);
    }
  };

  const displayDateTime = () => {
    const fDate = formatDisplayDate(value) || placeholder;
    if (nameTime && valueTime) {
      return `${valueTime} - ${fDate}`;
    }
    return fDate;
  };

  const hasTimeSelected = Boolean(valueTime);

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      <button
        className={`flex min-h-10 w-full items-center justify-between rounded-xl border bg-white px-2.5 py-2 text-left transition-colors ${triggerClass}`}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <Calendar className="h-4 w-4 shrink-0 text-sky-500" />
          <div className="min-w-0">
            <span
              className={`block truncate text-[14px] font-semibold ${
                value ? 'text-slate-800' : 'text-slate-400'
              }`}
            >
              {displayDateTime()}
            </span>
            <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
              {value && (!nameTime || valueTime) ? 'Đã chọn thời gian' : 'Chưa chọn đủ thông tin'}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen ? (
        <div className={`rounded-2xl border p-3 ${panelClass}`}>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                onClick={() => changeMonth(-1)}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="text-sm font-black capitalize text-slate-800">{monthLabel}</p>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                onClick={() => changeMonth(1)}
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-black uppercase tracking-[0.08em] text-slate-400">
              {weekdayLabels.map((label) => (
                <div key={label} className="py-1">
                  {label}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date) => {
                const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();
                const isSelected = isSameDate(selectedDate, date);

                return (
                  <button
                    key={date.toISOString()}
                    className={`flex h-9 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                      isSelected
                        ? selectedDayClass
                        : isCurrentMonth
                          ? 'text-slate-700 hover:bg-sky-50'
                          : 'text-slate-300 hover:bg-slate-50'
                    }`}
                    onClick={() => handleSelectDate(date)}
                    type="button"
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {nameTime && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  <input
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-bold text-slate-700 outline-none transition-colors focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                    name={nameTime}
                    onChange={onChange}
                    step="900" 
                    type="time"
                    value={valueTime || ''}
                  />
                </div>
              </div>
            )}

            <div className="mt-2 flex items-center justify-end gap-2 border-t border-slate-100 pt-2">
              <button
                className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
                onClick={() => handleSelectDate(new Date())}
                type="button"
              >
                Hôm nay
              </button>
              {nameTime && (
                <button
                  className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-sky-200 transition-transform active:scale-95 hover:bg-sky-700"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  Xong
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
