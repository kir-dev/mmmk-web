import { useState } from 'react';

import axiosApi from '@/lib/apiSetup';

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
      return;
    }
    axiosApi
      .post('/comments', {
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

  // For add-comment.tsx - replace the return part with:
  return (
    <div className='space-y-5'>
      <div>
        <label htmlFor='comment' className='block text-sm font-medium text-zinc-300 mb-1'>
          Komment
        </label>
        <input
          id='comment'
          type='text'
          placeholder='Írja be a kommentet...'
          className='bg-zinc-700 border border-zinc-600 text-zinc-100 w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent'
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
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
            onChange={(e) => setStartTime(new Date(e.target.value))}
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
            onChange={(e) => setEndTime(new Date(e.target.value))}
          />
        </div>
      </div>

      <div className='flex items-center'>
        <input
          id='reservable'
          className='h-5 w-5 text-orange-500 border-zinc-600 rounded focus:ring-orange-500 bg-zinc-700'
          type='checkbox'
          onChange={(e) => setIsReservable(e.target.checked)}
          checked={isReservable}
        />
        <label htmlFor='reservable' className='ml-2 block text-sm font-medium text-zinc-300'>
          Foglalható
        </label>
      </div>

      <button
        className='w-full rounded-md bg-orange-500 hover:bg-orange-600 text-zinc-900 font-semibold py-3 mt-4 transition-colors shadow-lg'
        onClick={addComment}
      >
        Komment hozzáadása
      </button>
    </div>
  );
}
