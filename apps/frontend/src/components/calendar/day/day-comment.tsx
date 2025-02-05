import { Comment } from '@/types/comment';

interface DayEventProps {
  comment: Comment;
  onEventClick: (id: number) => void;
}

export default function DayComment(props: DayEventProps) {
  const startDate = new Date(props.comment.startTime);
  const endDate = new Date(props.comment.endTime);

  const offset = (startDate.getMinutes() / 60) * 39;
  return (
    <div
      className='z-40 absolute'
      style={{
        top: `${offset}px`,
      }}
    >
      <div
        className={`flex flex-row ${props.comment.isReservable ? 'bg-green-800' : 'bg-red-700'} justify-start max-w-[140px] overflow-auto scrollbar-webkit rounded-md`}
        style={{
          height: `${(endDate.getHours() - startDate.getHours() + (endDate.getMinutes() - startDate.getMinutes()) / 60) * 78}px`,
        }}
      >
        <div className='bg-white w-[3px]' />
        <button
          className='flex bg-transparent rounded px-1 max-w-max hover:bg-eventHover'
          onClick={() => props.onEventClick(props.comment.id)}
        >
          <div className='flex flex-col'>
            <div className='self-start text-left'>
              {`${startDate.getHours()}:${startDate.getMinutes().toString().padStart(2, '0')}-${endDate.getHours()}:${endDate.getMinutes().toString().padStart(2, '0')}`}
            </div>
            <p className='self-start'>{props.comment.comment}</p>
          </div>
        </button>
      </div>
    </div>
  );
}
