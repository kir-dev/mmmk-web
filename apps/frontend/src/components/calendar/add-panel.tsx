import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { AddReservation } from "@components/calendar/add-reservation";

interface AddPanelProps {
  onGetData: () => void;
  currentDate: Date;
}

export default function AddPanel(props: AddPanelProps) {
  const [selected, setSelected] = useState('reservation'); // Alapértelmezett érték

  return (
    <div>
      {isAdd ? (
          <div className='flex gap-2 p-2 bg-gray-100 rounded-lg'>
            <Button variant={selected === 'reservation' ? 'default' : 'outline'} onClick={() => setSelected('reservation')}>
              Foglalás
            </Button>
            <Button variant={selected === 'comment' ? 'default' : 'outline'} onClick={() => setSelected('comment')}>
              Komment
            </Button>
          </div>
        {selected === 'reservation' ? (
          <AddReservation onGetData={props.onGetData} currentDate={props.currentDate}/>
        ) : (
          <AddComment/>
        )
      }
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
