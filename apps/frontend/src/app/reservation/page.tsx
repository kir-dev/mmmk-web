import Calendar from '@components/calendar/calendar';

export default function ReservationPage() {
  return (
    <div className='w-full flex flex-col gap-4 main-content-scroll h-full'>
      <div className='flex items-center justify-between flex-col sm:flex-row gap-2 p-4 bg-background sticky top-0 z-10'>
        <h1 className='text-2xl font-semibold text-primary text-center sm:text-left'>Foglalások</h1>
      </div>
      <Calendar />
    </div>
  );
}
