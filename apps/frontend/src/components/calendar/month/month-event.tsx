import { Comment } from '@/types/comment';
import { Reservation } from '@/types/reservation';

interface MonthEventProps {
  events: (Reservation | Comment)[];
  currentDate: Date;
  onEventClick: (id: number) => void;
  day: number;
}

function isReservation(obj: unknown): obj is Reservation {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'bandId' in obj &&
    typeof (obj as any).id === 'number' &&
    typeof (obj as any).bandId === 'string'
  );
}

export default function MonthEvent(props: MonthEventProps) {
  return (
    <div>
      {props.events.map((event) => {
        const eventStartDate = new Date(event.startTime);
        const eventEndDate = new Date(event.endTime);

        if (eventStartDate.getMonth() === eventEndDate.getMonth()) {
          if (
            eventStartDate.getDate() <= props.day &&
            eventEndDate.getDate() >= props.day &&
            eventStartDate.getMonth() <= props.currentDate.getMonth() &&
            eventEndDate.getMonth() >= props.currentDate.getMonth() &&
            eventStartDate.getFullYear() === props.currentDate.getFullYear()
          ) {
            return (
              <button
                key={event.id}
                className='mt-1 bg-transparent rounded px-1 min-w-28 max-w-fit hover:bg-eventHover flex flex-col'
                onClick={() => props.onEventClick(event.id)}
              >
                {isReservation(event) ? (
                  <p className='self-start'>{event.bandId}</p>
                ) : (
                  <p className='self-start'>{event.comment}</p>
                )}
              </button>
            );
          }
        } else if (
          eventStartDate.getMonth() !== props.currentDate.getMonth() &&
          eventEndDate.getMonth() !== props.currentDate.getMonth()
        ) {
          if (
            eventStartDate.getMonth() <= props.currentDate.getMonth() &&
            eventEndDate.getMonth() >= props.currentDate.getMonth() &&
            eventStartDate.getFullYear() === props.currentDate.getFullYear()
          ) {
            return (
              <button
                key={event.id}
                className='mt-1 bg-transparent rounded px-1 min-w-28 max-w-fit hover:bg-eventHover flex flex-col'
                onClick={() => props.onEventClick(event.id)}
              >
                {isReservation(event) ? (
                  <p className='self-start'>{event.bandId}</p>
                ) : (
                  <p className='self-start'>{event.comment}</p>
                )}
              </button>
            );
          }
        } else if (
          (eventStartDate.getDate() <= props.day &&
            eventStartDate.getMonth() === props.currentDate.getMonth() &&
            eventStartDate.getFullYear() === props.currentDate.getFullYear()) ||
          (eventEndDate.getDate() >= props.day && eventEndDate.getMonth() === props.currentDate.getMonth())
        ) {
          return (
            <button
              key={event.id}
              className='mt-1 bg-transparent rounded px-1 min-w-28 max-w-fit hover:bg-eventHover flex flex-col'
              onClick={() => props.onEventClick(event.id)}
            >
              {isReservation(event) ? (
                <p className='self-start'>{event.bandId}</p>
              ) : (
                <p className='self-start'>{event.comment}</p>
              )}
            </button>
          );
        }
      })}
    </div>
  );
}
