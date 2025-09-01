import DayComment from '@components/calendar/day/day-comment';
import Line from '@components/calendar/Line';

import ActualReservationForTheDay from '@/hooks/check-actuality-day';
import { Comment } from '@/types/comment';
import { Reservation } from '@/types/reservation';

import DayReservation from './day-reservation';

interface DailyViewPropsWO {
  reservations: Reservation[];
  comments: Comment[];
  currentDate: Date;
  onEventClick: (id: number) => void;
  setCurrentDate: (date: Date) => void;
}

export default function DailyViewWO(props: DailyViewPropsWO) {
  return (
    <div className='w-full h-full relative'>
      <Line />
      {Array.from({ length: 48 }, (_, i) => (
        <div
          key={`time-slot-${i}`}
          className={`
            relative cursor-pointer focus:outline-none focus-visible:ring-2 h-10 
            focus-visible:ring-primary border-b border-slate-300/30
            ${i % 2 === 0 ? 'bg-transparent' : 'bg-slate-800/5'}
          `}
        >
          {props.reservations.map((reservation) => {
            const eventStartDate = new Date(reservation.startTime);
            const eventEndDate = new Date(reservation.endTime);
            if (ActualReservationForTheDay(eventStartDate, eventEndDate, props.currentDate, reservation, i)) {
              return (
                <DayReservation
                  key={`res-${reservation.id}`}
                  reservation={reservation}
                  onEventClick={props.onEventClick}
                />
              );
            }
            return null;
          })}
          {props.comments.map((comment) => {
            const eventStartDate = new Date(comment.startTime);
            const eventEndDate = new Date(comment.endTime);
            if (ActualReservationForTheDay(eventStartDate, eventEndDate, props.currentDate, comment, i)) {
              return <DayComment key={`comment-${comment.id}`} comment={comment} onEventClick={props.onEventClick} />;
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
}
