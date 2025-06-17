'use client';

import { Input } from '@components/ui/input';
import { useEffect, useState } from 'react';

import MemberTile from '@/components/member/memberTile';
import { mockUsers } from '@/mocks/users';

export default function Members() {
  const data = mockUsers;
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilteredData(data.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm]);

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between flex-row p-4'>
        <h1 className='text-2xl font-semibold text-primary'>Felhasználók</h1>
        <Input
          placeholder='Keresés...'
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className='max-w-sm target:ring-0'
        />
      </div>
      {filteredData.length ? (
        <div className='grid gap-4 py-4 auto-rows-fr grid-cols-[repeat(auto-fit,minmax(240px,1fr))]'>
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
