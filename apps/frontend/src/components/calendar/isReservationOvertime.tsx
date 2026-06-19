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

export function getReservationsOfWeek(reservations: Reservation[], bandId?: number, userId?: number): Reservation[] {
  // Computed per call so the week window doesn't go stale if a session spans a week boundary.
  const now = new Date();
  const startOfWeek = getFirstDayOfWeek(now);
  const endOfWeek = getLastDayOfWeek(now);
  return reservations.filter((reservation) => {
    const reservationStart = new Date(reservation.startTime);

    let matchesIdentifier = false;
    if (bandId) {
      matchesIdentifier = reservation.bandId === bandId;
    } else if (userId) {
      matchesIdentifier = reservation.userId === userId;
    }

    return (
      reservationStart.getTime() >= startOfWeek.getTime() &&
      reservationStart.getTime() <= endOfWeek.getTime() &&
      matchesIdentifier
    );
  });
}

export function getReservationsOfDay(
  reservations: Reservation[],
  bandId?: number,
  userId?: number,
  start?: Date
): Reservation[] {
  const dateToCheck = start || new Date();
  return reservations.filter((reservation) => {
    const reservationStart = new Date(reservation.startTime);

    let matchesIdentifier = false;
    if (bandId) {
      matchesIdentifier = reservation.bandId === bandId;
    } else if (userId) {
      matchesIdentifier = reservation.userId === userId;
    }

    return (
      reservationStart.getDate() === dateToCheck.getDate() &&
      reservationStart.getMonth() === dateToCheck.getMonth() &&
      reservationStart.getFullYear() === dateToCheck.getFullYear() &&
      matchesIdentifier
    );
  });
}

// Floors a date down to the nearest 15-minute boundary (seconds/ms cleared), so that a
// normal/overtime split never produces a time the backend rejects for not being on a
// :00/:15/:30/:45 grid.
function floorTo15Minutes(date: Date): Date {
  const floored = new Date(date);
  floored.setMinutes(Math.floor(floored.getMinutes() / 15) * 15, 0, 0);
  return floored;
}

export default function IsOvertime(
  startTime: Date,
  endTime: Date,
  reservationsOfWeek: Reservation[],
  reservationsOfDay: Reservation[],
  // Daily/weekly NORMAL limits in minutes. Defaults match the spec (3h/day, 6h/week) but
  // callers should pass the values from the backend Settings so both sides agree.
  dailyLimitMinutes = 180,
  weeklyLimitMinutes = 360
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
  const remainingMinutes = weeklyLimitMinutes - minutesReserved;

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
    (reservationMinutes > dailyLimitMinutes && dailyLimitMinutes - minutesReservedThatDay < paddingMinutes) ||
    (reservationMinutes + minutesReservedThatDay > dailyLimitMinutes &&
      dailyLimitMinutes - minutesReservedThatDay < paddingMinutes)
  ) {
    normalStart = startTime;
    normalEnd = startTime; // No regular part
    overtimeStart = startTime;
    overtimeEnd = endTime;
  } else if (reservationMinutes > remainingMinutes) {
    normalStart = startTime;
    normalEnd = floorTo15Minutes(new Date(startTime.getTime() + remainingMinutes * 60 * 1000));
    overtimeStart = new Date(normalEnd.getTime());
    overtimeEnd = endTime;
  } else if (reservationMinutes > dailyLimitMinutes) {
    normalStart = startTime;
    normalEnd = floorTo15Minutes(new Date(startTime.getTime() + dailyLimitMinutes * 60 * 1000));
    overtimeStart = new Date(normalEnd.getTime());
    overtimeEnd = endTime;
  } else if (reservationMinutes + minutesReservedThatDay > dailyLimitMinutes) {
    normalStart = startTime;
    normalEnd = floorTo15Minutes(
      new Date(startTime.getTime() + (dailyLimitMinutes - minutesReservedThatDay) * 60 * 1000)
    );
    overtimeStart = new Date(normalEnd.getTime());
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
