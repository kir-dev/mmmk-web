import DayComment from '@components/calendar/day/day-comment';

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
    <div className='flex border-l dark:border-white'>
      <div className='flex flex-col bg-transparent text-white'>
        <div className='flex items-center justify-center'>
          <div className='w-[150px]'>
            {Array.from({ length: 48 }, (_, i) => (
              <div
                key={i}
                className='relative cursor-pointer focus:outline-none focus-visible:ring-2 h-10 focus-visible:ring-primary border-b text-slate-800 border-slate-800 dark:text-white dark:border-white p-2'
              >
                <div
                  key={i}
                  className='cursor-pointer focus:outline-none focus-visible:ring-2 h-10 focus-visible:ring-primary p-2 border-white '
                >
                  <span className='self-start text-sm' />
                </div>
                <div className='overflow-auto'>
                  {props.reservations.map((reservation) => {
                    const eventStartDate = new Date(reservation.startTime);
                    const eventEndDate = new Date(reservation.endTime);
                    if (ActualReservationForTheDay(eventStartDate, eventEndDate, props.currentDate, reservation, i)) {
                      return (
                        <DayReservation
                          key={reservation.id}
                          reservation={reservation}
                          onEventClick={props.onEventClick}
                        />
                      );
                    }
                  })}
                  {props.comments.map((comment) => {
                    const eventStartDate = new Date(comment.startTime);
                    const eventEndDate = new Date(comment.endTime);
                    if (ActualReservationForTheDay(eventStartDate, eventEndDate, props.currentDate, comment, i)) {
                      return <DayComment key={comment.id} comment={comment} onEventClick={props.onEventClick} />;
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
