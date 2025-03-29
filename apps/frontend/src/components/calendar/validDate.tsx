import { Reservation } from '@/types/reservation';

export default function validDate(
  start: Date,
  end: Date,
  reservation: Reservation | null,
  reservations: Reservation[]
): boolean {
  if (start > end || end.getHours() - start.getHours() >= 3) {
    return false;
  }
  if (reservation) {
    if (
      start.getDate() < new Date(reservation.startTime).getDate() - new Date(reservation.startTime).getDay() ||
      end.getDate() > new Date(reservation.endTime).getDate() + (7 - new Date(reservation.endTime).getDay())
    ) {
      return false;
    }
  }

  reservations = reservations.filter((res) => res.startTime.getDate !== start.getDate);

  for (const res of reservations) {
    console.log(res.startTime);
    console.log(res.endTime);
    console.log(start);
    console.log(end);
    if (
      (start >= res.startTime && start <= res.endTime) ||
      (end >= res.startTime && end <= res.endTime) ||
      (start <= res.startTime && end >= res.endTime) ||
      (start >= res.startTime && end <= res.endTime)
    ) {
      return false;
    }
  }
  return true;
}
