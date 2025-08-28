// components/calendar/reservation-details.tsx
import React from 'react';

import { useReservationDetails } from '@/hooks/useReservationDetails';
import { Reservation } from '@/types/reservation';

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

  const {
    isEditing,
    editNameValue,
    setEditNameValue,
    setEditStartTimeValue,
    setEditEndTimeValue,
    user,
    band,
    gateKeeper,
    valid,
    hasEditRights,
    CurrentUserIsGK,
    onSetGK,
    onDelete,
    onEdit,
    handleCloseModal,
  } = useReservationDetails(props);

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
                onClick={handleCloseModal}
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
