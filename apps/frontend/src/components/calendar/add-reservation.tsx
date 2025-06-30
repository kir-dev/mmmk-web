import { Input } from '@components/ui/input';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import axiosApi from '@/lib/apiSetup';
import { submitReservation } from '@/lib/reservationSubmitter';
import { Band } from '@/types/band';
import { Reservation } from '@/types/reservation';
import { User } from '@/types/user';

interface AddPanelProps {
  onGetData: () => void;
  currentDate: Date;
  onAddEvent: () => void;
  reservations: Reservation[];
}

export default function AddReservation(props: AddPanelProps) {
  const [myUser, setMyUser] = useState<User>();

  const [bandName, setBandName] = useState('');
  const [bands, setBands] = useState<Band[]>([]);
  const [band, setBand] = useState<Band>();

  const [userName, setUserName] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>();

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [userSuggestions, setUserSuggestions] = useState<User[]>([]);
  const [bandSuggestions, setBandSuggestions] = useState<Band[]>([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [showBandSuggestions, setShowBandSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const [valid, setValid] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowUserSuggestions(false);
        setShowBandSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3030/band').then((res) => {
      setBands(res.data);
    });
    axios.get('http://localhost:3030/users').then((res) => {
      setUsers(res.data.users);
    });
    getMe();
  }, []);

  const handleBandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBandName(value);
    if (value.length > 0) {
      const filteredSuggestions = bands.filter((band) => band.name.toLowerCase().includes(value.toLowerCase()));
      setBandSuggestions(filteredSuggestions);
      setShowBandSuggestions(true);
    } else {
      setBandSuggestions([]);
      setShowBandSuggestions(false);
    }
  };

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!Array.isArray(users)) {
      console.error('HIBA: users nem egy tömb!', users);
      return;
    }
    const value = e.target.value;
    setUserName(value);
    if (value.length > 0) {
      const filteredSuggestions = users.filter((user) => user.fullName.toLowerCase().includes(value.toLowerCase()));
      setUserSuggestions(filteredSuggestions);
      setShowUserSuggestions(true);
    } else {
      setUserSuggestions([]);
      setShowUserSuggestions(false);
    }
  };

  const handleUserSuggestionClick = (suggestion: User) => {
    setUser(suggestion);
    setUserName(suggestion.fullName);
    setShowUserSuggestions(false);
  };

  const handleBandSuggestionClick = (suggestion: Band) => {
    setBand(suggestion);
    setBandName(suggestion.name);
    setShowBandSuggestions(false);
  };

  const getMe = () => {
    axiosApi
      .get('http://localhost:3030/users/me')
      .then((res) => {
        setMyUser(res.data);
      })
      .catch((error) => {
        console.error(error.response.data);
        console.error(error.response.status);
      });
  };

  const handleSubmit = async () => {
    await submitReservation({
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
        setBandName('');
        setUserName('');
        setStartTime(new Date());
        setEndTime(new Date());
        props.onAddEvent();
      },
      setValid,
    });
  };

  function shiftStart(date: Date) {
    date.setHours(date.getHours() + 1);
    setStartTime(date);
  }

  function shiftEnd(date: Date) {
    date.setHours(date.getHours() + 1);
    setEndTime(date);
  }

  // For add-reservation.tsx - replace the return part with:
  return (
    <div className='space-y-5'>
      {myUser?.role === 'ADMIN' ? (
        <div className='relative'>
          <label htmlFor='name' className='block text-sm font-medium text-zinc-300 mb-1'>
            Név
          </label>
          <div className='relative'>
            <Input
              id='name'
              value={userName}
              onChange={handleUserNameChange}
              required
              className='bg-zinc-700 border-zinc-600 text-zinc-100 w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent'
              placeholder='Válasszon felhasználót...'
            />
            {showUserSuggestions && userSuggestions.length > 0 && (
              <div
                ref={suggestionRef}
                className='absolute z-10 w-full mt-1 bg-zinc-700 border border-zinc-600 rounded-md shadow-lg max-h-60 overflow-auto'
              >
                {userSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    className='px-4 py-2 cursor-pointer hover:bg-zinc-600 w-full text-left text-zinc-200 transition-colors'
                    onClick={() => handleUserSuggestionClick(suggestion)}
                  >
                    {suggestion.fullName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      <div className='relative'>
        <label htmlFor='band' className='block text-sm font-medium text-zinc-300 mb-1'>
          Banda
        </label>
        <div className='relative'>
          <Input
            id='band'
            value={bandName}
            onChange={handleBandNameChange}
            required
            className='bg-zinc-700 border-zinc-600 text-zinc-100 w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent'
            placeholder='Válasszon bandát...'
          />
          {showBandSuggestions && bandSuggestions.length > 0 && (
            <div
              ref={suggestionRef}
              className='absolute z-10 w-full mt-1 bg-zinc-700 border border-zinc-600 rounded-md shadow-lg max-h-60 overflow-auto'
            >
              {bandSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  className='px-4 py-2 cursor-pointer hover:bg-zinc-600 w-full text-left text-zinc-200 transition-colors'
                  onClick={() => handleBandSuggestionClick(suggestion)}
                >
                  {suggestion.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col'>
          <label htmlFor='begin' className='block text-sm font-medium text-zinc-300 mb-1'>
            Kezdés
          </label>
          <input
            id='begin'
            className='bg-zinc-700 rounded-md border border-zinc-600 text-zinc-100 px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
            type='datetime-local'
            onChange={(e) => shiftStart(new Date(e.target.value))}
          />
        </div>

        <div className='flex flex-col'>
          <label htmlFor='end' className='block text-sm font-medium text-zinc-300 mb-1'>
            Vége
          </label>
          <input
            id='end'
            className='bg-zinc-700 rounded-md border border-zinc-600 text-zinc-100 px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
            type='datetime-local'
            onChange={(e) => shiftEnd(new Date(e.target.value))}
          />
        </div>
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
          Hibás időpont - kérjük válasszon másik időpontot
        </div>
      )}

      <button
        onClick={handleSubmit}
        className='w-full rounded-md bg-orange-500 hover:bg-orange-600 text-zinc-900 font-semibold py-3 mt-4 transition-colors shadow-lg'
      >
        Foglalás hozzáadása
      </button>
    </div>
  );
}
