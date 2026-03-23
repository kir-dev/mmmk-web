// utils/reservationSubmitter.ts
import IsOvertime, { getReservationsOfDay, getReservationsOfWeek } from '@components/calendar/isReservationOvertime';
import validDate from '@components/calendar/validDate';

import collisionWithAdminRes from '@/hooks/collisionWithAdminRes';
import { showErrorToast } from '@/lib/errorToast';
import axiosApi from '@/lib/apiSetup';
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

  const reservationsOfWeek = getReservationsOfWeek(reservations, band?.id, user?.id);

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
      showErrorToast(error);
      setValid(false);
      return { success: false, message: 'Nem sikerült a foglalás létrehozása' };
    }
  }

  let comments: Comment[] = [];
  try {
    // Fetch ALL comments (page: -1) so no non-reservable comment is silently missed
    const res = await axiosApi.get('/comments', {
      params: {
        page: -1,
        page_size: -1,
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

  if (validDate(start, end, undefined, reservations)) {
    const reservationTimes = IsOvertime(start, end, reservationsOfWeek, reservationsOfDay);

    // Create normal reservation if it's long enough
    const minimumReservationTime = 0.5 * 60 * 1000; // 30 minutes in milliseconds
    if (reservationTimes[1].getTime() - reservationTimes[0].getTime() > minimumReservationTime) {
      try {
        await axiosApi.post('/reservations', {
          ...(band?.id ? { bandId: band.id } : { userId: submissionUserId }),
          startTime: reservationTimes[0].toISOString(),
          endTime: reservationTimes[1].toISOString(),
          status: 'NORMAL',
          needToBeLetIn: needToBeLetIn,
        });

        // Handle overtime reservation if needed
        if (reservationTimes[2] && reservationTimes[3]) {
          await axiosApi.post('http://localhost:3030/reservations', {
            ...(band?.id ? { bandId: band.id } : { userId: submissionUserId }),
            startTime: reservationTimes[2].toISOString(),
            endTime: reservationTimes[3].toISOString(),
            status: 'OVERTIME',
            needToBeLetIn: needToBeLetIn,
          });

          onSuccess();
        }

        onSuccess();
      } catch (error: unknown) {
        showErrorToast(error);
        setValid(false);
        return { success: false, message: 'Nem sikerült a foglalás létrehozása' };
      }
    } else if (reservationTimes[2] && reservationTimes[3]) {
      try {
        await axiosApi.post('/reservations', {
          ...(band?.id ? { bandId: band.id } : { userId: submissionUserId }),
          startTime: reservationTimes[0].toISOString(),
          endTime: reservationTimes[3].toISOString(),
          status: 'OVERTIME',
          needToBeLetIn: needToBeLetIn,
        });

        onSuccess();
      } catch (error: unknown) {
        showErrorToast(error);
        console.error('Nem sikerült a foglalás létrehozása', error);
      }
    }

    setValid(true);
    return { success: true, message: 'Sikerült a foglalás létrehozása' };
  } else {
    setValid(false);
    return { success: false, message: 'Érvénytelen idősáv' };
  }
}
