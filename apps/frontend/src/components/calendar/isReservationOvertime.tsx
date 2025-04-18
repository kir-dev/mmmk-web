import { Reservation } from '@/types/reservation';

export function getFirstDayOfWeek(date: Date = new Date()): Date {
  const firstDay = new Date(date);
  const dayOfWeek = (firstDay.getDay() + 6) % 7; // Adjust so Monday is 0, Sunday is 6
  firstDay.setDate(firstDay.getDate() - dayOfWeek);
  firstDay.setHours(0, 0, 0, 0); // Reset time to midnight
  return firstDay;
}

export function getLastDayOfWeek(date: Date = new Date()): Date {
  const lastDay = new Date(date);
  const dayOfWeek = (lastDay.getDay() + 6) % 7; // 0 (Sunday) to 6 (Saturday)
  lastDay.setDate(lastDay.getDate() + (6 - dayOfWeek));
  lastDay.setHours(23, 59, 59, 999); // Set time to the end of the day
  return lastDay;
}

export default function IsOvertime(startTime: Date, endTime: Date, reservationsOfWeek: Reservation[]) {
  if (!reservationsOfWeek) return;

  let hoursReserved = 0;
  if (reservationsOfWeek) {
    for (const reservation of reservationsOfWeek) {
      const startTime = new Date(reservation.startTime);
      const endTime = new Date(reservation.endTime);
      hoursReserved += (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // Convert milliseconds to hours
    }
  }
  hoursReserved += (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  if (hoursReserved > 6) {
    return true;
  }
  return false;
}
