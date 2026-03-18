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
      try {
        // Calculate week boundaries
        const dayOfWeek = (date.getDay() + 6) % 7; // Monday = 0
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - dayOfWeek);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);

        // Try to fetch period status from backend
        try {
          const periodsRes = await axiosApi.get('/periods');
          const periods = periodsRes.data;

          // Find period that matches this week
          const matchingPeriod = periods.find((p: any) => {
            const pStart = new Date(p.startDate);
            const pEnd = new Date(p.endDate);
            return pStart <= weekStart && pEnd >= weekEnd;
          });

          setWeekStatus({
            isOpen: matchingPeriod?.isOpen ?? true, // Default to open if no period found
            startDate: weekStart,
            endDate: weekEnd,
            loading: false,
          });
        } catch (e) {
          // Periods endpoint might not exist yet, default to open
          setWeekStatus({
            isOpen: true,
            startDate: weekStart,
            endDate: weekEnd,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Error checking week status:', error);
        setWeekStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    checkWeekStatus();
  }, [date]);

  return weekStatus;
}
