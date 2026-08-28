// utils/reservationSubmitter.ts
import IsOvertime, { getReservationsOfDay, getReservationsOfWeek } from '@components/calendar/isReservationOvertime';
import validDate from '@components/calendar/validDate';

import collisionWithAdminRes from '@/hooks/collisionWithAdminRes';
import axiosApi from '@/lib/apiSetup';
import { showErrorToast } from '@/lib/errorToast';
import { Band } from '@/types/band';
import { Comment } from '@/types/comment';
import { Reservation } from '@/types/reservation';
import { User } from '@/types/user';
import { isOverlapping } from '@/utils/isOverlapping';

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
  needToBeLetIn: boolean;
}): Promise<ReservationSubmitResult> {
  const { user, band, startTime, endTime, myUser, reservations, onSuccess, setValid, adminOverride, needToBeLetIn } =
    params;

  if (!myUser) {
    setValid(false);
    return { success: false, message: 'Nincs bejelentkezett felhasználó' };
  }

  // Require either user OR band (exclusive)
  if ((!band?.id && !user?.id) || !startTime || !endTime) {
    setValid(false);
    return { success: false, message: 'Felhasználó vagy banda, valamint kezdő és befejező időpont szükséges.' };
  }

  // Ensure exclusive selection (not both)
  if (band?.id && user?.id) {
    setValid(false);
    return { success: false, message: 'Csak felhasználó VAGY banda választható, nem mindkettő.' };
  }

  // Create copies to avoid mutating the original dates
  const start = new Date(startTime);
  const end = new Date(endTime);

  const reservationsOfWeek = getReservationsOfWeek(reservations, band?.id, user?.id, start);

  const reservationsOfDay = getReservationsOfDay(reservations, band?.id, user?.id, start);

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
        ...(band?.id ? { bandId: band.id } : { userId: user?.id }),
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        status: 'ADMINMADE',
        needToBeLetIn: needToBeLetIn,
      });

      onSuccess();
      setValid(true);
      return { success: true, message: 'Sikerült a foglalás létrehozása' };
    } catch (error: unknown) {
      // Backend errors are surfaced via the toast (which carries the useful message); don't
      // also push a generic inline form error — that's redundant.
      showErrorToast(error);
      setValid(false);
      return { success: false };
    }
  }

  let comments: Comment[] = [];
  try {
    // A foglalás idősávját érintő összes felhívás (page: -1), hogy egy tiltó felhívás se maradjon ki
    const res = await axiosApi.get('/comments', {
      params: {
        page: -1,
        page_size: -1,
        from: start.toISOString(),
        to: end.toISOString(),
      },
    });
    comments = res.data.data ?? [];
  } catch (e) {
    // If comments can't be loaded, fail safe and allow reservation
    comments = [];
  }

  const hasNonReservable = comments.some((comment) => {
    if (!comment.isReservable) {
      const commentStart = new Date(comment.startTime);
      const commentEnd = new Date(comment.endTime);
      return isOverlapping(start, end, commentStart, commentEnd);
    }
    return false;
  });

  if (hasNonReservable) {
    setValid(false);
    return { success: false, message: 'A terem nem foglalható a kiválasztott időpontban.' };
  }

  // Load the configured limits up front so the time-slot validation, the normal/overtime
  // split, and the minimum-length check all use the same numbers the backend enforces
  // (falls back to the spec defaults if settings are unavailable).
  let dailyLimitMinutes: number | undefined;
  let weeklyLimitMinutes: number | undefined;
  let minReservationMinutes = 30;
  let maxReservationMinutes = 180;
  try {
    const settingsRes = await axiosApi.get('/settings');
    if (settingsRes.data) {
      dailyLimitMinutes = settingsRes.data.maxHoursPerDay * 60;
      weeklyLimitMinutes = settingsRes.data.maxHoursPerWeek * 60;
      if (typeof settingsRes.data.minReservationMinutes === 'number') {
        minReservationMinutes = settingsRes.data.minReservationMinutes;
      }
      if (typeof settingsRes.data.maxReservationMinutes === 'number') {
        maxReservationMinutes = settingsRes.data.maxReservationMinutes;
      }
    }
  } catch {
    // Use the spec defaults baked in above / into IsOvertime.
  }

  if (validDate(start, end, undefined, reservations, minReservationMinutes, maxReservationMinutes)) {
    const reservationTimes = IsOvertime(
      start,
      end,
      reservationsOfWeek,
      reservationsOfDay,
      dailyLimitMinutes,
      weeklyLimitMinutes
    );

    const minReservationMs = minReservationMinutes * 60 * 1000; // configured minimum reservation length
    const normalMs = reservationTimes[1].getTime() - reservationTimes[0].getTime();
    const hasOvertime = Boolean(reservationTimes[2] && reservationTimes[3]);
    const overtimeMs = hasOvertime ? reservationTimes[3].getTime() - reservationTimes[2].getTime() : 0;
    const ownerField = band?.id ? { bandId: band.id } : { userId: submissionUserId };

    try {
      if (hasOvertime && normalMs >= minReservationMs && overtimeMs >= minReservationMs) {
        // Split: both the normal and overtime parts are long enough to be valid reservations.
        await axiosApi.post('/reservations', {
          ...ownerField,
          startTime: reservationTimes[0].toISOString(),
          endTime: reservationTimes[1].toISOString(),
          status: 'NORMAL',
          needToBeLetIn,
        });
        await axiosApi.post('/reservations', {
          ...ownerField,
          startTime: reservationTimes[2].toISOString(),
          endTime: reservationTimes[3].toISOString(),
          status: 'OVERTIME',
          needToBeLetIn,
        });
      } else if (hasOvertime) {
        // One side would be below the configured minimum, so don't split: the booking exceeds
        // quota, so post the whole thing as a single (freely overwritable) OVERTIME reservation.
        await axiosApi.post('/reservations', {
          ...ownerField,
          startTime: reservationTimes[0].toISOString(),
          endTime: reservationTimes[3].toISOString(),
          status: 'OVERTIME',
          needToBeLetIn,
        });
      } else {
        // Entirely within quota.
        await axiosApi.post('/reservations', {
          ...ownerField,
          startTime: reservationTimes[0].toISOString(),
          endTime: reservationTimes[1].toISOString(),
          status: 'NORMAL',
          needToBeLetIn,
        });
      }

      onSuccess();
      setValid(true);
      return { success: true, message: 'Sikerült a foglalás létrehozása' };
    } catch (error: unknown) {
      // Backend errors carry the useful message in the toast; skip the redundant inline error.
      showErrorToast(error);
      setValid(false);
      return { success: false };
    }
  } else {
    setValid(false);
    return { success: false, message: 'Érvénytelen idősáv' };
  }
}
