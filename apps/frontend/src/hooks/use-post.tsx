import useSWR from 'swr';

import { PaginatedPosts } from '@/types/post';
import { axiosGetFetcher } from '@/utils/fetchers';

export default function usePosts(pageIndex: number, pageSize: number) {
  return useSWR<PaginatedPosts>(`/posts/?page=${pageIndex}&page_size=${pageSize}`, axiosGetFetcher, {
    shouldRetryOnError: false,
  });
}
