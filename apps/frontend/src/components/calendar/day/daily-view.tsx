/* eslint-disable no-negated-condition */
import DayComment from '@components/calendar/day/day-comment';
import Line from '@components/calendar/Line';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import ActualReservationForTheDay from '@/hooks/check-actuality-day';
import { Comment } from '@/types/comment';
import { OpenedWeek } from '@/types/openedWeek';
import { Reservation } from '@/types/reservation';

import { getFirstDayOfWeek } from '../isReservationOvertime';
import DayReservation from './day-reservation';

interface DailyViewProps {
  reservations: Reservation[];
  comments: Comment[];
  openedWeeks: OpenedWeek[];
  currentDate: Date;
  onEventClick: (id: number) => void;
  onCommentClick: (id: number) => void;
  setCurrentDate: (date: Date) => void;
}

export default function DailyView(props: DailyViewProps) {
  const handlePreviousDay = () => {
    props.setCurrentDate(
      new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), props.currentDate.getDate() - 1)
    );
  };

  const isNextDayOpen = () => {
    const nextDay = new Date(
      props.currentDate.getFullYear(),
      props.currentDate.getMonth(),
      props.currentDate.getDate() + 1
    );
    const nextDayMonday = getFirstDayOfWeek(nextDay);

    // If the next day is in the past or today, we consider it "open" for viewing purposes
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (nextDay.getTime() <= today.getTime()) return true;

    return props.openedWeeks.some((w) => {
      const wDate = new Date(w.monday);
      return wDate.getTime() === nextDayMonday.getTime() && w.isOpen;
    });
  };

  const handleNextDay = () => {
    if (!isNextDayOpen()) return;
    props.setCurrentDate(
      new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), props.currentDate.getDate() + 1)
    );
  };
  return (
    <div className='flex items-center justify-center bg-transparent w-full p-2 md:p-4'>
      <div className='flex flex-col bg-background shadow-xl rounded-2xl border border-border overflow-hidden text-foreground w-full max-w-5xl mx-auto'>
        <div className='flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-border bg-card w-full'>
          <button
            onClick={handlePreviousDay}
            className='p-1.5 sm:p-2 flex-shrink-0 rounded-full hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-200 text-muted-foreground hover:text-foreground'
          >
            <ChevronLeftIcon className='w-5 h-5' />
          </button>

          <div className='flex flex-col items-center mx-2 text-center min-w-[120px]'>
            <div className='text-lg sm:text-xl flex flex-wrap justify-center items-baseline gap-1 sm:gap-2 font-bold text-foreground tracking-tight'>
              {props.currentDate.getFullYear()}. {props.currentDate.toLocaleString('hu', { month: 'long' })}{' '}
              {props.currentDate.getDate()}.
            </div>
            <div className='text-xs sm:text-sm font-medium text-muted-foreground mt-1 bg-muted px-2 py-0.5 rounded-full'>
              {['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'][props.currentDate.getDay()]}
            </div>
          </div>

          <button
            onClick={handleNextDay}
            disabled={!isNextDayOpen()}
            className='p-1.5 sm:p-2 flex-shrink-0 rounded-full hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-200 text-muted-foreground hover:text-foreground'
          >
            <ChevronRightIcon className='w-5 h-5' />
          </button>
        </div>
        <div className='w-full'>
          <div className='w-full min-w-[280px] relative bg-background'>
            <Line />
            {Array.from({ length: 48 }, (_, i) => (
              <div key={i} className='flex flex-row w-full h-10 group'>
                <div className='flex justify-center items-start h-10 border-b border-border/40 w-16 sm:w-20 bg-muted/5'>
                  {i % 2 === 0 ? (
                    <span className='text-xs font-medium text-muted-foreground mt-1'>{i / 2}:00</span>
                  ) : null}
                </div>
                <div className='relative h-10 border-b border-l border-border/40 p-1 sm:p-2 w-full'>
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
                      return <DayComment key={event.id} comment={event} onEventClick={props.onCommentClick} />;
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
