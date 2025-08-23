import MonthEvent from '@components/calendar/month/month-event';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { Comment } from '@/types/comment';
import { Reservation } from '@/types/reservation';

interface MonthlyViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  reservations: Reservation[];
  onEventClick: (id: number) => void;
  comments: Comment[];
}

export default function MonthlyView(props: MonthlyViewProps) {
  const daysInMonth = new Date(props.currentDate.getFullYear(), props.currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), 0).getDay();
  const lastDayOfMonth = 7 - new Date(props.currentDate.getFullYear(), props.currentDate.getMonth() + 1, 0).getDay();
  const daysInLastMonth = new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), 0).getDate();
  const today = new Date();

  const handlePreviousMonth = () => {
    props.setCurrentDate(new Date(props.currentDate.getFullYear(), props.currentDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    props.setCurrentDate(new Date(props.currentDate.getFullYear(), props.currentDate.getMonth() + 1, 1));
  };

  return (
    <div className='flex items-center justify-center scroll-auto'>
      <div className='rounded-lg shadow-lg w-[1000px] bg-calendarBg bg-opacity-80'>
        <div className='flex items-center justify-between text-primary-foreground p-4 rounded-t-lg'>
          <button
            onClick={handlePreviousMonth}
            className='p-2 rounded-full text-slate-800 dark:text-white hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground'
          >
            <ChevronLeftIcon className='w-5 h-5' />
          </button>
          <div className='text-lg font-medium text-slate-800 dark:text-white'>
            {props.currentDate.toLocaleString('hu', { month: 'long' })} {props.currentDate.getFullYear()}{' '}
          </div>
          <button
            onClick={handleNextMonth}
            className='p-2 rounded-full text-slate-800 dark:text-white hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground'
          >
            <ChevronRightIcon className='w-5 h-5' />
          </button>
        </div>
        <div className='grid grid-cols-7 p-2'>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div
              key={day}
              className='flex items-center justify-center h-16 font-medium text-muted-foreground border dark:text-white'
            >
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }, (_, i) => i).map((_) => (
            <div key={_} className='flex flex-col h-20 border p-2'>
              <span className='self-end text-gray-400 dark:text-gray-500'>
                {daysInLastMonth - firstDayOfMonth + _ + 1}
              </span>
            </div>
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
            <div
              key={day}
              className={`h-20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary border p-2 text-inherit ${
                today.getDate() === day &&
                today.getMonth() === props.currentDate.getMonth() &&
                today.getFullYear() === props.currentDate.getFullYear()
                  ? 'text-primary-foreground font-medium font-bold font-lg'
                  : ''
              }`}
            >
              <div className='flex flex-col'>
                <span className='self-end text-slate-800 dark:text-white'>{day}</span>
                <div className='flex flex-col items-center self-start'>
                  <div className='bg-transparent text-secondary-foreground rounded-md text-xs overflow-auto scrollbar-webkit max-h-12 max-w-28'>
                    <MonthEvent
                      events={props.reservations}
                      currentDate={props.currentDate}
                      onEventClick={props.onEventClick}
                      day={day}
                    />
                    <MonthEvent
                      events={props.comments}
                      currentDate={props.currentDate}
                      onEventClick={props.onEventClick}
                      day={day}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {Array.from({ length: lastDayOfMonth }, (_, i) => i).map((_) => (
            <div key={_} className='flex flex-col h-20 border p-2'>
              <span className='self-end text-gray-400 dark:text-gray-500'>{_ + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
