import DayComment from '@components/calendar/day/day-comment';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import ActualReservationForTheDay from '@/hooks/check-actuality-day';
import { Comment } from '@/types/comment';
import { Reservation } from '@/types/reservation';

import DayReservation from './day-reservation';

interface DailyViewProps {
  reservations: Reservation[];
  comments: Comment[];
  currentDate: Date;
  onEventClick: (id: number) => void;
  setCurrentDate: (date: Date) => void;
}

export default function DailyView(props: DailyViewProps) {
  const handlePreviousDay = () => {
    props.setCurrentDate(
      new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), props.currentDate.getDate() - 1)
    );
  };
  const handleNextDay = () => {
    props.setCurrentDate(
      new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), props.currentDate.getDate() + 1)
    );
  };

  const offset = (new Date().getHours() + new Date().getMinutes() / 60) * 40 * 2;
  return (
    <div className='flex items-center justify-center bg-transparent'>
      <div className='flex flex-col items-center justify-center bg-calendarBg rounded-lg text-white w-[1000px]'>
        <div className='flex items-center justify-center text-primary-foreground p-4 rounded-t-lg'>
          <button
            onClick={handlePreviousDay}
            className='p-2 rounded-full hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground text-slate-800 dark:text-white'
          >
            <ChevronLeftIcon className='w-5 h-5' />
          </button>
          <div className='flex text-lg font-medium dark:text-white text-slate-800 dark:text-white'>
            {props.currentDate.getDate()} {props.currentDate.toLocaleString('hu', { month: 'long' })}{' '}
            {props.currentDate.getFullYear()}{' '}
          </div>
          <button
            onClick={handleNextDay}
            className='p-2 rounded-full hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground text-slate-800 dark:text-white'
          >
            <ChevronRightIcon className='w-5 h-5' />
          </button>
        </div>
        <div className='flex items-center justify-center'>
          <div className='shadow-lg w-[850px] relative'>
            <div
              className='absolute w-full h-1 self-start border-t border-red-600'
              style={{
                top: `${offset}px`,
              }}
            />
            {Array.from({ length: 48 }, (_, i) => (
              <div key={i} className='flex flex-row w-full'>
                <div
                  key={i}
                  className='focus:outline-none focus-visible:ring-2 h-10 focus-visible:ring-primary text-slate-800 dark:text-white border-b w-1/6 p-2 dark:border-white'
                >
                  {i % 2 === 0 ? (
                    <div className='flex flex-col'>
                      <span className='self-start text-sm '>{i / 2}:00</span>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div
                  key={i}
                  className='relative focus:outline-none focus-visible:ring-2 h-10 focus-visible:ring-primary text-slate-800 dark:text-white border-b  p-2 w-full border-l dark:border-white'
                >
                  {props.reservations.map((event) => {
                    const eventStartDate = new Date(event.startTime);
                    const eventEndDate = new Date(event.endTime);
                    if (ActualReservationForTheDay(eventStartDate, eventEndDate, props.currentDate, event, i)) {
                      return <DayReservation key={event.id} reservation={event} onEventClick={props.onEventClick} />;
                    }
                  })}
                  {props.comments.map((event) => {
                    const eventStartDate = new Date(event.startTime);
                    const eventEndDate = new Date(event.endTime);
                    if (ActualReservationForTheDay(eventStartDate, eventEndDate, props.currentDate, event, i)) {
                      return <DayComment key={event.id} comment={event} onEventClick={props.onEventClick} />;
                    }
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
