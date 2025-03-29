import axios from 'axios';
import { useEffect, useState } from 'react';

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
  const [user, setUser] = useState<User>();
  const [band, setBand] = useState<Band>();

  const offset = (startDate.getMinutes() / 60) * 39;

  const getUser = (id: number) => {
    axios.get(`http://localhost:3030/users/${id}`).then((res) => {
      setUser(res.data);
    });
  };

  const getBand = (id: number) => {
    axios.get(`http://localhost:3030/band/${id}`).then((res) => {
      setBand(res.data);
    });
  };

  useEffect(() => {
    getUser(props.reservation.userId);
    getBand(props.reservation.bandId);
  }, []);
  return (
    <div
      className='z-40 absolute'
      style={{
        top: `${offset}px`,
      }}
    >
      <div
        className='flex flex-row bg-blue-400 justify-start max-w-[110px] overflow-auto scrollbar-webkit rounded-md border-2 border-white'
        style={{
          height: `${(endDate.getHours() - startDate.getHours() + (endDate.getMinutes() - startDate.getMinutes()) / 60) * 78}px`,
        }}
      >
        <div className='bg-white w-[3px]' />
        <button
          className='flex bg-transparent rounded px-1 max-w-max hover:bg-eventHover'
          onClick={() => props.onEventClick(props.reservation.id)}
        >
          <div className='flex flex-col'>
            <div className='self-start text-left'>
              {`${startDate.getHours() - 1}:${startDate.getMinutes().toString().padStart(2, '0')}-${endDate.getHours() - 1}:${endDate.getMinutes().toString().padStart(2, '0')}`}
            </div>
            <div className='self-start text-left'>{band?.name}</div>
          </div>
        </button>
      </div>
    </div>
  );
}
