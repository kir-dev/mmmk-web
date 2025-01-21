import { useState } from 'react';

import { Event } from './event-dto';

interface WeeklyViewProps {
  events: Event[];
  onEventClick: (id: number) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export default function WeeklyView(props: WeeklyViewProps) {
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
    props.setCurrentDate(
      new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), props.currentDate.getDate() + 7)
    );
    setFirstDayOfWeek((firstDayOfWeek + 7) % 7);
  };

  const daysInMonth = new Date(props.currentDate.getFullYear(), props.currentDate.getMonth() + 1, 0).getDate();
  const daysInLastMonth = new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), 0).getDate();
  const dayOfWeek = new Date(
    props.currentDate.getFullYear(),
    props.currentDate.getMonth(),
    props.currentDate.getDate()
  ).getDay();

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='bg-background rounded-lg shadow-lg w-[1000px] bg-calendarBg bg-opacity-80 text-white'>
        <div className='flex items-center justify-between text-primary-foreground p-4 rounded-t-lg'>
          <button
            onClick={handlePreviousWeek}
            className='p-2 rounded-full hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground'
          >
            <ChevronLeftIcon className='w-5 h-5' />
          </button>
          <div className='text-lg font-medium'>
            {props.currentDate.toLocaleString('hu', { month: 'long' })} {props.currentDate.getFullYear()}{' '}
          </div>
          <button
            onClick={handleNextWeek}
            className='p-2 rounded-full hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground'
          >
            <ChevronRightIcon className='w-5 h-5' />
          </button>
        </div>
        <div className='grid grid-cols-7 p-2'>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className='flex items-center justify-center h-16 font-medium text-muted-foreground border'>
              {day}
            </div>
          ))}

          {Array.from({ length: dayOfWeek }, (_, i) => i).map((_) => {
            return (
              <div
                key={_}
                className={`h-20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary border p-2 ${
                  dayOfWeek === _ + 1 ? 'text-primary-foreground font-medium font-bold font-lg' : ''
                }`}
              >
                <div className='flex flex-col'>
                  {props.currentDate.getDate() - dayOfWeek + _ >= 0 ? (
                    <div className='flex flex-col'>
                      <span className='self-end'>{props.currentDate.getDate() - dayOfWeek + _ + 1}</span>
                      <div className='flex flex-col items-center self-start'>
                        <div className='bg-transparent overflow-auto scrollbar-webkit max-h-12 max-w-28'>
                          {props.events.map((event) => {
                            const day = props.currentDate.getDate() - dayOfWeek + _ + 1;
                            const eventStartDate = new Date(event.startDate);
                            const eventEndDate = new Date(event.endDate);
                            if (
                              eventStartDate.getDate() <= day &&
                              eventEndDate.getDate() >= day &&
                              eventStartDate.getMonth() <= props.currentDate.getMonth() &&
                              eventEndDate.getMonth() >= props.currentDate.getMonth() &&
                              eventStartDate.getFullYear() === props.currentDate.getFullYear()
                            ) {
                              return (
                                <button
                                  key={event.id}
                                  className='mt-1 bg-transparent rounded px-1 min-w-28 max-w-fit hover:bg-eventHover flex flex-col'
                                  onClick={() => props.onEventClick(event.id)}
                                >
                                  <p className='self-start'>~ {event.name}</p>
                                </button>
                              );
                            }
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className='self-end'>
                      {props.currentDate.getDate() - dayOfWeek + _ + daysInLastMonth + 1}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {Array.from({ length: 7 - dayOfWeek }, (_, i) => i + 1).map((_) => (
            <div
              key={_}
              className='h-20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary border p-2'
            >
              <div className='flex flex-col'>
                {props.currentDate.getDate() + _ > daysInMonth ? (
                  <div>
                    <span className='self-end'>{props.currentDate.getDate() + _ - daysInMonth}</span>
                    <div className='flex flex-col items-center self-start'>
                      <div className='bg-transparent overflow-auto scrollbar-webkit max-h-12 max-w-28'>
                        {props.events.map((event) => {
                          const day = props.currentDate.getDate() - dayOfWeek + _ + 1;
                          const eventStartDate = new Date(event.startDate);
                          const eventEndDate = new Date(event.endDate);
                          if (
                            eventStartDate.getDate() <= day &&
                            eventEndDate.getDate() >= day &&
                            eventStartDate.getMonth() <= props.currentDate.getMonth() &&
                            eventEndDate.getMonth() >= props.currentDate.getMonth() &&
                            eventStartDate.getFullYear() === props.currentDate.getFullYear()
                          ) {
                            return (
                              <button
                                key={event.id}
                                className='mt-1 bg-transparent rounded px-1 min-w-28 max-w-fit hover:bg-eventHover flex flex-col'
                                onClick={() => props.onEventClick(event.id)}
                              >
                                {event.name}
                              </button>
                            );
                          }
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col'>
                    <span className='self-end'>{props.currentDate.getDate() + _}</span>
                    <div className='flex flex-col items-center self-start'>
                      <div className='bg-transparent overflow-auto scrollbar-webkit max-h-12 max-w-28'>
                        {props.events.map((event) => {
                          const day = props.currentDate.getDate() + _;
                          const eventStartDate = new Date(event.startDate);
                          const eventEndDate = new Date(event.endDate);
                          if (
                            eventStartDate.getDate() <= day &&
                            eventEndDate.getDate() >= day &&
                            eventStartDate.getMonth() <= props.currentDate.getMonth() &&
                            eventEndDate.getMonth() >= props.currentDate.getMonth() &&
                            eventStartDate.getFullYear() === props.currentDate.getFullYear()
                          ) {
                            return (
                              <button
                                key={event.id}
                                className='mt-1 bg-transparent rounded px-1 min-w-28 max-w-fit hover:bg-eventHover flex flex-col'
                                onClick={() => props.onEventClick(event.id)}
                              >
                                <p className='self-start'>~ {event.name}</p>
                              </button>
                            );
                          }
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
