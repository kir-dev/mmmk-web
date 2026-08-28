'use client';

import { AddPanel } from '@components/calendar/add-panel';
import CommentDetails from '@components/calendar/comment-details';
import ReservationDetails from '@components/calendar/reservation-details';
import { useEffect, useRef, useState } from 'react';

import axiosApi from '@/lib/apiSetup';
import { Comment } from '@/types/comment';
import { OpenedWeek } from '@/types/openedWeek';
import { Reservation } from '@/types/reservation';

import DailyView from './day/daily-view';
import { getFirstDayOfWeek } from './isReservationOvertime';
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
  const [openedWeeks, setOpenedWeeks] = useState<OpenedWeek[]>([]);
  const [isCommentDetails, setIsCommentDetails] = useState(false);
  const [clickedComment, setClickedComment] = useState<Comment>();
  const [view, setView] = useState<View>(View.Day);

  // A hetek közti gyors lépkedésnél a korábbi kérés végezhet később: csak a legutolsó válaszát vesszük.
  const latestRequest = useRef(0);

  const onGetData = () => {
    const requestId = ++latestRequest.current;
    // Csak a megjelenített hetet töltjük be, plusz egy-egy hetet mindkét irányba, hogy a heti
    // kvótaszámítás a hét szélein se essen ki az adathalmazból.
    const monday = getFirstDayOfWeek(currentDate);
    const from = new Date(monday);
    from.setDate(monday.getDate() - 7);
    const to = new Date(monday);
    to.setDate(monday.getDate() + 14);
    const params = { page: -1, page_size: -1, from: from.toISOString(), to: to.toISOString() };

    axiosApi.get('/reservations', { params }).then((res) => {
      if (requestId === latestRequest.current) setReservations(res.data.data);
    });

    axiosApi.get('/comments', { params }).then((res) => {
      if (requestId === latestRequest.current) setComments(res.data.data);
    });

    axiosApi
      .get('/opened-weeks')
      .then((res) => {
        setOpenedWeeks(res.data);
      })
      .catch(() => {});
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
  }, [currentDate]);

  return (
    <div className='w-full container mx-auto'>
      <div className='flex flex-row gap-2 mb-1'>
        <button
          className={`m-1 border-2 border-primary dark:hover:bg-primary/10 dark:text-slate-50 font-bold py-1 px-2 rounded-lg hidden md:block ${view === View.Week ? 'bg-white text-primary dark:bg-white dark:text-black dark:hover:bg-white' : ''}`}
          onClick={() => setView(View.Week)}
        >
          Heti nézet
        </button>
        <button
          className={`m-1 border-2 border-primary dark:hover:bg-primary/10 dark:text-slate-50 font-bold py-1 px-2 rounded-lg hidden md:block ${view === View.Day ? 'bg-white text-primary dark:bg-white dark:text-black dark:hover:bg-white' : ''}`}
          onClick={() => setView(View.Day)}
        >
          Napi nézet
        </button>
        <div className='w-full md:w-auto md:ml-auto flex'>
          <AddPanel onGetData={onGetData} currentDate={currentDate} reservations={reservations} />
        </div>
      </div>

      {view === View.Week ? (
        <DWView
          reservations={reservations}
          comments={comments}
          openedWeeks={openedWeeks}
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
          openedWeeks={openedWeeks}
          onEventClick={onEventClick}
          onCommentClick={onCommentClick}
          setCurrentDate={setCurrentDate}
        />
      )}

      {isReservationDetails && (
        <ReservationDetails
          isEventDetails={isReservationDetails}
          setIsEventDetails={setIsReservationDetails}
          clickedEvent={clickedReservation}
          setClickedEvent={setClickedReservation}
          onGetData={onGetData}
          reservations={reservations}
        />
      )}

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
