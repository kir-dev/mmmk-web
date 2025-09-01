// utils/reservationSubmitter.ts
import IsOvertime, { getReservationsOfDay, getReservationsOfWeek } from '@components/calendar/isReservationOvertime';
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
  adminOverride: boolean;
}): Promise<ReservationSubmitResult> {
  const { user, band, startTime, endTime, myUser, reservations, onSuccess, setValid, adminOverride } = params;

  if (!myUser) {
    setValid(false);
    return { success: false, message: 'Nincs bejelentkezett felhasználó' };
  }

  if (!band?.id || !startTime || !endTime) {
    return { success: false, message: 'Band, start time and end time are required.' };
  }

  // Create copies to avoid mutating the original dates
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Adjust time zone
  start.setHours(start.getHours() - 1);
  end.setHours(end.getHours() - 1);

  const reservationsOfWeek = getReservationsOfWeek(reservations, band);

  const reservationsOfDay = getReservationsOfDay(reservations, band, start);

  let submissionUserId: number;
  if (myUser?.role === 'ADMIN') {
    submissionUserId = user?.id || myUser.id;
  } else {
    submissionUserId = myUser.id;
  }

  // Admin can override collision checks
  if (myUser?.role === 'ADMIN' && !collisionWithAdminRes(start, end, reservationsOfDay) && adminOverride) {
    try {
      await axiosApi.post('/reservations', {
        userId: user?.id,
        bandId: band?.id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        status: 'ADMINMADE',
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

    // Create normal reservation if it's long enough
    const minimumReservationTime = 0.5 * 60 * 1000; // 30 minutes in milliseconds
    if (reservationTimes[1].getTime() - reservationTimes[0].getTime() > minimumReservationTime) {
      try {
        await axiosApi.post('/reservations', {
          userId: submissionUserId,
          bandId: band?.id,
          startTime: reservationTimes[0].toISOString(),
          endTime: reservationTimes[1].toISOString(),
          status: 'NORMAL',
        });

        // Handle overtime reservation if needed
        if (reservationTimes[2] && reservationTimes[3]) {
          await axiosApi.post('http://localhost:3030/reservations', {
            userId: submissionUserId,
            bandId: band?.id,
            startTime: reservationTimes[2].toISOString(),
            endTime: reservationTimes[3].toISOString(),
            status: 'OVERTIME',
          });

          onSuccess();
        }

        onSuccess();
      } catch (error) {
        return { success: false, message: 'Failed to create reservation' };
      }
    } else if (reservationTimes[2] && reservationTimes[3]) {
      try {
        await axiosApi.post('/reservations', {
          userId: submissionUserId,
          bandId: band?.id,
          startTime: reservationTimes[0].toISOString(),
          endTime: reservationTimes[3].toISOString(),
          status: 'OVERTIME',
        });

        onSuccess();
      } catch (error) {
        console.error('Failed to create overtime reservation', error);
      }
    }

    setValid(true);
    return { success: true };
  } else {
    setValid(false);
    return { success: false, message: 'Invalid date range' };
  }
}
