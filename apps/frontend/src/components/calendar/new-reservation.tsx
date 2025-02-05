'use client';

import { format } from 'date-fns';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Booking {
  id: number;
  date: Date;
  name: string;
  description: string;
}

// Sample list of names for autocomplete
const sampleNames = [
  'Anna Kovács',
  'Béla Nagy',
  'Csilla Tóth',
  'Dániel Szabó',
  'Eszter Kiss',
  'Ferenc Horváth',
  'Gábor Varga',
  'Hajnalka Molnár',
  'István Németh',
  'Judit Balogh',
];

export default function BookingSystem() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value.length > 0) {
      const filteredSuggestions = sampleNames.filter((sampleName) =>
        sampleName.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setName(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && name) {
      const newBooking: Booking = {
        id: Date.now(),
        date: selectedDate,
        name,
        description,
      };
      setBookings([...bookings, newBooking]);
      setName('');
      setDescription('');
    }
  };

  const handleDelete = (id: number) => {
    setBookings(bookings.filter((booking) => booking.id !== id));
  };

  return (
    <div className='min-h-screen bg-zinc-900 text-zinc-100 p-4'>
      <Card className='container mx-auto max-w-4xl bg-zinc-800 shadow-lg'>
        <CardHeader>
          <CardTitle className='text-3xl font-bold text-orange-500'>Foglalási rendszer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <Calendar
                mode='single'
                selected={selectedDate}
                onSelect={handleDateSelect}
                className='rounded-md border border-zinc-700 bg-zinc-800 text-zinc-100'
              />
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='relative'>
                  <Label htmlFor='name' className='text-zinc-300'>
                    Név
                  </Label>
                  <Input
                    id='name'
                    value={name}
                    onChange={handleNameChange}
                    required
                    className='bg-zinc-700 border-zinc-600 text-zinc-100'
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div
                      ref={suggestionRef}
                      className='absolute z-10 w-full mt-1 bg-zinc-700 border border-zinc-600 rounded-md shadow-lg'
                    >
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className='px-4 py-2 cursor-pointer hover:bg-zinc-600'
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor='description' className='text-zinc-300'>
                    Leírás
                  </Label>
                  <Input
                    id='description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='bg-zinc-700 border-zinc-600 text-zinc-100'
                  />
                </div>
                <Button type='submit' className='w-full bg-orange-500 hover:bg-orange-600 text-zinc-900 font-semibold'>
                  Foglalás hozzáadása
                </Button>
              </form>
            </div>
            <div>
              <h2 className='text-2xl font-semibold mb-4 text-orange-500'>Foglalások</h2>
              <ul className='space-y-3'>
                {bookings.map((booking) => (
                  <li key={booking.id} className='flex justify-between items-center bg-zinc-700 p-3 rounded-lg'>
                    <span className='text-zinc-100'>
                      {format(booking.date, 'yyyy-MM-dd')} - {booking.name}
                      {booking.description && <span className='text-zinc-400 ml-2'>: {booking.description}</span>}
                    </span>
                    <Button
                      variant='destructive'
                      onClick={() => handleDelete(booking.id)}
                      className='bg-red-500 hover:bg-red-600 text-zinc-100'
                    >
                      Törlés
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
