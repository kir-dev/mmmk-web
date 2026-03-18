export default function ReservationLegend() {
  return (
    <div className='bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-4'>
      <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3'>Foglalás típusok</h3>
      <div className='grid grid-cols-2 gap-2 text-xs'>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 rounded bg-gradient-to-r from-purple-600 to-purple-400 border-l-2 border-purple-700' />
          <span className='text-slate-600 dark:text-slate-400'>Admin foglalás</span>
        </div>

        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-blue-400 border-l-2 border-blue-600' />
          <span className='text-slate-600 dark:text-slate-400'>Túlidős</span>
        </div>

        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 rounded bg-gradient-to-r from-yellow-500 to-yellow-400 border-l-2 border-yellow-600' />
          <span className='text-slate-600 dark:text-slate-400'>Szankcionált</span>
        </div>

        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 rounded bg-gradient-to-r from-green-600 to-green-500 border-l-2 border-green-700' />
          <span className='text-slate-600 dark:text-slate-400'>Banda + beengedő</span>
        </div>

        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 rounded bg-gradient-to-r from-green-400 to-green-300 border-l-2 border-green-500' />
          <span className='text-slate-600 dark:text-slate-400'>Banda (beengedő kell)</span>
        </div>

        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 rounded bg-gradient-to-r from-orange-600 to-orange-500 border-l-2 border-orange-700' />
          <span className='text-slate-600 dark:text-slate-400'>Felhasználó + beengedő</span>
        </div>

        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 rounded bg-gradient-to-r from-orange-400 to-orange-300 border-l-2 border-orange-500' />
          <span className='text-slate-600 dark:text-slate-400'>Felhasználó (beengedő kell)</span>
        </div>
      </div>
    </div>
  );
}
