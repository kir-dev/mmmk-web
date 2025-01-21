import axios from 'axios';
import { useState } from 'react';

const url = 'http://localhost:3001/reservations';

interface AddEventProps {
  onGetData: () => void;
  currentDate: Date;
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
}

export function AddEvent(props: AddEventProps) {
  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [isAdd, setIsAdd] = useState(false);

  const onClick = () => {
    if (nameInput !== '') {
      axios
        .post(url, {
          name: nameInput,
          description: descriptionInput,
          location: locationInput,
          startDate: props.startDate,
          endDate: props.endDate,
          startTime: props.startDate,
          endTime: props.endDate,
        })
        .then(() => {
          props.onGetData();
        });
    }
    setNameInput('');
    setDescriptionInput('');
    setLocationInput('');
    props.setStartDate(new Date());
    props.setEndDate(new Date());
    setIsAdd(!isAdd);
  };

  const onAddEvent = () => {
    setIsAdd(!isAdd);
  };

  return (
    <div className='m-2 text-gray-400'>
      {isAdd ? (
        <div className='absolute z-10 flex flex-col bg-white dark:bg-slate-800 p-2 rounded-lg border-2 border-black'>
          <button
            className='self-end border-2 border-black bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg'
            onClick={onAddEvent}
          >
            X
          </button>

          <p className='self-end'>
            Name:
            <input
              className='ml-1 mt-3 border-2 border-black rounded-lg p-2 max-w-fit bg-blue-900'
              type='text'
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
          </p>
          <p className='self-end'>
            Description:
            <input
              className='ml-1 mt-3 border-2 border-black rounded-lg p-2 max-w-fit bg-blue-900'
              type='text'
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
            />
          </p>
          <p className='self-end'>
            Location:
            <input
              className='ml-1 mt-3 border-2 border-black rounded-lg p-2 max-w-fit bg-blue-900'
              type='text'
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
          </p>
          <p className='self-end'>
            Start Date:
            <input
              className='ml-1 mt-3 border-2 border-black rounded-lg p-2 bg-blue-900'
              type='datetime-local'
              onChange={(e) => props.setStartDate(new Date(e.target.value))}
            />
          </p>
          <p className='self-end'>
            End Date:
            <input
              className='ml-1 mt-3 border-2 border-black rounded-lg p-2 bg-blue-900'
              type='datetime-local'
              onChange={(e) => props.setEndDate(new Date(e.target.value))}
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
