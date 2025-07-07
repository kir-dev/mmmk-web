import { axiosGetFetcher } from '@/utils/fetchers';

export default function GetPosts(num: number, page: number) {
  return axiosGetFetcher(`/posts?page=${page}&pageSize=${num}`);
}
