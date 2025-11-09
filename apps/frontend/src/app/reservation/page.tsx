import Calendar from '@components/calendar/calendar';

export default function ReservationPage() {
  return (
    <div className='w-full flex flex-col gap-4'>
      <h1 className='font-bold text-orange-600 text-3xl'>Foglalások</h1>
      <Calendar />
    </div>
  );
}
