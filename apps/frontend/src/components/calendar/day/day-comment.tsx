// apps/frontend/src/components/calendar/day/day-comment.tsx
import { Comment } from '@/types/comment';

interface DayEventProps {
  comment: Comment;
  onEventClick: (id: number) => void;
}

export default function DayComment(props: DayEventProps) {
  const startDate = new Date(props.comment.startTime);
  const endDate = new Date(props.comment.endTime);

  const offset = (startDate.getMinutes() / 60) * 39;

  // Format time to always show with leading zeros
  const formatTime = (date: Date) => {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const height =
    (endDate.getHours() - startDate.getHours() + (endDate.getMinutes() - startDate.getMinutes()) / 60) * 78;

  return (
    <div
      className='z-40 absolute inset-x-1'
      style={{
        top: `${offset}px`,
      }}
    >
      <div
        className={`
          flex flex-row 
          ${
            props.comment.isReservable
              ? 'bg-gradient-to-r from-teal-700 to-teal-600'
              : 'bg-gradient-to-r from-rose-700 to-rose-600'
          } 
          justify-start 
          overflow-hidden 
          rounded-md 
          shadow-md 
          border-l-4 
          ${props.comment.isReservable ? 'border-teal-800' : 'border-rose-800'}
          transition-all
          duration-200
          hover:shadow-lg
          w-full
        `}
        style={{
          height: `${Math.max(height, 25)}px`, // Ensure minimum height
        }}
      >
        <button
          className='flex w-full bg-transparent px-2 py-1 hover:bg-black/10 transition-colors duration-200'
          onClick={() => props.onEventClick(props.comment.id)}
        >
          <div className='flex flex-col w-full'>
            <div className='text-left font-medium text-white text-xs'>
              {`${formatTime(startDate)}-${formatTime(endDate)}`}
            </div>
            <p className='text-left font-bold text-white text-sm truncate mt-0.5'>{props.comment.comment}</p>
          </div>
        </button>
      </div>
    </div>
  );
}
