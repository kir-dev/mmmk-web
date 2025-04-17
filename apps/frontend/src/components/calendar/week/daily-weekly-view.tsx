import { useState } from 'react';

import { Comment } from '@/types/comment';
import { Reservation } from '@/types/reservation';

import DailyViewWO from '../day/daily-view-without-date';

interface DWViewProps {
  reservations: Reservation[];
  comments: Comment[];
  onEventClick: (id: number) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export default function DWView(props: DWViewProps) {
  const dayOfWeek = new Date(
    props.currentDate.getFullYear(),
    props.currentDate.getMonth(),
    props.currentDate.getDate()
  ).getDay();

  const [firstDayOfWeek, setFirstDayOfWeek] = useState(
    new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), props.currentDate.getDay()).getDay()
  );

  const handlePreviousWeek = () => {
    props.setCurrentDate(
      new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), props.currentDate.getDate() - 7)
    );
    setFirstDayOfWeek((firstDayOfWeek + 7) % 7);
  };
  const handleNextWeek = () => {
    //if (dayOfWeek === 7 && props.currentDate.getHours() >= 20) {
    props.setCurrentDate(
      new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), props.currentDate.getDate() + 7)
    );
    setFirstDayOfWeek((firstDayOfWeek + 7) % 7);
    //}
  };

  const daysInMonth = new Date(props.currentDate.getFullYear(), props.currentDate.getMonth() + 1, 0).getDate();
  const daysInLastMonth = new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), 0).getDate();

  const getDay = (index: number) => {
    if (index === 0) {
      return '';
    }
    let res = 0;
    if (dayOfWeek >= index) {
      res = props.currentDate.getDate() - (dayOfWeek - index);
    } else {
      res = props.currentDate.getDate() + (index - dayOfWeek);
    }
    if (res > daysInMonth) {
      res = res - daysInMonth;
    } else if (res <= 0) {
      res = daysInLastMonth + res;
    }
    return res;
  };

  return (
    <div className='flex items-center justify-center'>
      <div className='bg-background shadow-lg bg-calendarBg bg-opacity-80 text-white'>
        <div className='flex items-center justify-between text-primary-foreground rounded-t-lg'>
          <button
            onClick={handlePreviousWeek}
            className='p-2 rounded-full hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground text-slate-800 dark:text-white'
          >
            <ChevronLeftIcon className='w-5 h-5' />
          </button>
          <div className='text-lg font-medium text-slate-800 dark:text-white'>
            {props.currentDate.toLocaleString('hu', { month: 'long' })} {props.currentDate.getFullYear()}{' '}
          </div>
          <button
            onClick={handleNextWeek}
            className='p-2 rounded-full hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground text-slate-800 dark:text-white'
          >
            <ChevronRightIcon className='w-5 h-5' />
          </button>
        </div>

        <div className='grid grid-cols-8'>
          {['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={day} className='flex items-center justify-center h-16 font-medium text-muted-foreground'>
              {day} {getDay(i)}
            </div>
          ))}
          <div className='grid grid-cols-subgrid'>
            {Array.from({ length: 48 }, (_, i) => (
              <div
                key={i}
                className='cursor-pointer focus:outline-none focus-visible:ring-2 h-10 focus-visible:ring-primary text-slate-800 dark:text-white border-b border-r dark:border-white py-2'
              >
                {i % 2 === 0 ? (
                  <div className='flex flex-col border-slate-800 dark:border-white border-dashed'>
                    <span className='self-start text-sm'>{i / 2}:00</span>
                  </div>
                ) : (
                  ''
                )}
              </div>
            ))}
          </div>

          {Array.from({ length: dayOfWeek }, (_, i) => i).map((_) => {
            return (
              <div
                key={_}
                className={`cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary border-b-slate-800 dark:border-white ${
                  dayOfWeek === _ + 1 ? 'text-primary-foreground font-medium font-bold font-lg' : ''
                }`}
              >
                {props.currentDate.getDate() - dayOfWeek + _ >= 0 ? (
                  <DailyViewWO
                    currentDate={
                      new Date(
                        props.currentDate.getFullYear(),
                        props.currentDate.getMonth(),
                        props.currentDate.getDate() - dayOfWeek + _ + 1
                      )
                    }
                    setCurrentDate={props.setCurrentDate}
                    reservations={props.reservations}
                    comments={props.comments}
                    onEventClick={props.onEventClick}
                  />
                ) : (
                  <DailyViewWO
                    currentDate={
                      new Date(
                        props.currentDate.getFullYear(),
                        props.currentDate.getMonth() - 1,
                        props.currentDate.getDate() - dayOfWeek + _ + daysInLastMonth + 1
                      )
                    }
                    setCurrentDate={props.setCurrentDate}
                    reservations={props.reservations}
                    comments={props.comments}
                    onEventClick={props.onEventClick}
                  />
                )}
              </div>
            );
          })}

          {Array.from({ length: 7 - dayOfWeek }, (_, i) => i + 1).map((_) => (
            <div
              key={_}
              className='cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary border-b-slate-800 dark:border-white'
              style={{ width: '14.28%' }}
            >
              {props.currentDate.getDate() + _ > daysInMonth ? (
                <DailyViewWO
                  currentDate={
                    new Date(props.currentDate.getFullYear(), props.currentDate.getMonth() + 1, dayOfWeek + _ - 1)
                  }
                  setCurrentDate={props.setCurrentDate}
                  reservations={props.reservations}
                  comments={props.comments}
                  onEventClick={props.onEventClick}
                />
              ) : (
                <DailyViewWO
                  currentDate={
                    new Date(
                      props.currentDate.getFullYear(),
                      props.currentDate.getMonth(),
                      props.currentDate.getDate() + _
                    )
                  }
                  setCurrentDate={props.setCurrentDate}
                  reservations={props.reservations}
                  comments={props.comments}
                  onEventClick={props.onEventClick}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChevronLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m15 18-6-6 6-6' />
    </svg>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m9 18 6-6-6-6' />
    </svg>
  );
}
