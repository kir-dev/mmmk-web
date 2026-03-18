import React, { useState } from 'react';

import axiosApi from '@/lib/apiSetup';
import { Comment } from '@/types/comment';

interface EventDetailsProps {
  isCommentDetails: boolean;
  setIsCommentDetails: (value: boolean) => void;
  clickedComment: Comment | undefined;
  setClickedComment: (comment: Comment) => void;
  onGetData: () => void;
}

export default function CommentDetails(props: EventDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editStartTimeValue, setEditStartTimeValue] = useState<Date | null>(null);
  const [editEndTimeValue, setEditEndTimeValue] = useState<Date | null>(null);
  const [isReservable, setIsReservable] = useState<boolean>(false);

  const onDelete = () => {
    axiosApi.delete(`/comments/${props.clickedComment?.id}`).then(() => {
      props.onGetData();
      props.setIsCommentDetails(false);
    });
  };

  const onEdit = () => {
    if (isEditing && editValue !== '' && editStartTimeValue && editEndTimeValue) {
      axiosApi
        .patch(`/comments/${props.clickedComment?.id}`, {
          comment: editValue,
          startTime: editStartTimeValue.toISOString(),
          endTime: editEndTimeValue.toISOString(),
          isReservable: isReservable,
        })
        .then(() => {
          props.onGetData();
          onGetName(props.clickedComment?.id);
        });
    }
    if (!isEditing && props.clickedComment) {
      setEditValue(props.clickedComment.comment || '');
      setEditStartTimeValue(new Date(props.clickedComment.startTime));
      setEditEndTimeValue(new Date(props.clickedComment.endTime));
    }
    setIsEditing(!isEditing);
  };

  const onGetName = (id: number | undefined) => {
    if (!id) return;
    axiosApi.get(`/comments/${id}`).then((res) => {
      props.setClickedComment(res.data);
    });
  };

  if (!props.clickedComment) return null;

  return (
    <div>
      {props.isCommentDetails && (
        <div className='fixed inset-0 z-50 flex items-start justify-end p-4 bg-black/20 backdrop-blur-sm'>
          <div className='w-full max-w-md overflow-hidden bg-white dark:bg-slate-800 rounded-xl shadow-xl animate-in slide-in-from-right'>
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b dark:border-slate-700'>
              <h2 className='text-xl font-bold text-slate-800 dark:text-white'>Megjegyzés részletek</h2>
              <button
                className='p-1.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
                onClick={() => {
                  props.setIsCommentDetails(false);
                  setIsEditing(false);
                }}
              >
                <span className='sr-only'>Close</span>
                <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className='p-4 space-y-4 text-slate-700 dark:text-slate-300'>
              <div className='space-y-1'>
                <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Megjegyzés</label>
                {isEditing ? (
                  <input
                    className='w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md'
                    type='text'
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                ) : (
                  <p className='font-medium'>{props.clickedComment?.comment}</p>
                )}
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Kezdete</label>
                  {isEditing ? (
                    <input
                      className='w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md'
                      type='datetime-local'
                      value={
                        editStartTimeValue
                          ? new Date(editStartTimeValue.getTime() - editStartTimeValue.getTimezoneOffset() * 60000)
                              .toISOString()
                              .slice(0, 16)
                          : ''
                      }
                      onChange={(e) => setEditStartTimeValue(new Date(e.target.value))}
                    />
                  ) : (
                    <p className='font-medium'>
                      {new Date(props.clickedComment.startTime).getHours()}:
                      {new Date(props.clickedComment.startTime).getMinutes().toString().padStart(2, '0')}
                    </p>
                  )}
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Vége</label>
                  {isEditing ? (
                    <input
                      className='w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md'
                      type='datetime-local'
                      value={
                        editEndTimeValue
                          ? new Date(editEndTimeValue.getTime() - editEndTimeValue.getTimezoneOffset() * 60000)
                              .toISOString()
                              .slice(0, 16)
                          : ''
                      }
                      onChange={(e) => setEditEndTimeValue(new Date(e.target.value))}
                    />
                  ) : (
                    <p className='font-medium'>
                      {new Date(props.clickedComment.endTime).getHours()}:
                      {new Date(props.clickedComment.endTime).getMinutes().toString().padStart(2, '0')}
                    </p>
                  )}
                </div>
              </div>
              <div className='space-y-1'>
                {isEditing ? (
                  <>
                    <input
                      id='reservable'
                      className='h-5 w-5 text-orange-500 border-zinc-600 rounded focus:ring-orange-500 bg-zinc-700'
                      type='checkbox'
                      onChange={(e) => setIsReservable(e.target.checked)}
                      checked={isReservable}
                    />
                    <label
                      htmlFor='reservable'
                      className='ml-2 block text-sm font-medium text-black dark:text-zinc-300'
                    >
                      Foglalható
                    </label>
                  </>
                ) : (
                  <>
                    <label className='text-xs font-medium text-slate-500 dark:text-slate-400'>Foglalható</label>
                    <p className='font-medium'>{props.clickedComment?.isReservable ? 'Igen' : 'Nem'}</p>
                  </>
                )}
              </div>
            </div>

            {/* Footer with Actions */}
            <div className='p-4 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-row gap-2 justify-end'>
              <button
                className='px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors'
                onClick={onDelete}
              >
                Törlés
              </button>
              <button
                className='px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors'
                onClick={onEdit}
              >
                {isEditing ? 'Mentés' : 'Szerkesztés'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
