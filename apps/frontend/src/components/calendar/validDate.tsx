import deleteReservation from '@/hooks/deleteReservation';
import { Reservation } from '@/types/reservation';

export default function validDate(
  start: Date,
  end: Date,
  reservation: Reservation | undefined,
  reservations: Reservation[],
  // Configurable reservation length limits (minutes). Defaults mirror the spec/backend
  // fallbacks (30 min / 3 h); callers should pass the values from the backend Settings so
  // the frontend doesn't reject a duration the backend would accept.
  minReservationMinutes = 30,
  maxReservationMinutes = 180
): boolean {
  const durationMs = end.valueOf() - start.valueOf();
  const minDurationMs = minReservationMinutes * 60 * 1000;
  const maxDurationMs = maxReservationMinutes * 60 * 1000;

  // Validate time constraints
  if (start > end) return false;
  if (durationMs < minDurationMs || durationMs > maxDurationMs) return false;

  // Validate 15-minute intervals
  if (start.getMinutes() % 15 !== 0 || end.getMinutes() % 15 !== 0) return false;
  if (reservation) {
    if (
      start.getDate() < new Date(reservation.startTime).getDate() - new Date(reservation.startTime).getDay() ||
      end.getDate() > new Date(reservation.endTime).getDate() + (7 - new Date(reservation.endTime).getDay())
    ) {
      return false;
    }
  }

  reservations = reservations.filter((res) => {
    const date = new Date(res.startTime);
    return date.getDate() === start.getDate();
  });

  for (const res of reservations) {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const resStartTime = new Date(res.startTime).getTime();
    const resEndTime = new Date(res.endTime).getTime();

    if (
      (startTime >= resStartTime && startTime < resEndTime) ||
      (endTime > resStartTime && endTime <= resEndTime) ||
      (startTime <= resStartTime && endTime >= resEndTime)
    ) {
      if (res.id === reservation?.id) {
        return true;
      } else if (res.status === 'OVERTIME') {
        deleteReservation(res.id).then(() => {
          return true;
        });
      } /*else if (me) {
        if (me.role === 'ADMIN') {
          deleteReservation(res.id).then(() => {
            return true;
          });
        }
      }*/ else {
        return false;
      }
    }
  }
  return true;
}
