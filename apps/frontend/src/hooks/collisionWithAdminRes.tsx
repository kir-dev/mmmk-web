import deleteReservation from '@/hooks/deleteReservation';
import getUser from '@/hooks/getUser';
import { Reservation } from '@/types/reservation';

export default function collisionWithAdminRes(
  startTime: Date,
  endTime: Date,
  reservationsOfDay: Reservation[]
): boolean {
  const adminReservations = reservationsOfDay.filter((res) => {
    getUser(res.userId).then((user) => {
      return user.role === 'ADMIN';
    });
  });

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

  for (const res of reservationsOfDay) {
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
