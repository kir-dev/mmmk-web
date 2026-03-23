import React, { useEffect, useState } from 'react';

import { useUser } from '@/hooks/useUser';
import { useWeekStatus } from '@/hooks/useWeekStatus';
import axiosApi from '@/lib/apiSetup';
import { submitReservation } from '@/lib/reservationSubmitter';
import { Band } from '@/types/band';
import { Reservation } from '@/types/reservation';
import { User } from '@/types/user';

import { TimePicker } from './time-picker';

interface AddPanelProps {
  onGetData: () => void;
  currentDate: Date;
  onAddEvent: () => void;
  reservations: Reservation[];
}

export default function AddReservation(props: AddPanelProps) {
  const { user: myUser, refetch: refetchUser } = useUser();

  const [bands, setBands] = useState<Band[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Exclusive user OR band selection
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [user, setUser] = useState<User>();
  const [band, setBand] = useState<Band>();

  // Initialize with rounded times (15-minute intervals)
  const getRoundedDate = () => {
    const date = new Date();
    const minutes = Math.floor(date.getMinutes() / 15) * 15;
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };

  const [startTime, setStartTime] = useState(getRoundedDate());
  const [endTime, setEndTime] = useState(getRoundedDate());

  const [valid, setValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [needToBeLetIn, setNeedToBeLetIn] = useState(false);
  const [adminOverride, setAdminOverride] = useState(false);
  const [userBands, setUserBands] = useState<Band[]>([]);

  // Check whether the week containing startTime is open for reservations (issue #58)
  const weekStatus = useWeekStatus(startTime);
  const weekIsLocked = !weekStatus.isOpen && myUser?.role !== 'ADMIN';

  useEffect(() => {
    axiosApi.get('/bands').then((res) => setBands(res.data));
    axiosApi.get('/users').then((res) => setUsers(res.data.users));
    refetchUser();
  }, [myUser]);

  // Filter bands to only show user's bands (based on membership)
  useEffect(() => {
    if (myUser && bands.length > 0) {
      const myBandIds =
        myUser.role === 'ADMIN'
          ? bands // Admins see all bands
          : bands.filter((band) => band.members?.some((member) => member.userId === myUser.id));
      setUserBands(myBandIds);
    }
  }, [myUser, bands]);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);

    if (value.startsWith('user-')) {
      const userId = parseInt(value.replace('user-', ''));
      const selectedUser = users.find((u) => u.id === userId);
      setUser(selectedUser);
      setBand(undefined);
    } else if (value.startsWith('band-')) {
      const bandId = parseInt(value.replace('band-', ''));
      const selectedBand = bands.find((b) => b.id === bandId);
      setBand(selectedBand);
      setUser(undefined);
    }
  };

  const handleSubmit = async () => {
    const { message } = await submitReservation({
      user,
      band,
      startTime,
      endTime,
      myUser,
      reservations: props.reservations,
      onSuccess: () => {
        props.onGetData();
        setUser(undefined);
        setBand(undefined);
        setSelectedValue('');
        setStartTime(getRoundedDate());
        setEndTime(getRoundedDate());
        setAdminOverride(false);
        props.onAddEvent();
      },
      setValid,
      adminOverride,
      needToBeLetIn,
    });
    if (message) {
      setErrorMessage(message);
    }
  };

  return (
    <div className='space-y-5'>
      {/* User OR Band Selection */}
      <div className='relative'>
        <label htmlFor='selection' className='block text-sm font-medium text-black dark:text-zinc-300 mb-1'>
          {myUser?.role === 'ADMIN' ? 'Felhasználó vagy Banda' : 'Foglalás típusa'}
        </label>
        <select
          id='selection'
          value={selectedValue}
          onChange={handleSelectionChange}
          className='bg-white hover:bg-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-black dark:text-zinc-200 border-zinc-600 w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent'
        >
          <option value=''>-- Válasszon --</option>
          {myUser?.role === 'ADMIN' && (
            <optgroup label='Felhasználók'>
              {users.map((u) => (
                <option key={`user-${u.id}`} value={`user-${u.id}`}>
                  {u.fullName}
                </option>
              ))}
            </optgroup>
          )}
          {/* Personal reservation option for non-admins */}
          {myUser?.role !== 'ADMIN' && myUser && (
            <option key={`user-${myUser.id}`} value={`user-${myUser.id}`}>
              Személyes foglalás ({myUser.fullName})
            </option>
          )}
          <optgroup label='Bandák'>
            {(myUser?.role === 'ADMIN' ? bands : userBands).map((b) => (
              <option key={`band-${b.id}`} value={`band-${b.id}`}>
                {b.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {myUser?.role === 'ADMIN' && (
        <div className='flex items-center gap-2'>
          <input
            id='adminOverride'
            type='checkbox'
            checked={adminOverride}
            onChange={(e) => setAdminOverride(e.target.checked)}
            className='h-4 w-4 accent-primary rounded'
          />
          <label htmlFor='adminOverride' className='text-sm font-medium text-black dark:text-zinc-300'>
            Admin foglalás
          </label>
        </div>
      )}

      <div className='flex items-center gap-2'>
        <input
          id='needToBeLetIn'
          type='checkbox'
          checked={needToBeLetIn}
          onChange={(e) => setNeedToBeLetIn(e.target.checked)}
          className='h-4 w-4 accent-primary rounded'
        />
        <label htmlFor='needToBeLetIn' className='text-sm font-medium text-black dark:text-zinc-300'>
          Kérek kolis fogadást
        </label>
      </div>

      <div className='space-y-4'>
        <TimePicker label='Kezdés' value={startTime} onChange={setStartTime} />

        <TimePicker label='Vége' value={endTime} onChange={setEndTime} />
      </div>

      {!valid && (
        <div className='text-red-500 bg-red-900/20 p-3 rounded-md text-sm flex items-center'>
          <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          {errorMessage}
        </div>
      )}

      {/* Closed week warning */}
      {weekIsLocked && (
        <div className='flex items-center gap-2 p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-sm'>
          <svg className='w-4 h-4 shrink-0' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          Ez a hét nem nyílt meg a foglalásokhoz. Válassz egy másik időpontot, vagy várj az adminisztrátor megnyitására.
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={weekIsLocked}
        className='w-full rounded-md bg-primary hover:bg-primary/90 disabled:bg-zinc-400 disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 mt-4 transition-colors shadow-lg'
      >
        Foglalás hozzáadása
      </button>
    </div>
  );
}
