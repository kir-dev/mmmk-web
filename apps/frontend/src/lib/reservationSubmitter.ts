// utils/reservationSubmitter.ts
import IsOvertime, { getFirstDayOfWeek, getLastDayOfWeek } from '@components/calendar/isReservationOvertime';
import validDate from '@components/calendar/validDate';

import collisionWithAdminRes from '@/hooks/collisionWithAdminRes';
import axiosApi from '@/lib/apiSetup';
import { Band } from '@/types/band';
import { Reservation } from '@/types/reservation';
import { User } from '@/types/user';

interface ReservationSubmitResult {
  success: boolean;
  message?: string;
}

export async function submitReservation(params: {
  user?: User;
  band?: Band;
  startTime: Date;
  endTime: Date;
  myUser?: User;
  reservations: Reservation[];
  onSuccess: () => void;
  setValid: (valid: boolean) => void;
}): Promise<ReservationSubmitResult> {
  const { user, band, startTime, endTime, myUser, reservations, onSuccess, setValid } = params;

  if (!user?.id || !band?.id || !startTime || !endTime) {
    if (myUser?.role === 'USER') {
      // If we're a regular user, we use the current user
      params.user = myUser;
    } else {
      return { success: false, message: 'All fields must be filled.' };
    }
  }

  // Create copies to avoid mutating the original dates
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Adjust time zone
  start.setHours(start.getHours() - 1);
  end.setHours(end.getHours() - 1);

  const now = new Date();
  const startOfWeek = getFirstDayOfWeek(now);
  const endOfWeek = getLastDayOfWeek(now);

  const reservationsOfWeek = reservations.filter((reservation) => {
    const reservationStart = new Date(reservation.startTime);
    return (
      reservationStart.getTime() >= startOfWeek.getTime() &&
      reservationStart.getTime() <= endOfWeek.getTime() &&
      reservation.bandId === band?.id
    );
  });

  const reservationsOfDay = reservations.filter((reservation) => {
    const reservationStart = new Date(reservation.startTime);
    return (
      reservationStart.getDate() === start.getDate() &&
      reservationStart.getMonth() === start.getMonth() &&
      reservationStart.getFullYear() === start.getFullYear() &&
      reservation.bandId === band?.id
    );
  });

  // Admin can override collision checks
  if (myUser?.role === 'ADMIN' && !collisionWithAdminRes(start, end, reservationsOfDay)) {
    try {
      await axiosApi.post('/reservations', {
        userId: user?.id,
        bandId: band?.id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        status: 'NORMAL',
      });

      onSuccess();
      setValid(true);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to create reservation' };
    }
  }

  if (validDate(start, end, undefined, reservations)) {
    const reservationTimes = IsOvertime(start, end, reservationsOfWeek, reservationsOfDay);

    // Handle overtime reservation if needed
    if (reservationTimes[2] && reservationTimes[3]) {
      try {
        await axiosApi.post('/reservations', {
          userId: user?.id,
          bandId: band?.id,
          startTime: reservationTimes[2].toISOString(),
          endTime: reservationTimes[3].toISOString(),
          status: 'OVERTIME',
        });
      } catch (error) {
        console.error('Failed to create overtime reservation', error);
      }
    }

    // Create normal reservation if it's long enough
    const minimumReservationTime = 0.25 * 60 * 1000; // 15 minutes in milliseconds
    if (reservationTimes[1].getTime() - reservationTimes[0].getTime() > minimumReservationTime) {
      try {
        await axiosApi.post('/reservations', {
          userId: user?.id,
          bandId: band?.id,
          startTime: reservationTimes[0].toISOString(),
          endTime: reservationTimes[1].toISOString(),
          status: 'NORMAL',
        });

        onSuccess();
      } catch (error) {
        return { success: false, message: 'Failed to create reservation' };
      }
    }

    setValid(true);
    return { success: true };
  } else {
    setValid(false);
    return { success: false, message: 'Invalid date range' };
  }
}
