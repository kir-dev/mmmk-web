import validDate from '@components/calendar/validDate';
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
  clickedEvent: Reservation | undefined;
  setClickedEvent: (reservation: Reservation) => void;
  onGetData: () => void;
  reservations: Reservation[];
}

export default function ReservationDetails(props: EventDetailsProps) {
  if (!props.clickedEvent) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');
  const [editStartTimeValue, setEditStartTimeValue] = useState(new Date());
  const [editEndTimeValue, setEditEndTimeValue] = useState(new Date());

  const [user, setUser] = useState<User>();
  const [band, setBand] = useState<Band>();

  const [me, setMe] = useState<User>();
  //const [role, setRole] = useState<Role>('USER');
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

  const onGetName = (id: number | undefined) => {
    if (!id) return;
    axios.get(`${url}/${id}`).then((res) => {
      props.setClickedEvent(res.data);
    });
  };

  useEffect(() => {
    if (props.clickedEvent) {
      setEditStartTimeValue(new Date(props.clickedEvent.startTime) || new Date());
      setEditEndTimeValue(new Date(props.clickedEvent.endTime) || new Date());
    }
    if (props.clickedEvent?.userId) getUser(props.clickedEvent.userId);
    if (props.clickedEvent?.bandId) getBand(props.clickedEvent.bandId);
    getGateKeeper(props.clickedEvent?.gateKeeperId || null);
    getMe();
    getGKs();
    //setRole(me?.role || 'USER');
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
      {props.isEventDetails && (
        <div className='fixed inset-0 z-50 flex items-start justify-end p-4 bg-black/20 backdrop-blur-sm'>
          <div className='w-full max-w-md overflow-hidden bg-white dark:bg-slate-800 rounded-xl shadow-xl animate-in slide-in-from-right'>
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b dark:border-slate-700'>
              <h2 className='text-xl font-bold text-slate-800 dark:text-white'>Reservation Details</h2>
              <button
                className='p-1.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
                onClick={() => {
                  props.setIsEventDetails(!props.isEventDetails);
                  setIsEditing(false);
                }}
              >
                <span className='sr-only'>Close</span>
                <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className='p-4 space-y-4 text-slate-700 dark:text-slate-300'>
              {/* Band/Name */}
              <div className='space-y-1'>
                <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Band Name</label>
                {isEditing ? (
                  <input
                    className='w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md'
                    type='text'
                    value={editNameValue}
                    onChange={(e) => setEditNameValue(e.target.value)}
                  />
                ) : (
                  <p className='font-medium'>{band?.name || '-'}</p>
                )}
              </div>

              {/* User Info */}
              <div className='space-y-1'>
                <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Booked By</label>
                <p className='font-medium'>{user?.fullName || '-'}</p>
              </div>

              {/* Gatekeeper */}
              <div className='space-y-1'>
                <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Gatekeeper</label>
                <p className='font-medium'>{gateKeeper?.fullName || 'Not assigned'}</p>
              </div>

              {/* Gatekeeper Phone */}
              {gateKeeper && (
                <div className='space-y-1'>
                  <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Gatekeeper Phone</label>
                  <p className='font-medium'>{gateKeeper?.phone || '-'}</p>
                </div>
              )}

              {/* Time Range */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Start Time</label>
                  {isEditing ? (
                    <input
                      className='w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md'
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
                    <p className='font-medium'>
                      {new Date(props.clickedEvent.startTime).getHours()}:
                      {new Date(props.clickedEvent.startTime).getMinutes().toString().padStart(2, '0')}
                    </p>
                  )}
                </div>

                <div className='space-y-1'>
                  <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>End Time</label>
                  {isEditing ? (
                    <input
                      className='w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md'
                      type='datetime-local'
                      defaultValue={new Date(
                        new Date(props.clickedEvent.endTime).setHours(
                          new Date(props.clickedEvent.endTime).getHours() + 2
                        )
                      )
                        .toISOString()
                        .slice(0, 16)}
                      onChange={(e) => setEditEndTimeValue(new Date(e.target.value))}
                    />
                  ) : (
                    <p className='font-medium'>
                      {new Date(props.clickedEvent.endTime).getHours()}:
                      {new Date(props.clickedEvent.endTime).getMinutes().toString().padStart(2, '0')}
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className='space-y-1'>
                <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Status</label>
                <div className='flex items-center'>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${props.clickedEvent?.status === 'OVERTIME' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                    ${props.clickedEvent?.status === 'NORMAL' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                  `}
                  >
                    {props.clickedEvent?.status}
                  </span>
                </div>
              </div>

              {/* Validation Error */}
              {!valid && (
                <div className='p-2 text-sm text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded-md'>
                  Invalid time range selected
                </div>
              )}
            </div>

            {/* Footer with Actions */}
            <div className='p-4 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-900'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                {CurrentUserIsGK() && (
                  <button
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors
                      ${gateKeeper === null ? 'bg-orange-500 hover:bg-orange-600' : 'bg-amber-600 hover:bg-amber-700'}`}
                    onClick={onSetGK}
                  >
                    {gateKeeper === null ? 'Set me as gatekeeper' : 'Unset me as gatekeeper'}
                  </button>
                )}

                {hasEditRights && (
                  <div className='flex gap-2'>
                    {!isEditing && (
                      <button
                        className='px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors'
                        onClick={onDelete}
                      >
                        Delete
                      </button>
                    )}
                    <button
                      className='px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors'
                      onClick={onEdit}
                    >
                      {isEditing ? 'Save' : 'Edit'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
