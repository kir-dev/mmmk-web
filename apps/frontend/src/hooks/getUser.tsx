import axios from 'axios';

import { User } from '@/types/user';

export default async function getUser(id: number): Promise<User> {
  return await axios.get(`http://localhost:3030/users/${id}`).then((res) => {
    return res.data;
  });
}
