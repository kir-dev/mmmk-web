import { Comment } from '@/types/comment';
import { Reservation } from '@/types/reservation';

export default function ActualReservationForTheDay(
  eventStartDate: Date,
  eventEndDate: Date,
  currentDate: Date,
  event: Reservation | Comment,
  i: number
) {
  if (
    new Date(event.startTime).getHours() === i / 2 &&
    eventStartDate.getDate() === currentDate.getDate() &&
    eventEndDate.getDate() === currentDate.getDate() &&
    //eventStartDate.getMonth() === currentDate.getMonth() &&
    eventStartDate.getFullYear() === currentDate.getFullYear()
  ) {
    return true;
  } else {
    return false;
  }
}
