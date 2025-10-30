import Calendar from '@components/calendar/calendar';

export default function ReservationPage() {
  return (
    <div className='w-full main-content-scroll h-full'>
      <div className='flex items-center justify-between flex-row p-4 bg-background sticky top-0 z-10'>
        <h1 className='text-2xl font-semibold text-primary'>Foglalások</h1>
      </div>
      <div className='p-4'>
        <Calendar />
      </div>
    </div>
  );
}
