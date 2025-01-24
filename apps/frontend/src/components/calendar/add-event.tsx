import { ReservationStatus } from '@prisma/client';
import axios from 'axios';
import { useState } from 'react';

import { Band } from '@/types/band';
import { User } from '@/types/user';

const url = 'http://localhost:3001/reservations';

interface AddEventProps {
  onGetData: () => void;
  currentDate: Date;
}

export function AddEvent(props: AddEventProps) {
  const [bandName, setBandName] = useState('');
  const [bands, setBands] = useState<Band[]>([]);
  const [band, setBand] = useState<Band>();

  const [userName, setUserName] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>();

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isAdd, setIsAdd] = useState(false);

  const onClick = () => {
    if (!user?.id || !band?.id || !startTime || !endTime) {
      console.error('All fields must be filled.');
      return;
    }
    console.log(typeof startTime);
    console.log(startTime);
    console.log(startTime.toISOString());
    axios
      .post(url, {
        userId: user?.id,
        bandId: band?.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        gateKeeperId: 3,
        status: 'NORMAL',
      })
      .then(() => {
        props.onGetData();
      })
      .catch((error) => {
        console.error(error.response.data); // Nézd meg, mit mond a szerver
        console.error(error.response.status); // Pl. 400
      });
    setBandName('');
    setUser(undefined);
    setBand(undefined);
    setStartTime(new Date());
    setEndTime(new Date());
    setIsAdd(!isAdd);
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
        console.log('API Response:', res.data);
        const users = Array.isArray(res.data) ? res.data : res.data.users || [];

        if (!Array.isArray(users)) {
          console.error('Invalid data format:', users);
          return;
        }

        setUsers(users);

        const foundUser = users.find((usera) => usera.name === userName);
        if (foundUser) {
          setUser(foundUser);
          console.log('User found:', foundUser);
          console.log('User found:', user);
        } else {
          console.log('User not found');
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

            <div>
              <p className='self-end'>
                Band Name:
                <input
                  className='ml-1 my-3 border-2 border-black rounded-lg p-2 bg-blue-900'
                  type='text'
                  onChange={(e) => setBandName(e.target.value)}
                />
              </p>
              <p className='self-end'>
                User Name:
                <input
                  className='ml-1 my-3 border-2 border-black rounded-lg p-2 bg-blue-900'
                  type='text'
                  onChange={(e) => setUserName(e.target.value)}
                />
              </p>
              <button
                className='self-end border-2 border-black bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded-lg'
                onClick={fetchUserAndBand}
              >
                Search
              </button>
            </div>
            <p className='self-end'>
              Start Time:
              <input
                className='ml-1 mt-3 border-2 border-black rounded-lg p-2 bg-blue-900'
                type='datetime-local'
                onChange={(e) => setStartTime(new Date(e.target.value))}
              />
            </p>
            <p className='self-end'>
              End Date:
              <input
                className='ml-1 mt-3 border-2 border-black rounded-lg p-2 bg-blue-900'
                type='datetime-local'
                onChange={(e) => setEndTime(new Date(e.target.value))}
              />
            </p>

            <button
              className='mt-3 border-2 border-black bg-blue-900 hover:bg-blue-600 font-bold py-2 px-4 rounded-lg'
              onClick={onClick}
            >
              {' '}
              Add{' '}
            </button>
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
