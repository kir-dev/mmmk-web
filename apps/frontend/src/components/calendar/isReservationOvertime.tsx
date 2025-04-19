import { useState } from 'react';

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

export default function IsOvertime(
  startTime: Date,
  endTime: Date,
  reservationsOfWeek: Reservation[],
  reservationsOfDay: Reservation[]
): Date[] {
  let normalStart = new Date(1970, 1, 1, 0, 0, 0);
  let normalEnd = new Date(1970, 1, 1, 0, 0, 0);
  let overtimeStart = new Date(1970, 1, 1, 0, 0, 0);
  let overtimeEnd = new Date(1970, 1, 1, 0, 0, 0);

  const reservationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // Convert milliseconds to minutes

  let minutesReserved = 0;
  if (reservationsOfWeek) {
    for (const reservation of reservationsOfWeek) {
      const startTime = new Date(reservation.startTime);
      const endTime = new Date(reservation.endTime);
      minutesReserved += (endTime.getTime() - startTime.getTime()) / (1000 * 60); // Convert milliseconds to minutes
    }
  }
  const remainingMinutes = 360 - minutesReserved;
  console.log(remainingMinutes);
  console.log(reservationMinutes);

  let minutesReservedThatDay = 0;
  for (const reservation of reservationsOfDay) {
    const startTime = new Date(reservation.startTime);
    const endTime = new Date(reservation.endTime);
    minutesReservedThatDay += (endTime.getTime() - startTime.getTime()) / (1000 * 60); // Convert milliseconds to minutes
  }

  if (reservationMinutes > remainingMinutes) {
    normalStart = startTime;
    normalEnd = new Date(startTime.getTime() + remainingMinutes * 60 * 1000);
    overtimeStart = new Date(normalEnd.getTime() + 60 * 1000);
    overtimeEnd = endTime;
    console.log('A');
  } else if (reservationMinutes > 180) {
    normalStart = startTime;
    normalEnd = new Date(startTime.getTime() + 180 * 60 * 1000);
    overtimeStart = new Date(normalEnd.getTime() + 60 * 1000);
    overtimeEnd = endTime;
    console.log('B');
  } else if (reservationMinutes + minutesReservedThatDay > 180) {
    normalStart = startTime;
    normalEnd = new Date(startTime.getTime() + (180 - minutesReservedThatDay) * 60 * 1000);
    overtimeStart = new Date(normalEnd.getTime() + 60 * 1000);
    overtimeEnd = endTime;
    console.log('C');
  } else {
    normalStart = startTime;
    normalEnd = endTime;
    overtimeStart = new Date(0);
    overtimeEnd = new Date(0);
    console.log('D');
  }

  const result = [];
  result.push(normalStart, normalEnd);
  if (overtimeStart.getFullYear() !== 1970 && overtimeEnd.getFullYear() !== 1970) {
    result.push(overtimeStart, overtimeEnd);
  }
  console.log('Normal Start:', normalStart);
  console.log('Normal End:', normalEnd);
  console.log('Overtime Start:', overtimeStart);
  console.log('Overtime End:', overtimeEnd);
  return result;
}
