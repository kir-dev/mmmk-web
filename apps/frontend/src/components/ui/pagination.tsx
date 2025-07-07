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
    <div className='flex justify-center gap-2 mt-8'>
      <Button className='pr-5' variant='secondary' disabled={page === 1} onClick={() => setPage(1)}>
        <ChevronFirst />
        Első
      </Button>
      <Button className='pr-5' variant='secondary' disabled={page === 1} onClick={() => setPage(page - 1)}>
        <ChevronLeft />
        Előző
      </Button>
      <span className='px-2 py-1'>
        {page}. oldal / {Math.ceil(posts.count / 10)}
      </span>
      <Button
        className='pl-5'
        variant='secondary'
        disabled={page === Math.ceil(posts.count / 10)}
        onClick={() => setPage(page + 1)}
      >
        Következő <ChevronRight />
      </Button>
      <Button
        className='pl-5'
        variant='secondary'
        disabled={page === Math.ceil(posts.count / 10)}
        onClick={() => setPage(Math.ceil(posts.count / 10))}
      >
        Utolsó <ChevronLast />
      </Button>
    </div>
  );
}
