import axiosApi from '@/lib/apiSetup';
import { User } from '@/types/user';

export default async function getUser(id: number): Promise<User> {
  return await axiosApi.get(`/users/${id}`).then((res) => {
    return res.data;
  });
}
