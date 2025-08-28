'use client';

import { Input } from '@components/ui/input';
import { useEffect, useState } from 'react';

import MemberTile from '@/components/member/member-tile';
import { mockUsers } from '@/mocks/users';

export default function Members() {
  const data = mockUsers; //TODO: replace with real data
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilteredData(data.filter((user) => user.fullName.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm]);

  return (
    <div className='w-full overflow-y-auto'>
      <div className='flex items-center justify-between flex-row p-4 sticky top-0 bg-background z-10'>
        <h1 className='text-2xl font-semibold text-primary'>Felhasználók</h1>
        <Input
          placeholder='Keresés...'
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className='max-w-sm target:ring-0'
        />
      </div>
      {filteredData.length ? (
        <div className='grid gap-4 py-4 auto-rows-fr grid-cols-[repeat(auto-fill,minmax(228px,228px))] justify-center'>
          {filteredData.map((user) => (
            <MemberTile user={user} key={user.id} />
          ))}
        </div>
      ) : (
        <div className='h-24 flex items-center justify-center text-center'>Nincs találat.</div>
      )}
    </div>
  );
}
