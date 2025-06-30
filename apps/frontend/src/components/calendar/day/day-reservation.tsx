// apps/frontend/src/components/calendar/day/day-reservation.tsx
import axios from 'axios';
import { useEffect, useState } from 'react';

import { Band } from '@/types/band';
import { Reservation } from '@/types/reservation';

interface DayEventProps {
  reservation: Reservation;
  onEventClick: (id: number) => void;
}

export default function DayReservation(props: DayEventProps) {
  const startDate = new Date(props.reservation.startTime);
  const endDate = new Date(props.reservation.endTime);
  const [band, setBand] = useState<Band>();

  const offset = (startDate.getMinutes() / 60) * 80;

  const getUser = (id: number) => {
    axios.get(`http://localhost:3030/users/${id}`).then(() => {
      //setUser(res.data);
    });
  };

  const getBand = (id: number) => {
    axios.get(`http://localhost:3030/bands/${id}`).then((res) => {
      setBand(res.data);
    });
  };

  useEffect(() => {
    getUser(props.reservation.userId);
    getBand(props.reservation.bandId);
  }, []);

  // Format time to always show with leading zeros
  const formatTime = (date: Date) => {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const height =
    (endDate.getHours() - startDate.getHours() + (endDate.getMinutes() - startDate.getMinutes()) / 60) * 78;

  return (
    <div
      className='z-40 absolute inset-x-1'
      style={{
        top: `${offset}px`,
      }}
    >
      <div
        className={`
          flex flex-row
          ${
            props.reservation.status === 'OVERTIME'
              ? 'bg-gradient-to-r from-blue-500 to-blue-400'
              : 'bg-gradient-to-r from-emerald-600 to-emerald-500'
          }
          justify-start
          overflow-hidden
          rounded-md
          shadow-md
          border-l-4
          ${props.reservation.status === 'OVERTIME' ? 'border-blue-600' : 'border-emerald-700'}
          transition-all
          duration-200
          hover:shadow-lg
        `}
        style={{
          height: `${Math.max(height, 25)}px`, // Ensure minimum height
        }}
      >
        <button
          className='flex w-full bg-transparent px-2 py-1 hover:bg-black/10 transition-colors duration-200'
          onClick={() => props.onEventClick(props.reservation.id)}
        >
          <div className='flex flex-col w-full'>
            <div className='text-left font-medium text-white text-xs'>
              {`${formatTime(startDate)}-${formatTime(endDate)}`}
            </div>
            <div className='text-left font-bold text-white text-sm truncate mt-0.5'>{band?.name || 'Loading...'}</div>
          </div>
        </button>
      </div>
    </div>
  );
}
