'use client';

import { AddPanel } from '@components/calendar/add-panel';
import CommentDetails from '@components/calendar/comment-details';
import ReservationDetails from '@components/calendar/reservation-details';
import { useEffect, useState } from 'react';

import axiosApi from '@/lib/apiSetup';
import { Comment } from '@/types/comment';
import { Reservation } from '@/types/reservation';

import DailyView from './day/daily-view';
//import MonthlyView from './month/monthly-view';
import DWView from './week/daily-weekly-view';

export enum View {
  Month,
  Week,
  Day,
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isReservationDetails, setIsReservationDetails] = useState(false);
  const [clickedReservation, setClickedReservation] = useState<Reservation>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentDetails, setIsCommentDetails] = useState(false);
  const [clickedComment, setClickedComment] = useState<Comment>();
  const [view, setView] = useState<View>(View.Day);

  const onGetData = () => {
    axiosApi
      .get('/reservations', {
        params: {
          page: 1,
          page_size: 168,
          limit: 168,
        },
      })
      .then((res) => {
        setReservations(res.data.data);
      });

    axiosApi
      .get('/comments', {
        params: {
          page: 1,
          page_size: 168,
          limit: 168,
        },
      })
      .then((res) => {
        setComments(res.data.data);
      });
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
    <div className='w-full container mx-auto'>
      <div className='flex flex-row gap-2'>
        <button
          className={`m - 1 border-2 border-orange-500 dark:hover:bg-orange-500 dark:text-slate-50 font-bold py-1 px-2 rounded-lg hidden md:block ${view === View.Week ? 'bg-orange-500 text-slate-50 dark:bg-orange-600' : ''}`}
          onClick={() => setView(View.Week)}
        >
          Heti nézet
        </button>
        <button
          className={`m - 1 border-2 border-orange-500 dark:hover:bg-orange-500 dark:text-slate-50 font-bold py-1 px-2 rounded-lg ${view === View.Day ? 'bg-orange-500 text-slate-50 dark:bg-orange-600' : ''}`}
          onClick={() => setView(View.Day)}
        >
          Napi nézet
        </button>
        <div className='ml-auto'>
          <AddPanel onGetData={onGetData} currentDate={currentDate} reservations={reservations} />
        </div>
      </div>

      {view === View.Week ? (
        <DWView
          reservations={reservations}
          comments={comments}
          onEventClick={onEventClick}
          onCommentClick={onCommentClick}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
      ) : (
        <DailyView
          currentDate={currentDate}
          reservations={reservations}
          comments={comments}
          onEventClick={onEventClick}
          onCommentClick={onCommentClick}
          setCurrentDate={setCurrentDate}
        />
      )}

      <ReservationDetails
        isEventDetails={isReservationDetails}
        setIsEventDetails={setIsReservationDetails}
        clickedEvent={clickedReservation}
        setClickedEvent={setClickedReservation}
        onGetData={onGetData}
        reservations={reservations}
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
