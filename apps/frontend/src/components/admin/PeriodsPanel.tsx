/* eslint-disable no-alert */
'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axiosApi from '@/lib/apiSetup';
import { Period } from '@/types/period';

export default function PeriodsPanel() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    try {
      const res = await axiosApi.get('/periods');
      setPeriods(res.data);
    } catch (error) {
      console.error('Failed to fetch periods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOpen = async (period: Period) => {
    try {
      await axiosApi.patch(`/periods/${period.id}`, { isOpen: !period.isOpen });
      fetchPeriods();
    } catch (error) {
      console.error('Failed to update period:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Biztosan törlöd ezt az időszakot?')) return;
    try {
      await axiosApi.delete(`/periods/${id}`);
      fetchPeriods();
    } catch (error) {
      console.error('Failed to delete period:', error);
    }
  };

  const handleCreate = async () => {
    if (!newStart || !newEnd) return;
    try {
      await axiosApi.post('/periods', {
        startDate: new Date(newStart).toISOString(),
        endDate: new Date(newEnd).toISOString(),
        isOpen: false,
      });
      setNewStart('');
      setNewEnd('');
      fetchPeriods();
    } catch (error) {
      console.error('Failed to create period:', error);
    }
  };

  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString('hu-HU');
  };

  if (loading) return <div>Betöltés...</div>;

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold'>Időszakok (Félévek) Kezelése</h2>

      <div className='bg-slate-50 dark:bg-slate-800 p-4 rounded-lg'>
        <h3 className='font-semibold mb-2'>Új időszak hozzáadása</h3>
        <div className='flex gap-4 items-end'>
          <div>
            <label className='block text-sm mb-1'>Kezdés</label>
            <Input type='date' value={newStart} onChange={(e) => setNewStart(e.target.value)} />
          </div>
          <div>
            <label className='block text-sm mb-1'>Befejezés</label>
            <Input type='date' value={newEnd} onChange={(e) => setNewEnd(e.target.value)} />
          </div>
          <Button onClick={handleCreate}>Hozzáadás</Button>
        </div>
      </div>

      <div className='space-y-2'>
        {periods.map((period) => (
          <div key={period.id} className='flex items-center justify-between p-3 border rounded shadow-sm'>
            <div>
              <span className='font-medium'>
                {formatDate(period.startDate)} - {formatDate(period.endDate)}
              </span>
              <span
                className={`ml-4 px-2 py-1 rounded text-xs ${period.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {period.isOpen ? 'Nyitva' : 'Zárva'}
              </span>
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => handleToggleOpen(period)}>
                {period.isOpen ? 'Bezárás' : 'Megnyitás'}
              </Button>
              <Button variant='destructive' onClick={() => handleDelete(period.id)}>
                Törlés
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
