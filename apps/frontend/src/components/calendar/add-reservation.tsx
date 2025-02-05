import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { ReservationStatus } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import { Band } from '@/types/band';
import { User } from '@/types/user';

const url = 'http://localhost:3001/reservations';

interface AddEventProps {
  onGetData: () => void;
  currentDate: Date;
}

export function AddReservation(props: AddEventProps) {
  const [bandName, setBandName] = useState('');
  const [bands, setBands] = useState<Band[]>([]);
  const [band, setBand] = useState<Band>();

  const [userName, setUserName] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>();

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isAdd, setIsAdd] = useState(false);

  const [userSuggestions, setUserSuggestions] = useState<User[]>([]);
  const [bandSuggestions, setBandSuggestions] = useState<Band[]>([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [showBandSuggestions, setShowBandSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

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
    axios.get('http://localhost:3001/band').then((res) => {
      setBands(res.data);
    });
    axios.get('http://localhost:3001/users').then((res) => {
      setUsers(res.data.users);
    });
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
      const filteredSuggestions = users.filter((user) => user.name.toLowerCase().includes(value.toLowerCase()));
      setUserSuggestions(filteredSuggestions);
      setShowUserSuggestions(true);
    } else {
      setUserSuggestions([]);
      setShowUserSuggestions(false);
    }
  };

  const handleUserSuggestionClick = (suggestion: User) => {
    setUser(suggestion);
    setUserName(suggestion.name);
    setShowUserSuggestions(false);
  };

  const handleBandSuggestionClick = (suggestion: Band) => {
    setBand(suggestion);
    setBandName(suggestion.name);
    setShowBandSuggestions(false);
  };

  const onClick = () => {
    if (!user?.id || !band?.id || !startTime || !endTime) {
      console.error('All fields must be filled.');
      return;
    }
    axios
      .post(url, {
        userId: user.id,
        bandId: band.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        gateKeeperId: 2,
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
        setIsAdd(!isAdd);
      })
      .catch((error) => {
        console.error(error.response.data); // Nézd meg, mit mond a szerver
        console.error(error.response.status); // Pl. 400
      });
  };

  const onAddEvent = () => {
    setIsAdd(!isAdd);
  };

  const fetchUserAndBand = () => {
    getBand();
    getUser();
  };

  const getBand = () => {
    axios.get('http://localhost:3001/band').then((res) => {
      setBands(res.data);
      bands.map((banda) => {
        if (banda.name === bandName) {
          setBand(banda);
        }
      });
    });
  };

  const getUser = () => {
    axios
      .get('http://localhost:3001/users')
      .then((res) => {
        const users = Array.isArray(res.data) ? res.data : res.data.users || [];

        if (!Array.isArray(users)) {
          console.error('Invalid data format:', users);
          return;
        }

        setUsers(users);

        const foundUser = users.find((usera) => usera.name === userName);
        if (foundUser) {
          setUser(foundUser);
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };

  return (
    <div className='m-2 text-gray-400'>
      {isAdd ? (
        <div className='absolute'>
          <div className='fixed right-1/3 top-1/4 z-50 flex flex-col bg-white dark:bg-slate-800 p-2 rounded-lg border-2 border-black'>
            <button
              className='self-end border-2 border-black bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg'
              onClick={onAddEvent}
            >
              X
            </button>

            <div className='space-y-4'>
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
                        {suggestion.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
                  onChange={(e) => setStartTime(new Date(e.target.value))}
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor='end' className='text-zinc-300'>
                  Vége
                </label>
                <input
                  className='bg-zinc-700 rounded-lg border-zinc-600 text-zinc-100'
                  type='datetime-local'
                  onChange={(e) => setEndTime(new Date(e.target.value))}
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
        </div>
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
