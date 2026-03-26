'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axiosApi from '@/lib/apiSetup';
import { Settings } from '@/types/settings';

export default function SettingsPanel() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axiosApi.get('/settings');
      setSettings(res.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      await axiosApi.patch(`/settings/${settings.id}`, {
        maxHoursPerWeek: Number(settings.maxHoursPerWeek),
        maxHoursPerDay: Number(settings.maxHoursPerDay),
        minReservationMinutes: Number(settings.minReservationMinutes),
        maxReservationMinutes: Number(settings.maxReservationMinutes),
        sanctionHourPenaltyPerPoint: Number(settings.sanctionHourPenaltyPerPoint),
        maxTotalHoursPerWeek: Number(settings.maxTotalHoursPerWeek),
        sanctionTotalHourPenaltyPerPoint: Number(settings.sanctionTotalHourPenaltyPerPoint),
        banSanctionPointThreshold: Number(settings.banSanctionPointThreshold),
      });
      toast.success('Beállítások sikeresen elmentve!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Hiba történt a mentés során.');
    }
  };

  if (loading) return <div>Betöltés...</div>;
  if (!settings) return <div>Nem sikerült betölteni a beállításokat.</div>;

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold'>Általános Beállítások</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>Heti max. óraszám (Normál)</label>
          <Input
            type='number'
            value={settings.maxHoursPerWeek}
            onChange={(e) => setSettings({ ...settings, maxHoursPerWeek: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Napi max. óraszám (Normál)</label>
          <Input
            type='number'
            value={settings.maxHoursPerDay}
            onChange={(e) => setSettings({ ...settings, maxHoursPerDay: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Normál büntetés pontonként (óra)</label>
          <Input
            type='number'
            step='0.5'
            value={settings.sanctionHourPenaltyPerPoint}
            onChange={(e) => setSettings({ ...settings, sanctionHourPenaltyPerPoint: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Abszolút heti max. óraszám (Normál+Overtime)</label>
          <Input
            type='number'
            value={settings.maxTotalHoursPerWeek}
            onChange={(e) => setSettings({ ...settings, maxTotalHoursPerWeek: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Abszolút büntetés pontonként (óra)</label>
          <Input
            type='number'
            step='0.5'
            value={settings.sanctionTotalHourPenaltyPerPoint}
            onChange={(e) => setSettings({ ...settings, sanctionTotalHourPenaltyPerPoint: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Tiltási küszöb (pontszám)</label>
          <Input
            type='number'
            value={settings.banSanctionPointThreshold}
            onChange={(e) => setSettings({ ...settings, banSanctionPointThreshold: Number(e.target.value) })}
          />
        </div>
      </div>
      <Button onClick={handleSave} className='mt-4'>
        Mentés
      </Button>
    </div>
  );
}
