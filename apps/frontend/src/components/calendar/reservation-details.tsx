// components/calendar/reservation-details.tsx
import { useMemo } from 'react';

import { useReservationDetails } from '@/hooks/useReservationDetails';
import { Reservation } from '@/types/reservation';

import { TimePicker } from './time-picker';

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
    editStartTimeValue,
    editEndTimeValue,
    setEditStartTimeValue,
    setEditEndTimeValue,
    user,
    band,
    gateKeeper,
    gateKeeperLoading,
    valid,
    errorMessage,
    hasEditRights,
    currentUserCanBeGateKeeper,
    onSetGK,
    onDelete,
    onEdit,
    handleCloseModal,
    setAsOvertime,
    requestNormalReservation,
    me,
  } = useReservationDetails(props);

  const statusLabels: Record<string, string> = {
    OVERTIME: 'Túlidős foglalás',
    NORMAL: 'Normál foglalás',
    ADMINMADE: 'Admin által létrehozott foglalás',
  };
  const resType = useMemo(
    () => statusLabels[props.clickedEvent!.status] ?? 'Ismeretlen státusz',
    [props.clickedEvent?.status]
  );

  return (
    <div>
      {props.isEventDetails && (
        <div className='fixed inset-0 z-50 flex items-start justify-end p-4 bg-black/20 backdrop-blur-sm'>
          <div className='w-full max-w-md overflow-hidden bg-white dark:bg-slate-800 rounded-xl shadow-xl animate-in slide-in-from-right'>
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b dark:border-slate-700'>
              <h2 className='text-xl font-bold text-slate-800 dark:text-white'>Foglalás részletek</h2>
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
                <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Banda neve</label>
                <p className='font-medium'>{band?.name || '-'}</p>
              </div>

              {/* User Info */}
              <div className='space-y-1'>
                <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Foglaló személy</label>
                <p className='font-medium'>{user?.fullName || '-'}</p>
              </div>

              {/* Gatekeeper */}
              <div className='space-y-1'>
                <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Beengedő</label>
                <p className='font-medium'>{gateKeeper?.fullName || '-'}</p>
              </div>

              {/* Gatekeeper Phone */}
              {gateKeeper && (
                <div className='space-y-1'>
                  <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>
                    Beengedő telefonszáma
                  </label>
                  <p className='font-medium'>{gateKeeper?.phone || '-'}</p>
                </div>
              )}

              {/* Time Range */}
              {isEditing ? (
                <div className='space-y-4'>
                  <TimePicker label='Kezdés' value={editStartTimeValue} onChange={setEditStartTimeValue} />
                  <TimePicker label='Befejezés' value={editEndTimeValue} onChange={setEditEndTimeValue} />
                </div>
              ) : (
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-1'>
                    <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Kezdés</label>
                    <p className='font-medium'>
                      {new Date(props.clickedEvent.startTime).getHours()}:
                      {new Date(props.clickedEvent.startTime).getMinutes().toString().padStart(2, '0')}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Befejezés</label>
                    <p className='font-medium'>
                      {new Date(props.clickedEvent.endTime).getHours()}:
                      {new Date(props.clickedEvent.endTime).getMinutes().toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
              )}

              <div className='space-y-1 flex flex-row gap-4'>
                <div className='flex flex-col gap-2'>
                  <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Kell-e fogadni</label>
                  <span className='inline-flex items-center py-0.5 rounded-full text-xs font-medium'>
                    {props.clickedEvent?.needToBeLetIn ? 'Igen' : 'Nem'}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className='space-y-1 flex flex-row gap-4'>
                <div className='flex flex-col gap-2'>
                  <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Státusz</label>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${props.clickedEvent?.status === 'OVERTIME' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                    ${props.clickedEvent?.status === 'NORMAL' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300' : ''}
                    ${props.clickedEvent?.status === 'ADMINMADE' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                  `}
                  >
                    {resType}
                  </span>
                </div>
              </div>

              {/* Validation / save Error */}
              {!valid && (
                <div className='p-2 text-sm text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded-md'>
                  {errorMessage || 'Érvénytelen időtartam'}
                </div>
              )}
            </div>

            {/* Footer with Actions */}
            <div className='p-4 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-900'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                {/* Gatekeeper Sign-up Button — hidden while loading to prevent flash (issue #65) */}
                {!gateKeeperLoading && gateKeeper === null && currentUserCanBeGateKeeper() && (
                  <button
                    className='px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors'
                    onClick={onSetGK}
                  >
                    Jelentkezés beengedőnek
                  </button>
                )}

                {/* Gatekeeper Resign Button - only for assigned gatekeeper */}
                {gateKeeper !== null && me?.id === gateKeeper.id && (
                  <button
                    className='px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-md transition-colors'
                    onClick={onSetGK}
                  >
                    Beengedés leadása
                  </button>
                )}

                {hasEditRights && (
                  <>
                    <div className='flex flex-row gap-2'>
                      {!isEditing && (
                        <button
                          type='button'
                          className='px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors'
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete();
                          }}
                        >
                          Törlés
                        </button>
                      )}
                      <button
                        type='button'
                        className='px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors'
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onEdit();
                        }}
                      >
                        {isEditing ? 'Mentés' : 'Szerkesztés'}
                      </button>
                    </div>
                    <div className='flex flex-row gap-2'>
                      <button
                        className='px-4 py-2 text-sm font-medium rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        onClick={setAsOvertime}
                      >
                        Túlidős foglalásra állítás
                      </button>
                      <button
                        className='px-4 py-2 text-sm font-medium rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
                        onClick={requestNormalReservation}
                      >
                        Normál foglalás kérelmezése
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
