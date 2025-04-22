import validDate from '@components/calendar/validDate';
import { Role } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import axiosApi from '@/lib/apiSetup';
import { Band } from '@/types/band';
import { ClubMembership } from '@/types/member';
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
  const [role, setRole] = useState<Role>('USER');
  const [gateKeeper, setGateKeeper] = useState<User | null>();

  const [gateKeepers, setGateKeepers] = useState<ClubMembership[]>([]);
  const [valid, setValid] = useState(true);

  const [hasEditRights, setHasEditRights] = useState(false);

  const getMe = () => {
    axiosApi.get('http://localhost:3030/users/me').then((res) => {
      setMe(res.data);
      if (res.data.role === 'ADMIN' || props.clickedEvent?.userId === res.data.id) {
        setHasEditRights(true);
      }
    });
  };

  const getGateKeeper = (id: number | null) => {
    if (id) {
      axios
        .get(`http://localhost:3030/memberships/${id}`)
        .then((res) => {
          axios.get(`http://localhost:3030/users/${res.data.userId}`).then((result) => {
            setGateKeeper(result.data);
          });
        })
        .catch(() => {
          setGateKeeper(null);
        });
    } else {
      setGateKeeper(null);
    }
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
    if (isEditing) {
      if (validDate(editStartTimeValue, editEndTimeValue, props.clickedEvent, props.reservations)) {
        axios
          .patch(`${url}/${props.clickedEvent?.id}`, {
            startTime: editStartTimeValue.toISOString(),
            endTime: editEndTimeValue.toISOString(),
          })
          .then(() => {
            console.log('Sikeres módosítás');
            props.onGetData();
            onGetName(props.clickedEvent?.id);
          });
        setValid(true);
      } else {
        setValid(false);
      }
    }
    //setEditNameValue(props.clickedEvent?.name);
    setIsEditing(!isEditing);
  };

  const onGetName = (id: number) => {
    axios.get(`${url}/${id}`).then((res) => {
      props.setClickedEvent(res.data);
    });
  };

  useEffect(() => {
    setEditStartTimeValue(new Date(props.clickedEvent?.startTime));
    setEditEndTimeValue(new Date(props.clickedEvent?.endTime));
    if (props.clickedEvent?.userId) getUser(props.clickedEvent.userId);
    if (props.clickedEvent?.bandId) getBand(props.clickedEvent.bandId);
    getGateKeeper(props.clickedEvent?.gateKeeperId || null);
    getMe();
    getGKs();
    setRole(me?.role || 'USER');
  }, [props.clickedEvent]);

  const getGKs = () => {
    axiosApi.get('http://localhost:3030/memberships').then((res) => {
      setGateKeepers(res.data);
    });
  };

  function CurrentUserIsGK() {
    let isUserGK: ClubMembership | null = null;
    for (let i = 0; i < gateKeepers.length; i++) {
      if (gateKeepers[i].userId === me?.id) {
        isUserGK = gateKeepers[i];
        return isUserGK;
      }
    }
  }

  const onSetGK = () => {
    const isUserGK = CurrentUserIsGK();

    if (gateKeeper) {
      axiosApi
        .patch(`${url}/${props.clickedEvent?.id}`, {
          gateKeeperId: null,
        })
        .then(() => {
          setGateKeeper(null);
          props.onGetData();
        });
    }

    if (isUserGK && gateKeeper === null) {
      axiosApi
        .patch(`${url}/${props.clickedEvent?.id}`, {
          gateKeeperId: isUserGK.id,
        })
        .then(() => {
          axiosApi.get(`http://localhost:3030/users/${isUserGK.userId}`).then((resp) => {
            setGateKeeper(resp.data);
          });
          props.onGetData();
        });
    }
  };

  return (
    <div>
      {props.isEventDetails ? (
        <div className='flex flex-col z-50 fixed top-32 right-0 bg-white dark:bg-slate-800 rounded-lg border-2 border-black dark:border-orange-500 p-6 w-full max-w-sm overflow-auto mr-5 text-gray-400'>
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
            <p>Foglaló: {user?.fullName}</p>
            <p>Beengedő: {gateKeeper?.fullName}</p>
            <p>Beengedő telefonszáma: {gateKeeper?.phone}</p>
            <p>
              Start time:{' '}
              {isEditing ? (
                <input
                  className='bg-zinc-700 rounded-lg border-zinc-600 text-zinc-100'
                  type='datetime-local'
                  defaultValue={new Date(
                    new Date(props.clickedEvent.startTime).setHours(
                      new Date(props.clickedEvent.startTime).getHours() + 2
                    )
                  )
                    .toISOString()
                    .slice(0, 16)}
                  onChange={(e) => setEditStartTimeValue(new Date(e.target.value))}
                />
              ) : (
                <span>
                  {new Date(props.clickedEvent.startTime).getHours()}:
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
                  defaultValue={new Date(
                    new Date(props.clickedEvent.endTime).setHours(new Date(props.clickedEvent.endTime).getHours() + 2)
                  )
                    .toISOString()
                    .slice(0, 16)}
                  onChange={(e) => setEditEndTimeValue(new Date(e.target.value))}
                />
              ) : (
                <span>
                  {new Date(props.clickedEvent.endTime).getHours()}:
                  {new Date(props.clickedEvent.endTime).getMinutes().toString().padStart(2, '0')}
                </span>
              )}
            </p>
            <p>Status: {props.clickedEvent?.status}</p>
          </div>
          <div className='flex flex-row justify-between mt-4'>
            {CurrentUserIsGK() ? (
              <div className='self-end'>
                <button
                  className='border-2 border-black bg-orange-500 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded-lg'
                  onClick={onSetGK}
                >
                  {gateKeeper === null ? 'Set me as gatekeeper' : 'Unset me as gatekeeper'}
                </button>
              </div>
            ) : null}
            {hasEditRights ? (
              <div className='flex flex-col'>
                <button
                  className='border-2 border-black bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg mb-1'
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
                {valid ? null : <div className='text-red-500'>Hibás időpont</div>}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
