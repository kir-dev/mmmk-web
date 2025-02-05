import AddComment from '@components/calendar/add-comment';
import AddReservation from '@components/calendar/add-reservation';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { ReservationStatus } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import { Band } from '@/types/band';
import { User } from '@/types/user';

const url = 'http://localhost:3001/reservations';

interface AddEventProps {
  onGetData: () => void;
  currentDate: Date;
}

export function AddPanel(props: AddEventProps) {
  const [isAdd, setIsAdd] = useState(false);
  const [selected, setSelected] = useState('reservation');

  const onAddEvent = () => {
    setIsAdd(!isAdd);
  };

  return (
    <div className='m-2 text-gray-400'>
      {isAdd ? (
        <div className='absolute'>
          <div className='fixed right-1/3 top-1/4 z-50 flex flex-col bg-white dark:bg-slate-800 p-2 rounded-lg border-2 border-black'>
            <button
              className='self-end border-2 border-black bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg'
              onClick={onAddEvent}
            >
              X
            </button>
            <div className='flex gap-2'>
              <Button
                variant={selected === 'reservation' ? 'default' : 'outline'}
                onClick={() => setSelected('reservation')}
              >
                Foglalás
              </Button>
              <Button variant={selected === 'comment' ? 'default' : 'outline'} onClick={() => setSelected('comment')}>
                Komment
              </Button>
            </div>
            {selected === 'reservation' ? (
              <AddReservation onGetData={props.onGetData} currentDate={props.currentDate} onAddEvent={onAddEvent} />
            ) : (
              <AddComment onGetData={props.onGetData} onAddEvent={onAddEvent} />
            )}
          </div>
        </div>
      ) : (
        <button
          className='border-2 border-black dark:border-orange-500 bg-calendarBg hover:bg-gray-700 font-bold py-2 px-4 rounded-lg'
          onClick={onAddEvent}
        >
          {' '}
          +{' '}
        </button>
      )}
    </div>
  );
}
