import axios from 'axios';
import { useState } from 'react';

import { Comment } from '@/types/comment';

const url = 'http://localhost:3030/comments';

interface EventDetailsProps {
  isCommentDetails: boolean;
  setIsCommentDetails: (value: boolean) => void;
  clickedComment: Comment;
  setClickedComment: (comment: Comment) => void;
  onGetData: () => void;
}

export default function CommentDetails(props: EventDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const onDelete = () => {
    axios.delete(`${url}/${props.clickedComment?.id}`).then(() => {
      props.onGetData();
      props.setIsCommentDetails(!props.isCommentDetails);
    });
  };

  const onEdit = () => {
    if (editValue !== '') {
      if (isEditing) {
        axios.patch(`${url}/${props.clickedComment?.id}`, { name: editValue }).then(() => {
          props.onGetData();
          onGetName(props.clickedComment?.id);
        });
      }
    }
    setEditValue(props.clickedComment?.name);
    setIsEditing(!isEditing);
  };

  const onGetName = (id: number) => {
    axios.get(`${url}/${id}`).then((res) => {
      props.setClickedComment(res.data);
    });
  };

  return (
    <div>
      {props.isCommentDetails ? (
        <div className='flex flex-col fixed top-32 right-0 bg-white dark:bg-slate-800 rounded-lg border-2 border-black dark:border-orange-500 p-6 w-full max-w-sm overflow-auto mr-5 text-gray-400 z-10'>
          <div className='flex flex-col items-center justify-between mb-4'>
            <button
              className='self-end border-2 border-black bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg'
              onClick={() => {
                props.setIsCommentDetails(!props.isCommentDetails);
                setIsEditing(false);
              }}
            >
              X
            </button>
            <h2 className='text-lg font-semibold self-start'>Event details</h2>
          </div>
          <div className='grid gap-4 self-start'>
            <p className=''>
              Name:{' '}
              {isEditing ? (
                <input
                  className='self-start mt-10 border-2 border-black rounded-lg p-2 max-w-fit'
                  type='text'
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              ) : (
                <span>{props.clickedComment?.comment}</span>
              )}
            </p>
            <p>Start time: {new Date(props.clickedComment.startTime).toLocaleTimeString()}</p>
            <p>End time: {new Date(props.clickedComment.endTime).toLocaleTimeString()}</p>
            <p>Status: {props.clickedComment?.isReservable}</p>
          </div>
          <button
            className='self-end border-2 border-black bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg'
            onClick={() => onDelete()}
          >
            Delete
          </button>
          <button
            className='mt-2 self-end border-2 border-black bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-lg'
            onClick={onEdit}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
