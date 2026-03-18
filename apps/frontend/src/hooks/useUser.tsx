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
      let me: any = response.data;

      // Try to enrich with club membership if not present
      if (!me?.clubMembership && me?.id) {
        try {
          const membershipsRes = await axiosApi.get('/memberships');
          const memberships: any[] = Array.isArray(membershipsRes.data)
            ? membershipsRes.data
            : membershipsRes.data?.memberships || [];
          const cm = memberships.find((m: any) => m.userId === me.id);
          if (cm) {
            me = { ...me, clubMembership: cm };
          }
        } catch (e) {
          // Ignore membership enrichment errors; keep base user
        }
      }

      setUser(me as User);
    } catch (error) {
      console.error(error);
    }
  };

  return { user, refetch: fetchUser };
}
