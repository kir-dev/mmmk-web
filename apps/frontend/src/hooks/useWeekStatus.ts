import { useEffect, useState } from 'react';

import axiosApi from '@/lib/apiSetup';

interface WeekStatus {
  isOpen: boolean;
  startDate: Date;
  endDate: Date;
  loading: boolean;
}

export function useWeekStatus(date: Date = new Date()) {
  const [weekStatus, setWeekStatus] = useState<WeekStatus>({
    isOpen: true, // Default to open for backwards compatibility
    startDate: new Date(),
    endDate: new Date(),
    loading: true,
  });

  useEffect(() => {
    const checkWeekStatus = async () => {
      // Calculate week boundaries (Monday 00:00 .. next Monday 00:00)
      const dayOfWeek = (date.getDay() + 6) % 7; // Monday = 0
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - dayOfWeek);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      try {
        // The backend requires BOTH an open period covering the slot AND an open week for this
        // Monday, so mirror exactly that here to avoid showing a slot as bookable when it isn't.
        const [periodsRes, weeksRes] = await Promise.all([axiosApi.get('/periods'), axiosApi.get('/opened-weeks')]);
        const periods = periodsRes.data ?? [];
        const weeks = weeksRes.data ?? [];

        const periodOpen = periods.some((p: any) => {
          const pStart = new Date(p.startDate);
          const pEnd = new Date(p.endDate);
          return p.isOpen && pStart <= weekStart && pEnd >= weekEnd;
        });

        const weekOpen = weeks.some((w: any) => w.isOpen && new Date(w.monday).getTime() === weekStart.getTime());

        setWeekStatus({
          isOpen: periodOpen && weekOpen,
          startDate: weekStart,
          endDate: weekEnd,
          loading: false,
        });
      } catch (error) {
        // On a transient fetch error, don't hard-lock the UI; the backend remains authoritative.
        console.error('Error checking week status:', error);
        setWeekStatus({ isOpen: true, startDate: weekStart, endDate: weekEnd, loading: false });
      }
    };

    checkWeekStatus();
  }, [date]);

  return weekStatus;
}
