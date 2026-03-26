import React, { useEffect, useState } from 'react';

interface TimePickerProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

export function TimePicker({ label, value, onChange, className = '' }: TimePickerProps) {
  const roundedMinute = Math.floor(value.getMinutes() / 15) * 15;

  const [selectedDate, setSelectedDate] = useState(value);
  const [selectedHour, setSelectedHour] = useState(value.getHours());
  const [selectedMinute, setSelectedMinute] = useState(roundedMinute);

  useEffect(() => {
    const newRoundedMinute = Math.floor(value.getMinutes() / 15) * 15;
    setSelectedDate(value);
    setSelectedHour(value.getHours());
    setSelectedMinute(newRoundedMinute);

    // If the value's minutes weren't rounded, trigger onChange with rounded value
    if (value.getMinutes() !== newRoundedMinute) {
      const roundedDate = new Date(value);
      roundedDate.setMinutes(newRoundedMinute);
      roundedDate.setSeconds(0);
      roundedDate.setMilliseconds(0);
      onChange(roundedDate);
    }
  }, [value, onChange]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    newDate.setHours(selectedHour);
    newDate.setMinutes(selectedMinute);
    setSelectedDate(newDate);
    onChange(newDate);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hour = parseInt(e.target.value);
    const newDate = new Date(selectedDate);
    newDate.setHours(hour);
    newDate.setMinutes(selectedMinute);
    setSelectedHour(hour);
    onChange(newDate);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const minute = parseInt(e.target.value);
    const newDate = new Date(selectedDate);
    newDate.setHours(selectedHour);
    newDate.setMinutes(minute);
    setSelectedMinute(minute);
    onChange(newDate);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className='block text-sm font-medium text-black dark:text-zinc-300'>{label}</label>

      <div className='flex gap-2'>
        {/* Date picker */}
        <input
          type='date'
          value={formatDate(selectedDate)}
          onChange={handleDateChange}
          className='flex-1 bg-white hover:bg-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-black dark:text-zinc-200 rounded-md border border-zinc-600 px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent'
        />

        {/* Hour picker */}
        <select
          value={selectedHour}
          onChange={handleHourChange}
          className='w-20 bg-white hover:bg-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-black dark:text-zinc-200 rounded-md border border-zinc-600 px-2 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
        >
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {String(hour).padStart(2, '0')}
            </option>
          ))}
        </select>

        <span className='flex items-center text-black dark:text-zinc-300 font-bold'>:</span>

        {/* Minute picker */}
        <select
          value={selectedMinute}
          onChange={handleMinuteChange}
          className='w-20 bg-white hover:bg-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-black dark:text-zinc-200 rounded-md border border-zinc-600 px-2 py-2 focus:ring-2 focus:ring-primary focus:border-transparent'
        >
          {minutes.map((minute) => (
            <option key={minute} value={minute}>
              {String(minute).padStart(2, '0')}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
