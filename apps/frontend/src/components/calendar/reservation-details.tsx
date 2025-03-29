import validDate from '@components/calendar/validDate';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Band } from '@/types/band';
import { Reservation } from '@/types/reservation';
import { User } from '@/types/user';

const url = 'http://localhost:3030/reservations';

interface EventDetailsProps {
  isEventDetails: boolean;
  setIsEventDetails: (value: boolean) => void;
  clickedEvent: Reservation;
  setClickedEvent: (reservation: Reservation) => void;
  onGetData: () => void;
  reservations: Reservation[];
}

export default function ReservationDetails(props: EventDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');
  const [editStartTimeValue, setEditStartTimeValue] = useState(new Date());
  const [editEndTimeValue, setEditEndTimeValue] = useState(new Date());
  const [user, setUser] = useState<User>();
  const [band, setBand] = useState<Band>();
  const [me, setMe] = useState<User>();
  const [gateKeeper, setGateKeeper] = useState<User>();

  const getMe = () => {
    axios.get('http://localhost:3030/users/me').then((res) => {
      setMe(res.data);
      console.log(res.data);
      console.log(me);
    });
  };

  const getGateKeeper = (id: number) => {
    axios.get(`http://localhost:3030/users/${id}`).then((res) => {
      setGateKeeper(res.data);
    });
  };

  const getUser = (id: number) => {
    axios.get(`http://localhost:3030/users/${id}`).then((res) => {
      setUser(res.data);
      setEditNameValue(res.data.name);
    });
  };

  const getBand = (id: number) => {
    axios.get(`http://localhost:3030/band/${id}`).then((res) => {
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
    if (validDate(editStartTimeValue, editEndTimeValue, props.clickedEvent, props.reservations)) {
      if (isEditing) {
        axios
          .patch(`${url}/${props.clickedEvent?.id}`, {
            name: editNameValue,
            startTime: editStartTimeValue,
            endTime: editEndTimeValue,
          })
          .then(() => {
            props.onGetData();
            onGetName(props.clickedEvent?.id);
          });
      }
    }
    setEditNameValue(props.clickedEvent?.name);
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
    if (props.clickedEvent?.gateKeeperId) getGateKeeper(props.clickedEvent.gateKeeperId);
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
                  value={editNameValue}
                  onChange={(e) => setEditNameValue(e.target.value)}
                />
              ) : (
                <span>{band?.name}</span>
              )}
            </p>
            <p>Foglaló: {user?.name}</p>
            <p>Beengedő: {gateKeeper?.name}</p>
            <p>
              Start time:{' '}
              {isEditing ? (
                <input
                  className='bg-zinc-700 rounded-lg border-zinc-600 text-zinc-100'
                  type='datetime-local'
                  onChange={(e) => setEditStartTimeValue(new Date(e.target.value))}
                />
              ) : (
                <span>
                  {new Date(props.clickedEvent.startTime).getHours() - 1}:
                  {new Date(props.clickedEvent.startTime).getMinutes().toString().padStart(2, '0')}
                </span>
              )}
            </p>
            <p>
              End time:{' '}
              {isEditing ? (
                <input
                  className='bg-zinc-700 rounded-lg border-zinc-600 text-zinc-100'
                  type='datetime-local'
                  onChange={(e) => setEditEndTimeValue(new Date(e.target.value))}
                />
              ) : (
                <span>
                  {new Date(props.clickedEvent.endTime).getHours() - 1}:
                  {new Date(props.clickedEvent.endTime).getMinutes().toString().padStart(2, '0')}
                </span>
              )}
            </p>
            <p>Status: {props.clickedEvent?.status}</p>
          </div>
          <div className='flex flex-row justify-between mt-4'>
            <div className='self-end'>
              <button
                className='border-2 border-black bg-orange-500 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded-lg'
                onClick={() => {
                  axios.patch(`${url}/${props.clickedEvent?.id}`, { gateKeeperId: `${me?.id}` }).then((res) => {
                    props.onGetData();
                    onGetName(props.clickedEvent?.id);
                    console.log(res.data);
                    console.log(props.clickedEvent.gateKeeperId);
                  });
                }}
              >
                Assign yourself
              </button>
            </div>
            <div className='flex flex-col'>
              <button
                className='border-2 border-black bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg'
                onClick={onDelete}
              >
                Delete
              </button>
              <button
                className='border-2 border-black bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-lg'
                onClick={onEdit}
              >
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
