import { Reservation } from '@/types/reservation';

export default function MakeReservation(startTime: Date, endTime: Date, reservationsOfWeek: Reservation[]) {
  if (!reservationsOfWeek) return;

  let hoursReserved = 0;
  if (reservationsOfWeek) {
    for (const reservation of reservationsOfWeek) {
      const startTime = new Date(reservation.startTime);
      const endTime = new Date(reservation.endTime);
      hoursReserved += (endTime.getTime() - startTime.getTime()) / (1000 * 60); // Convert milliseconds to hours
    }
  }
  hoursReserved += (endTime.getTime() - startTime.getTime()) / (1000 * 60);
  if (hoursReserved > 360) {
    return true;
  }
  return false;
}
