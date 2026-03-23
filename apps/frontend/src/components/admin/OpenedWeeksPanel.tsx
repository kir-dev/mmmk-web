'use client';

import { useEffect, useState } from 'react';

import { getFirstDayOfWeek } from '@/components/calendar/isReservationOvertime';
import { Button } from '@/components/ui/button';
import axiosApi from '@/lib/apiSetup';
import { OpenedWeek } from '@/types/openedWeek';

export default function OpenedWeeksPanel() {
  const [weeks, setWeeks] = useState<OpenedWeek[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeeks();
  }, []);

  const fetchWeeks = async () => {
    try {
      const res = await axiosApi.get('/opened-weeks');
      setWeeks(res.data);
    } catch (error) {
      console.error('Failed to fetch opened weeks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWeek = async (monday: Date, currentStatus: boolean) => {
    try {
      await axiosApi.put('/opened-weeks', {
        monday: monday.toISOString(),
        isOpen: !currentStatus,
      });
      fetchWeeks();
    } catch (error) {
      console.error('Failed to toggle week:', error);
    }
  };

  // Generate upcoming weeks to display (e.g. 10 weeks ahead)
  const renderUpcomingWeeks = () => {
    const list = [];
    const today = new Date();
    const currentMonday = getFirstDayOfWeek(today);

    for (let i = -1; i < 10; i++) {
      const weekDate = new Date(currentMonday);
      weekDate.setDate(currentMonday.getDate() + i * 7);

      const existingWeek = weeks.find((w) => new Date(w.monday).getTime() === weekDate.getTime());
      const isOpen = existingWeek ? existingWeek.isOpen : false;

      const weekEnd = new Date(weekDate);
      weekEnd.setDate(weekDate.getDate() + 6);

      list.push(
        <div key={weekDate.toISOString()} className='flex items-center justify-between p-3 border rounded shadow-sm'>
          <div>
            <span className='font-medium'>
              {weekDate.toLocaleDateString('hu-HU')} - {weekEnd.toLocaleDateString('hu-HU')}
            </span>
            <span
              className={`ml-4 px-2 py-1 rounded text-xs ${isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {isOpen ? 'Nyitva' : 'Zárva'}
            </span>
          </div>
          <Button variant={isOpen ? 'outline' : 'default'} onClick={() => handleToggleWeek(weekDate, isOpen)}>
            {isOpen ? 'Bezárás' : 'Megnyitás'}
          </Button>
        </div>
      );
    }

    return list;
  };

  if (loading) return <div>Betöltés...</div>;

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold'>Hetek Megnyitása</h2>
      <p className='text-muted-foreground'>Itt nyithatod meg a jövőbeli heteket, hogy lehessen rájuk foglalni.</p>

      <div className='space-y-2'>{renderUpcomingWeeks()}</div>
    </div>
  );
}
