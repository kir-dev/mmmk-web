import axios from 'axios';
import React, { useState } from 'react';

interface AddCommentProps {
  onGetData: () => void;
  onAddEvent: () => void;
}

export default function AddComment(props: AddCommentProps) {
  const [comment, setComment] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isReservable, setIsReservable] = useState<boolean>(false);

  const addComment = () => {
    if (!comment || !startTime || !endTime) {
      console.error('All fields must be filled.');
      console.log(comment, isReservable, startTime, endTime);
      return;
    }
    console.log(comment, isReservable, startTime, endTime);
    axios
      .post('http://localhost:3030/comments', {
        comment: comment,
        startTime: startTime,
        endTime: endTime,
        isReservable: Boolean(isReservable),
      })
      .then(() => {
        props.onGetData();
        setComment('');
        setStartTime(new Date());
        setEndTime(new Date());
        setIsReservable(false);
        props.onAddEvent();
      })
      .catch((error) => {
        console.error(error.response.data); // Nézd meg, mit mond a szerver
        console.error(error.response.status); // Pl. 400
      });
  };

  return (
    <div className='flex flex-col gap-2 p-2 bg-transparent rounded-lg'>
      <input
        type='text'
        placeholder='Komment'
        className='p-2 rounded-lg w-full bg-zinc-700'
        onChange={(e) => setComment(e.target.value)}
        value={comment}
      />
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
      <div className='flex flex-col'>
        <label htmlFor='reservable' className='text-zinc-300'>
          Foglalható
        </label>
        <input
          className='bg-zinc-700 rounded-lg border-zinc-600 text-zinc-100'
          type='checkbox'
          onChange={(e) => {
            console.log('Checkbox változás:', e.target.checked); // Logoljuk ki, biztosan működik-e
            setIsReservable(e.target.checked);
          }}
        />
      </div>
      <button className='p-2 bg-orange-500 text-white rounded-lg' onClick={addComment}>
        Hozzáadás
      </button>
    </div>
  );
}
