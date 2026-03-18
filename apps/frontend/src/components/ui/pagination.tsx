import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';

import { PaginatedPosts } from '@/types/post';

import { Button } from './button';

export default function Pagination({
  page,
  setPage,
  posts,
}: {
  page: number;
  setPage: (page: number) => void;
  posts: PaginatedPosts;
}) {
  return (
    <div className='flex justify-center gap-2 mt-8 flex-wrap'>
      <Button className='pr-4' variant='secondary' disabled={page === 1} onClick={() => setPage(1)}>
        <ChevronFirst />
      </Button>
      <Button className='pr-4' variant='secondary' disabled={page === 1} onClick={() => setPage(page - 1)}>
        <ChevronLeft />
      </Button>
      <span className='px-2 py-2 text-sm'>
        {page}. oldal / {Math.ceil(posts.count / 10)}
      </span>
      <Button
        className='pl-4'
        variant='secondary'
        disabled={page === Math.ceil(posts.count / 10)}
        onClick={() => setPage(page + 1)}
      >
        <ChevronRight />
      </Button>
      <Button
        className='pl-4'
        variant='secondary'
        disabled={page === Math.ceil(posts.count / 10)}
        onClick={() => setPage(Math.ceil(posts.count / 10))}
      >
        <ChevronLast />
      </Button>
    </div>
  );
}
