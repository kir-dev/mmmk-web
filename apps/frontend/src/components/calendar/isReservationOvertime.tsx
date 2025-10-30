import { Band } from '@/types/band';
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

const now = new Date();
const startOfWeek = getFirstDayOfWeek(now);
const endOfWeek = getLastDayOfWeek(now);

export function getReservationsOfWeek(reservations: Reservation[], band: Band): Reservation[] {
  return reservations.filter((reservation) => {
    const reservationStart = new Date(reservation.startTime);
    return (
      reservationStart.getTime() >= startOfWeek.getTime() &&
      reservationStart.getTime() <= endOfWeek.getTime() &&
      reservation.bandId === band?.id
    );
  });
}

export function getReservationsOfDay(reservations: Reservation[], band: Band, start: Date): Reservation[] {
  return reservations.filter((reservation) => {
    const reservationStart = new Date(reservation.startTime);
    return (
      reservationStart.getDate() === start.getDate() &&
      reservationStart.getMonth() === start.getMonth() &&
      reservationStart.getFullYear() === start.getFullYear() &&
      reservation.bandId === band?.id
    );
  });
}

export default function IsOvertime(
  startTime: Date,
  endTime: Date,
  reservationsOfWeek: Reservation[],
  reservationsOfDay: Reservation[]
): Date[] {
  const paddingMinutes = 10; // Minimum regular slot to avoid splitting

  let normalStart;
  let normalEnd;
  let overtimeStart;
  let overtimeEnd;

  const reservationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

  let minutesReserved = 0;
  if (reservationsOfWeek) {
    for (const reservation of reservationsOfWeek) {
      if (reservation.status === 'OVERTIME') continue;
      const startTime = new Date(reservation.startTime);
      const endTime = new Date(reservation.endTime);
      minutesReserved += (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    }
  }
  const remainingMinutes = 360 - minutesReserved;

  let minutesReservedThatDay = 0;
  for (const reservation of reservationsOfDay) {
    if (reservation.status === 'OVERTIME') continue;
    const startTime = new Date(reservation.startTime);
    const endTime = new Date(reservation.endTime);
    minutesReservedThatDay += (endTime.getTime() - startTime.getTime()) / (1000 * 60);
  }

  // If the remaining regular time is less than padding, treat the whole as overtime
  if (
    (reservationMinutes > remainingMinutes && remainingMinutes < paddingMinutes) ||
    (reservationMinutes > 180 && 180 - minutesReservedThatDay < paddingMinutes) ||
    (reservationMinutes + minutesReservedThatDay > 180 && 180 - minutesReservedThatDay < paddingMinutes)
  ) {
    normalStart = startTime;
    normalEnd = startTime; // No regular part
    overtimeStart = startTime;
    overtimeEnd = endTime;
  } else if (reservationMinutes > remainingMinutes) {
    normalStart = startTime;
    normalEnd = new Date(startTime.getTime() + remainingMinutes * 60 * 1000);
    overtimeStart = new Date(normalEnd.getTime() + 60 * 1000);
    overtimeEnd = endTime;
  } else if (reservationMinutes > 180) {
    normalStart = startTime;
    normalEnd = new Date(startTime.getTime() + 180 * 60 * 1000);
    overtimeStart = new Date(normalEnd.getTime() + 60 * 1000);
    overtimeEnd = endTime;
  } else if (reservationMinutes + minutesReservedThatDay > 180) {
    normalStart = startTime;
    normalEnd = new Date(startTime.getTime() + (180 - minutesReservedThatDay) * 60 * 1000);
    overtimeStart = new Date(normalEnd.getTime() + 60 * 1000);
    overtimeEnd = endTime;
  } else {
    normalStart = startTime;
    normalEnd = endTime;
    overtimeStart = new Date(0);
    overtimeEnd = new Date(0);
  }

  if (normalStart.getTime() === normalEnd.getTime()) overtimeStart = new Date(normalEnd.getTime());
  const result = [];
  result.push(normalStart, normalEnd);
  if (overtimeStart.getFullYear() !== 1970 && overtimeEnd.getFullYear() !== 1970) {
    result.push(overtimeStart, overtimeEnd);
  }
  return result;
}
