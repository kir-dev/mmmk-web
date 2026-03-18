import { useState } from 'react';

import { Comment } from '@/types/comment';
import { Reservation } from '@/types/reservation';

import DailyViewWO from '../day/daily-view-without-date';

interface DWViewProps {
  reservations: Reservation[];
  comments: Comment[];
  onEventClick: (id: number) => void;
  onCommentClick: (id: number) => void;
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
    <div className='w-full h-full p-2 md:p-4'>
      <div className='bg-background shadow-xl rounded-2xl border border-border overflow-hidden text-foreground w-full h-full flex flex-col'>
        {/* Header with month/year and navigation */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-border bg-card'>
          <button
            onClick={handlePreviousWeek}
            className='p-2 rounded-full hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-200 text-muted-foreground hover:text-foreground'
          >
            <ChevronLeftIcon className='w-5 h-5' />
          </button>

          <div className='flex flex-col items-center'>
            <div className='text-xl flex items-baseline gap-2 font-bold text-foreground tracking-tight'>
              <span className='text-muted-foreground font-medium text-lg'>{props.currentDate.getFullYear()}.</span>
              {props.currentDate.toLocaleString('hu', { month: 'long' })}
            </div>
            <div className='text-xs font-medium text-muted-foreground mt-1 bg-muted px-2 py-0.5 rounded-full'>
              {Math.ceil((props.currentDate.getDate() + firstDayOfWeek.getDay()) / 7)}. hét
            </div>
          </div>

          <button
            onClick={handleNextWeek}
            className='p-2 rounded-full hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-200 text-muted-foreground hover:text-foreground'
          >
            <ChevronRightIcon className='w-5 h-5' />
          </button>
        </div>

        <div
          className='grid grid-cols-8 w-full flex-grow'
          style={{ gridTemplateColumns: '80px repeat(7, 1fr)', gridTemplateRows: 'max-content 1fr' }}
        >
          {/* Empty cell above time column */}
          <div className='flex items-center justify-center h-[72px] border-b border-r border-border bg-muted/10' />

          {/* Day headers */}
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === new Date().toDateString();
            const isWeekend = i === 5 || i === 6;

            return (
              <div
                key={`day-header-${day.getTime()}`}
                className={`
              flex flex-col items-center justify-center h-[72px]
              border-b border-border border-r last:border-r-0
              ${isWeekend ? 'bg-muted/20' : 'bg-transparent'}
            `}
              >
                <span
                  className={`text-xs font-semibold mb-1 uppercase tracking-wider ${isToday ? 'text-primary' : ''} ${!isToday && isWeekend ? 'text-muted-foreground' : ''} ${!isToday && !isWeekend ? 'text-foreground/70' : ''}`}
                >
                  {['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'][i]}
                </span>
                <span
                  className={`
              flex items-center justify-center
              ${isToday ? 'bg-primary text-primary-foreground w-8 h-8 rounded-full font-bold shadow-md' : 'text-lg font-medium text-foreground'}
            `}
                >
                  {day.getDate()}
                </span>
              </div>
            );
          })}

          {/* Time column */}
          <div className='border-r border-border bg-muted/5'>
            {Array.from({ length: 48 }, (_, i) => (
              <div key={`time-${i}`} className='flex justify-center items-start h-10 border-b border-border/40'>
                {i % 2 === 0 ? <span className='text-xs font-medium text-muted-foreground mt-1'>{i / 2}:00</span> : ''}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, index) => (
            <div
              key={`day-column-${day.getTime()}`}
              className={`border-r last:border-r-0 border-border/40 ${index === 5 || index === 6 ? 'bg-muted/10' : ''}`}
            >
              <DailyViewWO
                currentDate={day}
                setCurrentDate={props.setCurrentDate}
                reservations={props.reservations}
                comments={props.comments}
                onEventClick={props.onEventClick}
                onCommentClick={props.onCommentClick}
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
