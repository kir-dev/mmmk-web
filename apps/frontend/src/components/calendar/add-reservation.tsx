import validDate from '@components/calendar/validDate';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import axiosApi from '@/lib/apiSetup';
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

  const onClick = () => {
    if (!user?.id || !band?.id || !startTime || !endTime) {
      if (myUser?.role === 'USER') {
        setUser(myUser);
      } else {
        console.error('All fields must be filled.');
        return;
      }
    }
    startTime.setHours(startTime.getHours() - 1);
    endTime.setHours(endTime.getHours() - 1);
    if (validDate(startTime, endTime, null, props.reservations)) {
      axiosApi
        .post('http://localhost:3030/reservations', {
          userId: user?.id,
          bandId: band?.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          status: 'NORMAL',
        })
        .then(() => {
          props.onGetData();
          setUser(undefined);
          setBand(undefined);
          setBandName('');
          setUserName('');
          setStartTime(new Date());
          setEndTime(new Date());
          props.onAddEvent();
          setValid(true);
        })
        .catch((error) => {
          console.error(error.response.data);
          console.error(error.response.status);
        });
      setValid(true);
    } else {
      setValid(false);
    }
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

  function shiftStart(date: Date) {
    date.setHours(date.getHours() + 1);
    setStartTime(date);
  }

  function shiftEnd(date: Date) {
    date.setHours(date.getHours() + 1);
    setEndTime(date);
  }

  return (
    <div>
      <div>
        <div className='space-y-4'>
          {myUser?.role === 'ADMIN' ? (
            <div className='relative'>
              <label htmlFor='name' className='text-zinc-300'>
                Név
              </label>
              <Input
                id='name'
                value={userName}
                onChange={handleUserNameChange}
                required
                className='bg-zinc-700 border-zinc-600 text-zinc-100'
              />
              {showUserSuggestions && userSuggestions.length > 0 && (
                <div
                  ref={suggestionRef}
                  className='absolute z-10 w-full mt-1 bg-zinc-700 border border-zinc-600 rounded-md shadow-lg'
                >
                  {userSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className='px-4 py-2 cursor-pointer hover:bg-zinc-600 w-full rounded-md'
                      onClick={() => handleUserSuggestionClick(suggestion)}
                    >
                      {suggestion.fullName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}
          <div className='relative'>
            <label htmlFor='name' className='text-zinc-300'>
              Banda
            </label>
            <Input
              id='band'
              value={bandName}
              onChange={handleBandNameChange}
              required
              className='bg-zinc-700 border-zinc-600 text-zinc-100'
            />
            {showBandSuggestions && bandSuggestions.length > 0 && (
              <div
                ref={suggestionRef}
                className='absolute z-10 w-full mt-1 bg-zinc-700 border border-zinc-600 rounded-md shadow-lg'
              >
                {bandSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className='px-4 py-2 cursor-pointer hover:bg-zinc-600 w-full rounded-md'
                    onClick={() => handleBandSuggestionClick(suggestion)}
                  >
                    {suggestion.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className='flex flex-col'>
            <label htmlFor='begin' className='text-zinc-300'>
              Kezdés
            </label>
            <input
              className='bg-zinc-700 rounded-lg border-zinc-600 text-zinc-100'
              type='datetime-local'
              onChange={(e) => shiftStart(new Date(e.target.value))}
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='end' className='text-zinc-300'>
              Vége
            </label>
            <input
              className='bg-zinc-700 rounded-lg border-zinc-600 text-zinc-100'
              type='datetime-local'
              onChange={(e) => shiftEnd(new Date(e.target.value))}
            />
          </div>
          <button
            onClick={onClick}
            className='w-full rounded-lg bg-orange-500 hover:bg-orange-600 text-zinc-900 font-semibold'
          >
            Foglalás hozzáadása
          </button>
        </div>
      </div>
      {valid ? null : <div className='text-red-500'>Hibás időpont</div>}
    </div>
  );
}
