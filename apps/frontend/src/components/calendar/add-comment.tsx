import { useState } from 'react';

import { useUser } from '@/hooks/useUser'; // Import your user hook
import axiosApi from '@/lib/apiSetup';

import { TimePicker } from './time-picker';

interface AddCommentProps {
  onGetData: () => void;
  onAddEvent: () => void;
}

export default function AddComment(props: AddCommentProps) {
  // Initialize with rounded times (15-minute intervals)
  const getRoundedDate = () => {
    const date = new Date();
    const minutes = Math.floor(date.getMinutes() / 15) * 15;
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };

  const [comment, setComment] = useState('');
  const [startTime, setStartTime] = useState(getRoundedDate());
  const [endTime, setEndTime] = useState(getRoundedDate());
  const [isReservable, setIsReservable] = useState<boolean>(false);

  const { user } = useUser(); // Get current user

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
        console.error(error.response.data);
        console.error(error.response.status);
      });
  };

  if (!user || user.role !== 'ADMIN') {
    return <div className='text-red-600 dark:text-red-400'>Only admins can add comments.</div>;
  }

  // For add-comment.tsx - replace the return part with:
  return (
    <div className='space-y-5'>
      <div>
        <label htmlFor='comment' className='block text-sm font-medium text-black dark:text-zinc-300 mb-1'>
          Komment
        </label>
        <input
          id='comment'
          type='text'
          placeholder='Írja be a kommentet...'
          className='bg-white hover:bg-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-black dark:text-zinc-200 border border-zinc-600 w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-ring focus:border-transparent'
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
      </div>

      <div className='space-y-4'>
        <TimePicker label='Kezdés' value={startTime} onChange={setStartTime} />

        <TimePicker label='Vége' value={endTime} onChange={setEndTime} />
      </div>

      <div className='flex items-center'>
        <input
          id='reservable'
          className='h-5 w-5 text-primary border-zinc-600 rounded focus:ring-ring bg-zinc-700'
          type='checkbox'
          onChange={(e) => setIsReservable(e.target.checked)}
          checked={isReservable}
        />
        <label htmlFor='reservable' className='ml-2 block text-sm font-medium text-black dark:text-zinc-300'>
          Foglalható
        </label>
      </div>

      <button
        className='w-full rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 mt-4 transition-colors shadow-lg'
        onClick={addComment}
      >
        Komment hozzáadása
      </button>
    </div>
  );
}
