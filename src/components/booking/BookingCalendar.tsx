'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n/translations';

interface BookingCalendarProps {
  bookedRanges?: { start: string; end: string }[];
  selectedStart: string;
  selectedEnd: string;
  onSelectStart: (date: string) => void;
  onSelectEnd: (date: string) => void;
}

function toDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function BookingCalendar({
  bookedRanges = [],
  selectedStart,
  selectedEnd,
  onSelectStart,
  onSelectEnd,
}: BookingCalendarProps) {
  const { lang } = useLanguage();
  const tx = translations[lang];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  function isBooked(dateStr: string): boolean {
    return bookedRanges.some((r) => dateStr >= r.start && dateStr <= r.end);
  }

  function isInSelectedRange(dateStr: string): boolean {
    if (!selectedStart || !selectedEnd) return false;
    return dateStr > selectedStart && dateStr < selectedEnd;
  }

  function handleDayClick(dateStr: string) {
    if (isBooked(dateStr)) return;
    if (!selectedStart || (selectedStart && selectedEnd)) {
      onSelectStart(dateStr);
      onSelectEnd('');
    } else {
      if (dateStr < selectedStart) {
        onSelectEnd(selectedStart);
        onSelectStart(dateStr);
      } else {
        onSelectEnd(dateStr);
      }
    }
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const days: (string | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(viewYear, viewMonth, i + 1);
      return toDateStr(d);
    }),
  ];

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleString(
    lang === 'ru' ? 'ru-RU' : lang === 'az' ? 'az-Latn-AZ' : 'en-US',
    { month: 'long' }
  );

  return (
    <div className="border border-gray-200 rounded-2xl p-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} aria-label={tx.calendarPrevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="font-semibold text-gray-900">{monthLabel} {viewYear}</span>
        <button onClick={nextMonth} aria-label={tx.calendarNextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 mb-1">
        {[tx.weekdaySun, tx.weekdayMon, tx.weekdayTue, tx.weekdayWed, tx.weekdayThu, tx.weekdayFri, tx.weekdaySat].map((d) => (
          <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((dateStr, i) => {
          if (!dateStr) return <div key={`empty-${i}`} />;
          const isPast = dateStr < toDateStr(today);
          const booked = isBooked(dateStr);
          const isStart = dateStr === selectedStart;
          const isEnd = dateStr === selectedEnd;
          const inRange = isInSelectedRange(dateStr);
          const disabled = isPast || booked;

          return (
            <button
              key={dateStr}
              disabled={disabled}
              onClick={() => handleDayClick(dateStr)}
              aria-label={dateStr}
              className={`
                relative h-9 w-full rounded-lg text-sm font-medium transition-all
                ${disabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-green-50'}
                ${booked ? 'line-through' : ''}
                ${isStart || isEnd ? 'bg-green-600 text-white hover:bg-green-700' : ''}
                ${inRange ? 'bg-green-100 text-green-800 rounded-none' : ''}
                ${!isStart && !isEnd && !inRange && !disabled ? 'text-gray-900' : ''}
              `}
            >
              {parseInt(dateStr.split('-')[2])}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-600 inline-block" /> {tx.calendarSelected}</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200 inline-block" /> {tx.calendarUnavailable}</span>
      </div>
    </div>
  );
}
