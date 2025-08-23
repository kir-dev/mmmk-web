import { useState } from 'react';

import { Comment } from '@/types/comment';
import { Reservation } from '@/types/reservation';

import DailyViewWO from '../day/daily-view-without-date';

interface DWViewProps {
  reservations: Reservation[];
  comments: Comment[];
  onEventClick: (id: number) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export default function DWView(props: DWViewProps) {
  const dayOfWeek = new Date(
    props.currentDate.getFullYear(),
    props.currentDate.getMonth(),
    props.currentDate.getDate()
  ).getDay();
  // Convert 0 (Sunday) to 7 for easier calculations
  const adjustedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

  const [firstDayOfWeek, setFirstDayOfWeek] = useState(
    new Date(
      props.currentDate.getFullYear(),
      props.currentDate.getMonth(),
      props.currentDate.getDate() - (adjustedDayOfWeek - 1)
    )
  );

  const handlePreviousWeek = () => {
    const newDate = new Date(
      props.currentDate.getFullYear(),
      props.currentDate.getMonth(),
      props.currentDate.getDate() - 7
    );
    props.setCurrentDate(newDate);
    setFirstDayOfWeek(
      new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate() - (newDate.getDay() === 0 ? 6 : newDate.getDay() - 1)
      )
    );
  };

  const handleNextWeek = () => {
    const newDate = new Date(
      props.currentDate.getFullYear(),
      props.currentDate.getMonth(),
      props.currentDate.getDate() + 7
    );
    props.setCurrentDate(newDate);
    setFirstDayOfWeek(
      new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate() - (newDate.getDay() === 0 ? 6 : newDate.getDay() - 1)
      )
    );
  };

  // const daysInMonth = new Date(props.currentDate.getFullYear(), props.currentDate.getMonth() + 1, 0).getDate();
  // const daysInLastMonth = new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), 0).getDate();

  // Calculate days of the week
  const getDays = () => {
    const days = [];
    // Start from Monday (1) of the current week
    const firstDay = new Date(firstDayOfWeek);

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(firstDay);
      currentDay.setDate(firstDay.getDate() + i);
      days.push(currentDay);
    }
    return days;
  };

  const weekDays = getDays();

  return (
    <div className='w-full h-full'>
      <div className='bg-background shadow-lg bg-calendarBg bg-opacity-80 text-white w-full h-full'>
        {/* Header with month/year and navigation */}
        <div className='flex items-center justify-between px-4 py-3 border-b border-slate-300/20 bg-gradient-to-r from-slate-100/90 to-slate-200/90 dark:from-slate-800/90 dark:to-slate-700/90'>
          <button
            onClick={handlePreviousWeek}
            className='p-2 rounded-full hover:bg-white/30 dark:hover:bg-slate-600/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-200 text-slate-700 dark:text-slate-200'
          >
            <ChevronLeftIcon className='w-5 h-5' />
          </button>

          <div className='flex flex-col items-center'>
            <div className='text-xl font-semibold text-slate-800 dark:text-white tracking-wide'>
              {props.currentDate.toLocaleString('hu', { month: 'long' })} {props.currentDate.getFullYear()}
            </div>
            <div className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
              Week {Math.ceil((props.currentDate.getDate() + firstDayOfWeek.getDay()) / 7)}
            </div>
          </div>

          <button
            onClick={handleNextWeek}
            className='p-2 rounded-full hover:bg-white/30 dark:hover:bg-slate-600/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-200 text-slate-700 dark:text-slate-200'
          >
            <ChevronRightIcon className='w-5 h-5' />
          </button>
        </div>

        <div
          className='grid grid-cols-8 w-full h-[calc(100%-60px)]'
          style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}
        >
          {/* Empty cell above time column */}
          <div className='flex items-center justify-center h-16 font-medium text-muted-foreground border-b border-slate-300/30 bg-slate-50 dark:bg-slate-800/40' />

          {/* Day headers */}
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === new Date().toDateString();
            const isWeekend = i === 5 || i === 6;

            return (
              <div
                key={`day-header-${day.getTime()}`}
                className={`
              flex flex-col items-center justify-center h-16 
              border-b border-l border-slate-300/30
              ${isWeekend ? 'bg-slate-100 dark:bg-slate-800/30' : 'bg-slate-50 dark:bg-slate-800/20'}
              ${isToday ? 'ring-2 ring-inset ring-primary/40 dark:ring-primary/30' : ''}
            `}
              >
                <span
                  className={`text-xs font-medium mb-1 ${isWeekend ? 'text-slate-500' : 'text-slate-400'} dark:text-slate-500`}
                >
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
                <span
                  className={`
              flex items-center justify-center 
              ${isToday ? 'bg-primary text-white w-7 h-7 rounded-full font-semibold' : 'font-medium text-slate-700 dark:text-slate-300'}
            `}
                >
                  {day.getDate()}
                </span>
              </div>
            );
          })}

          {/* Time column */}
          <div className='border-r border-slate-300/30'>
            {Array.from({ length: 48 }, (_, i) => (
              <div
                key={`time-${i}`}
                className={`cursor-pointer focus:outline-none focus-visible:ring-2 h-10 focus-visible:ring-primary text-slate-800 dark:text-white border-b border-slate-300/30 ${
                  i % 2 === 0 ? '' : 'bg-slate-800/5'
                }`}
              >
                {i % 2 === 0 ? (
                  <div className='flex flex-col pl-2'>
                    <span className='self-start text-sm'>{i / 2}:00</span>
                  </div>
                ) : (
                  ''
                )}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, index) => (
            <div
              key={`day-column-${day.getTime()}`}
              className={`border-r border-slate-300/30 ${index === 5 || index === 6 ? 'bg-slate-800/10' : ''}`}
            >
              <DailyViewWO
                currentDate={day}
                setCurrentDate={props.setCurrentDate}
                reservations={props.reservations}
                comments={props.comments}
                onEventClick={props.onEventClick}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m15 18-6-6 6-6' />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m9 18 6-6-6-6' />
    </svg>
  );
}
