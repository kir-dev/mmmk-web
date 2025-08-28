import { useEffect, useState } from 'react';

import axiosApi from '@/lib/apiSetup';
import { User } from '@/types/user';

export function useUser() {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = async () => {
    try {
      const response = await axiosApi.get('/users/me');
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return { user, refetch: fetchUser };
}
