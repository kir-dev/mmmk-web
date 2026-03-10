'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminConfig } from '@/hooks/useAdminConfig';
import { SanctionTierInput } from '@/types/admin';

export function ReservationLimitsForm() {
  const { config, loading, update } = useAdminConfig();
  const [saving, setSaving] = useState(false);

  const [userDailyHours, setUserDailyHours] = useState('');
  const [userWeeklyHours, setUserWeeklyHours] = useState('');
  const [bandDailyHours, setBandDailyHours] = useState('');
  const [bandWeeklyHours, setBandWeeklyHours] = useState('');
  const [tiers, setTiers] = useState<SanctionTierInput[]>([]);

  useEffect(() => {
    if (config) {
      setUserDailyHours(String(config.userDailyHours));
      setUserWeeklyHours(String(config.userWeeklyHours));
      setBandDailyHours(String(config.bandDailyHours));
      setBandWeeklyHours(String(config.bandWeeklyHours));
      setTiers(
        config.sanctionTiers.map(({ minPoints, userDailyHours, userWeeklyHours, bandDailyHours, bandWeeklyHours }) => ({
          minPoints,
          userDailyHours,
          userWeeklyHours,
          bandDailyHours,
          bandWeeklyHours,
        }))
      );
    }
  }, [config]);

  const addTier = () => {
    setTiers((prev) => [
      ...prev,
      { minPoints: 0, userDailyHours: 2, userWeeklyHours: 4, bandDailyHours: 3, bandWeeklyHours: 6 },
    ]);
  };

  const removeTier = (index: number) => {
    setTiers((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTierField = (index: number, field: keyof SanctionTierInput, value: string) => {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) return;
    setTiers((prev) => prev.map((tier, i) => (i === index ? { ...tier, [field]: parsed } : tier)));
  };

  const handleSave = async () => {
    setSaving(true);
    await update({
      userDailyHours: parseFloat(userDailyHours),
      userWeeklyHours: parseFloat(userWeeklyHours),
      bandDailyHours: parseFloat(bandDailyHours),
      bandWeeklyHours: parseFloat(bandWeeklyHours),
      sanctionTiers: tiers,
    });
    setSaving(false);
  };

  if (loading) {
    return <p className='text-sm text-muted-foreground'>Konfiguráció betöltése...</p>;
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-1'>
          <label className='text-sm font-medium'>Felhasználó – napi max. óra</label>
          <Input
            type='number'
            min='0'
            step='0.5'
            value={userDailyHours}
            onChange={(e) => setUserDailyHours(e.target.value)}
          />
        </div>
        <div className='space-y-1'>
          <label className='text-sm font-medium'>Felhasználó – heti max. óra</label>
          <Input
            type='number'
            min='0'
            step='0.5'
            value={userWeeklyHours}
            onChange={(e) => setUserWeeklyHours(e.target.value)}
          />
        </div>
        <div className='space-y-1'>
          <label className='text-sm font-medium'>Zenekar – napi max. óra</label>
          <Input
            type='number'
            min='0'
            step='0.5'
            value={bandDailyHours}
            onChange={(e) => setBandDailyHours(e.target.value)}
          />
        </div>
        <div className='space-y-1'>
          <label className='text-sm font-medium'>Zenekar – heti max. óra</label>
          <Input
            type='number'
            min='0'
            step='0.5'
            value={bandWeeklyHours}
            onChange={(e) => setBandWeeklyHours(e.target.value)}
          />
        </div>
      </div>

      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold'>Szankciópont-küszöbök</h3>
          <Button size='sm' variant='outline' onClick={addTier}>
            + Küszöb hozzáadása
          </Button>
        </div>

        {tiers.length === 0 && (
          <p className='text-sm text-muted-foreground'>Nincsenek szankciópont-küszöbök beállítva.</p>
        )}

        {tiers.map((tier, index) => (
          <div key={index} className='rounded-md border p-4 space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Küszöb #{index + 1}</span>
              <Button size='sm' variant='destructive' onClick={() => removeTier(index)}>
                Törlés
              </Button>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='col-span-2 space-y-1'>
                <label className='text-xs text-muted-foreground'>Min. szankciópont</label>
                <Input
                  type='number'
                  min='0'
                  value={tier.minPoints}
                  onChange={(e) => updateTierField(index, 'minPoints', e.target.value)}
                />
              </div>
              <div className='space-y-1'>
                <label className='text-xs text-muted-foreground'>Felhasználó – napi óra</label>
                <Input
                  type='number'
                  min='0'
                  step='0.5'
                  value={tier.userDailyHours}
                  onChange={(e) => updateTierField(index, 'userDailyHours', e.target.value)}
                />
              </div>
              <div className='space-y-1'>
                <label className='text-xs text-muted-foreground'>Felhasználó – heti óra</label>
                <Input
                  type='number'
                  min='0'
                  step='0.5'
                  value={tier.userWeeklyHours}
                  onChange={(e) => updateTierField(index, 'userWeeklyHours', e.target.value)}
                />
              </div>
              <div className='space-y-1'>
                <label className='text-xs text-muted-foreground'>Zenekar – napi óra</label>
                <Input
                  type='number'
                  min='0'
                  step='0.5'
                  value={tier.bandDailyHours}
                  onChange={(e) => updateTierField(index, 'bandDailyHours', e.target.value)}
                />
              </div>
              <div className='space-y-1'>
                <label className='text-xs text-muted-foreground'>Zenekar – heti óra</label>
                <Input
                  type='number'
                  min='0'
                  step='0.5'
                  value={tier.bandWeeklyHours}
                  onChange={(e) => updateTierField(index, 'bandWeeklyHours', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handleSave} disabled={saving} className='w-full'>
        {saving ? 'Mentés...' : 'Mentés'}
      </Button>
    </div>
  );
}
