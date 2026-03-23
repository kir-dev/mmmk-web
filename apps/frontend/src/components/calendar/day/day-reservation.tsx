import { useEffect, useState } from 'react';

import axiosApi from '@/lib/apiSetup';
import { Band } from '@/types/band';
import { Reservation } from '@/types/reservation';
import { User } from '@/types/user';

interface DayEventProps {
  reservation: Reservation;
  onEventClick: (id: number) => void;
}

export default function DayReservation(props: DayEventProps) {
  const startDate = new Date(props.reservation.startTime);
  const endDate = new Date(props.reservation.endTime);
  const [band, setBand] = useState<Band>();
  const [user, setUser] = useState<User>();

  const offset = (startDate.getMinutes() / 60) * 80;

  const getUser = (id: number) => {
    axiosApi.get(`/users/${id}`).then((res) => {
      setUser(res.data);
    });
  };

  const getBand = (id: number) => {
    axiosApi.get(`/bands/${id}`).then((res) => {
      setBand(res.data);
    });
  };

  useEffect(() => {
    if (props.reservation.userId) {
      getUser(props.reservation.userId);
    }
    if (props.reservation.bandId) {
      getBand(props.reservation.bandId);
    }
  }, []);

  const formatTime = (date: Date) => {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Get color based on reservation type
  const getReservationColor = (): { bg: string; border: string } => {
    // 1. Admin-made reservations (purple)
    if (props.reservation.status === 'ADMINMADE') {
      return {
        bg: 'bg-gradient-to-r from-violet-600 to-violet-500',
        border: 'border-violet-700',
      };
    }

    // 2. Overtime reservations (blue)
    if (props.reservation.status === 'OVERTIME') {
      return {
        bg: 'bg-gradient-to-r from-blue-600 to-blue-500',
        border: 'border-blue-700',
      };
    }

    // 3. Normal reservations (emerald/green)
    return {
      bg: 'bg-gradient-to-r from-emerald-600 to-emerald-500',
      border: 'border-emerald-700',
    };
  };

  const colors = getReservationColor();

  const height =
    (endDate.getHours() - startDate.getHours() + (endDate.getMinutes() - startDate.getMinutes()) / 60) * 80;

  return (
    <div
      className='z-30 absolute inset-x-1 pointer-events-none'
      style={{
        top: `${offset}px`,
      }}
    >
      <div
        className={`
          flex flex-row
          ${colors.bg}
          justify-start
          overflow-hidden
          rounded-md
          shadow-md
          border-l-4
          ${colors.border}
          transition-all
          duration-200
          hover:shadow-lg
        `}
        style={{
          height: `${Math.max(height, 25)}px`, // Ensure minimum height
        }}
      >
        <button
          className='pointer-events-auto flex w-full bg-transparent px-2 py-1 hover:bg-black/10 transition-colors duration-200'
          onClick={() => props.onEventClick(props.reservation.id)}
        >
          <div className='flex flex-col w-full'>
            <div className='text-left font-medium text-white text-xs'>
              {`${formatTime(startDate)}-${formatTime(endDate)}`}
            </div>
            <div className='text-left font-bold text-white text-sm truncate mt-0.5'>
              {band?.name || user?.fullName || 'Loading...'}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
