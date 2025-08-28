// apps/frontend/src/components/calendar/add-panel.tsx
import AddComment from '@components/calendar/add-comment';
import AddReservation from '@components/calendar/add-reservation';
import { Button } from '@components/ui/button';
import React, { useEffect, useState } from 'react';

import { Reservation } from '@/types/reservation';

interface AddEventProps {
  onGetData: () => void;
  currentDate: Date;
  reservations: Reservation[];
}

export function AddPanel(props: AddEventProps) {
  const [isAdd, setIsAdd] = useState(false);
  const [selected, setSelected] = useState('reservation');

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsAdd(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const onAddEvent = () => {
    setIsAdd(!isAdd);
  };

  return (
    <div className='m-2 text-gray-400'>
      {isAdd ? (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center overflow-y-auto'>
          <div className='relative w-full max-w-md rounded-xl bg-zinc-800 border border-zinc-700 shadow-2xl transform transition-all'>
            <div className='p-6'>
              <button
                className='absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors'
                onClick={onAddEvent}
                aria-label='Close'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M18 6L6 18M6 6l12 12' />
                </svg>
              </button>

              <h2 className='text-xl font-semibold mb-4 text-zinc-100'>
                {selected === 'reservation' ? 'Új foglalás létrehozása' : 'Új komment hozzáadása'}
              </h2>

              <div className='flex gap-2 mb-6'>
                <Button
                  onClick={() => setSelected('reservation')}
                  className={`flex-1 py-2 ${
                    selected === 'reservation'
                      ? 'bg-orange-500 hover:bg-orange-600 text-zinc-900'
                      : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200'
                  }`}
                >
                  Foglalás
                </Button>
                <Button
                  onClick={() => setSelected('comment')}
                  className={`flex-1 py-2 ${
                    selected === 'comment'
                      ? 'bg-orange-500 hover:bg-orange-600 text-zinc-900'
                      : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200'
                  }`}
                >
                  Komment
                </Button>
              </div>

              {selected === 'reservation' ? (
                <AddReservation
                  onGetData={props.onGetData}
                  currentDate={props.currentDate}
                  onAddEvent={onAddEvent}
                  reservations={props.reservations}
                />
              ) : (
                <AddComment onGetData={props.onGetData} onAddEvent={onAddEvent} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <button
          className='h-10 w-10 flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md transition-transform hover:scale-105'
          onClick={onAddEvent}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path d='M12 5v14M5 12h14' />
          </svg>
        </button>
      )}
    </div>
  );
}
