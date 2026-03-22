'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { withAdminAuth } from '@/utils/withAuth';

import OpenedWeeksPanel from './components/OpenedWeeksPanel';
import PeriodsPanel from './components/PeriodsPanel';
import SettingsPanel from './components/SettingsPanel';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'settings' | 'periods' | 'weeks'>('settings');

  return (
    <div className='container mx-auto p-8'>
      <h1 className='text-3xl font-bold mb-6'>Admin Dashboard</h1>

      <div className='flex gap-4 mb-8 border-b pb-4'>
        <Button variant={activeTab === 'settings' ? 'default' : 'outline'} onClick={() => setActiveTab('settings')}>
          Általános Beállítások
        </Button>
        <Button variant={activeTab === 'periods' ? 'default' : 'outline'} onClick={() => setActiveTab('periods')}>
          Időszakok (Félévek)
        </Button>
        <Button variant={activeTab === 'weeks' ? 'default' : 'outline'} onClick={() => setActiveTab('weeks')}>
          Hetek Megnyitása
        </Button>
      </div>

      <div className='bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md border dark:border-slate-800'>
        {activeTab === 'settings' && <SettingsPanel />}
        {activeTab === 'periods' && <PeriodsPanel />}
        {activeTab === 'weeks' && <OpenedWeeksPanel />}
      </div>
    </div>
  );
}

// Protect this page - only ADMIN role can access
export default withAdminAuth(AdminDashboard);
