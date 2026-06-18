import deleteReservation from '@/hooks/deleteReservation';
import { Reservation, ReservationStatus } from '@/types/reservation';

export default function collisionWithAdminRes(
  startTime: Date,
  endTime: Date,
  reservationsOfDay: Reservation[]
): boolean {
  // Admin reservations are identified by their status, so the check stays synchronous.
  const adminReservations = reservationsOfDay.filter((res) => res.status === ReservationStatus.ADMINMADE);

  for (const res of adminReservations) {
    const startTimeRes = new Date(res.startTime).getTime();
    const endTimeRes = new Date(res.endTime).getTime();
    const startTimeNew = startTime.getTime();
    const endTimeNew = endTime.getTime();

    if (
      (startTimeNew >= startTimeRes && startTimeNew < endTimeRes) ||
      (endTimeNew > startTimeRes && endTimeNew <= endTimeRes) ||
      (startTimeNew <= startTimeRes && endTimeNew >= endTimeRes)
    ) {
      return true;
    }
  }

  // Only OVERTIME (over-quota) reservations are freely overwritable per the rules; NORMAL
  // reservations are protected and must not be deleted when booking over them.
  for (const res of reservationsOfDay) {
    if (res.status !== ReservationStatus.OVERTIME) continue;

    const startTimeRes = new Date(res.startTime).getTime();
    const endTimeRes = new Date(res.endTime).getTime();
    const startTimeNew = startTime.getTime();
    const endTimeNew = endTime.getTime();

    if (
      (startTimeNew >= startTimeRes && startTimeNew < endTimeRes) ||
      (endTimeNew > startTimeRes && endTimeNew <= endTimeRes) ||
      (startTimeNew <= startTimeRes && endTimeNew >= endTimeRes)
    ) {
      deleteReservation(res.id);
    }
  }
  return false;
}
