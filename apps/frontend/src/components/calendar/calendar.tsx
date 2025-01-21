'use client';

import { AddEvent } from '@components/calendar/add-event';
import CommentDetails from '@components/calendar/comment-details';
import ReservationDetails from '@components/calendar/reservation-details';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { Comment } from '@/types/comment';
import { Reservation } from '@/types/reservation';

import DailyView from './day/daily-view';
import MonthlyView from './month/monthly-view';
import DWView from './week/daily-weekly-view';

const url = 'http://localhost:3001/reservations';

export enum View {
  Month,
  Week,
  Day,
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<(Reservation | Comment)[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isReservationDetails, setIsReservationDetails] = useState(false);
  const [clickedReservation, setClickedReservation] = useState<Reservation>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentDetails, setIsCommentDetails] = useState(false);
  const [clickedComment, setClickedComment] = useState<Comment>();
  const [view, setView] = useState<View>(View.Month);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const onGetData = () => {
    axios
      .get(url, {
        params: {
          page: 1,
          page_size: 10,
          limit: 10,
        },
      })
      .then((res) => {
        setReservations(res.data.data);
      });

    axios
      .get('http://localhost:3001/comments', {
        params: {
          page: 1,
          page_size: 10,
          limit: 10,
        },
      })
      .then((res) => {
        setComments(res.data.data);
      });
    const eventArray: (Reservation | Comment)[] = reservations.concat(comments);
    setEvents(eventArray);
  };

  const onEventClick = (id: number) => {
    setIsReservationDetails(!isReservationDetails);
    setClickedReservation(reservations.find((event) => event.id === id));
  };

  const onCommentClick = (id: number) => {
    setIsCommentDetails(!isCommentDetails);
    setClickedComment(comments.find((comment) => comment.id === id));
  };

  useEffect(() => {
    onGetData();
  }, []);

  return (
    <div className='bg-hero-pattern'>
      <div className='flex flex-row'>
        <div className='self-center'>
          <button
            className='m-1 border-2 border-orange-500 dark:bg-orange-600 dark:hover:bg-orange-500 dark:text-slate-50 font-bold py-1 px-2 rounded-lg'
            onClick={() => setView(View.Month)}
          >
            Month
          </button>
          <button
            className='m-1 border-2 border-orange-500 dark:bg-orange-600 dark:hover:bg-orange-500 dark:text-slate-50 font-bold py-1 px-2 rounded-lg'
            onClick={() => setView(View.Week)}
          >
            Week
          </button>
          <button
            className='m-1 border-2 border-orange-500 dark:bg-orange-600 dark:hover:bg-orange-500 dark:text-slate-50 font-bold py-1 px-2 rounded-lg'
            onClick={() => setView(View.Day)}
          >
            Day
          </button>
        </div>
        <div className='ml-auto'>
          <AddEvent
            onGetData={onGetData}
            currentDate={currentDate}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </div>
      </div>

      {view === View.Month ? (
        <MonthlyView
          currentDate={currentDate}
          reservations={reservations}
          onEventClick={onEventClick}
          setCurrentDate={setCurrentDate}
          comments={comments}
        />
      ) : (
        ''
      )}
      {view === View.Week ? (
        <DWView
          reservations={reservations}
          comments={comments}
          onEventClick={onEventClick}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
      ) : (
        ''
      )}
      {view === View.Day ? (
        <DailyView
          currentDate={currentDate}
          reservations={reservations}
          comments={comments}
          onEventClick={onEventClick}
          setCurrentDate={setCurrentDate}
        />
      ) : (
        ''
      )}

      <ReservationDetails
        isEventDetails={isReservationDetails}
        setIsEventDetails={setIsReservationDetails}
        clickedEvent={clickedReservation}
        setClickedEvent={setClickedReservation}
        onGetData={onGetData}
      />

      <CommentDetails
        isCommentDetails={isCommentDetails}
        setIsCommentDetails={setIsCommentDetails}
        clickedComment={clickedComment}
        setClickedComment={setClickedComment}
        onGetData={onGetData}
      />
    </div>
  );
}
