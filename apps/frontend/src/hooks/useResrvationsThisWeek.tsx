import axios from 'axios';
import { useEffect, useState } from 'react';

import { Reservation } from '@/types/reservation';

export function useReservationsThisWeek(start: Date) {
  const [reservationsThisWeek, setReservationsThisWeek] = useState<Reservation[]>([]);

  useEffect(() => {
    const startOfWeek = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getDate();

    axios
      .get('http://localhost:3030/reservations', {
        params: {
          page: 1,
          page_size: 10,
          limit: 10,
        },
      })
      .then((res) => {
        setReservationsThisWeek(res.data.data);
      });
  }, [start]);

  return reservationsThisWeek;
}
