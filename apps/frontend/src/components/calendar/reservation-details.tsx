import axios from 'axios';
import { useEffect, useState } from 'react';

import { Band } from '@/types/band';
import { Reservation } from '@/types/reservation';
import { User } from '@/types/user';

const url = 'http://localhost:3001/reservations';

interface EventDetailsProps {
  isEventDetails: boolean;
  setIsEventDetails: (value: boolean) => void;
  clickedEvent: Reservation;
  setClickedEvent: (reservation: Reservation) => void;
  onGetData: () => void;
}

export default function ReservationDetails(props: EventDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [user, setUser] = useState<User>();
  const [band, setBand] = useState<Band>();

  const getUser = (id: number) => {
    axios.get(`http://localhost:3001/users/${id}`).then((res) => {
      setUser(res.data);
    });
  };

  const getBand = (id: number) => {
    axios.get(`http://localhost:3001/band/${id}`).then((res) => {
      setBand(res.data);
    });
  };

  const onDelete = () => {
    axios.delete(`${url}/${props.clickedEvent?.id}`).then(() => {
      props.onGetData();
      props.setIsEventDetails(!props.isEventDetails);
    });
  };

  const onEdit = () => {
    if (editValue !== '') {
      if (isEditing) {
        axios.patch(`${url}/${props.clickedEvent?.id}`, { name: editValue }).then(() => {
          props.onGetData();
          onGetName(props.clickedEvent?.id);
        });
      }
    }
    setEditValue(props.clickedEvent?.name);
    setIsEditing(!isEditing);
  };

  const onGetName = (id: number) => {
    axios.get(`${url}/${id}`).then((res) => {
      props.setClickedEvent(res.data);
    });
  };

  useEffect(() => {
    if (props.clickedEvent?.userId) getUser(props.clickedEvent.userId);
    if (props.clickedEvent?.bandId) getBand(props.clickedEvent.bandId);
  }, [props.clickedEvent]);

  return (
    <div>
      {props.isEventDetails ? (
        <div className='flex flex-col z-50 fixed top-32 right-0 bg-white dark:bg-slate-800 rounded-lg border-2 border-black dark:border-orange-500 p-6 w-full max-w-sm overflow-auto mr-5 text-gray-400 z-10'>
          <div className='flex flex-col items-center justify-between mb-4'>
            <button
              className='self-end border-2 border-black bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg'
              onClick={() => {
                props.setIsEventDetails(!props.isEventDetails);
                setIsEditing(false);
              }}
            >
              X
            </button>
            <h2 className='text-lg font-semibold self-start'>Reservation details</h2>
          </div>
          <div className='grid gap-4 self-start'>
            <p className=''>
              Name:{' '}
              {isEditing ? (
                <input
                  className='self-start mt-10 border-2 border-black rounded-lg p-2 max-w-fit'
                  type='text'
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              ) : (
                <span>{band?.name}</span>
              )}
            </p>
            <p>Foglaló: {user?.name}</p>
            <p>
              Start time: {new Date(props.clickedEvent.startTime).getHours() - 1}:
              {new Date(props.clickedEvent.startTime).getMinutes().toString().padStart(2, '0')}
            </p>
            <p>
              End time: {new Date(props.clickedEvent.endTime).getHours() - 1}:
              {new Date(props.clickedEvent.endTime).getMinutes().toString().padStart(2, '0')}
            </p>
            <p>Status: {props.clickedEvent?.status}</p>
          </div>
          <button
            className='self-end border-2 border-black bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg'
            onClick={() => onDelete()}
          >
            Delete
          </button>
          <button
            className='mt-2 self-end border-2 border-black bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-lg'
            onClick={onEdit}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
