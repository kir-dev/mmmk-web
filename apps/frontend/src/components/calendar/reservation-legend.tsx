export default function ReservationLegend() {
  return (
    <div className='bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-4'>
      <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3'>Foglalás típusok</h3>
      <div className='grid grid-cols-2 gap-2 text-xs'>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 rounded bg-gradient-to-r from-primary to-primary/80 border-l-2 border-primary' />
          <span className='text-slate-600 dark:text-slate-400'>Admin foglalás</span>
        </div>

        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 rounded bg-gradient-to-r from-secondary to-secondary/80 border-l-2 border-secondary-foreground/20' />
          <span className='text-slate-600 dark:text-slate-400'>Túlidős</span>
        </div>

        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 rounded bg-gradient-to-r from-accent to-accent/80 border-l-2 border-accent-foreground' />
          <span className='text-slate-600 dark:text-slate-400'>Banda foglalás</span>
        </div>

        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 rounded bg-gradient-to-r from-muted to-muted/80 border-l-2 border-muted-foreground' />
          <span className='text-slate-600 dark:text-slate-400'>Banda (beengedő kell)</span>
        </div>

        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 rounded bg-gradient-to-r from-primary to-primary/80 border-l-2 border-primary' />
          <span className='text-slate-600 dark:text-slate-400'>Felhasználó foglalás</span>
        </div>

        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 rounded bg-gradient-to-r from-muted to-muted/80 border-l-2 border-muted-foreground' />
          <span className='text-slate-600 dark:text-slate-400'>Felhasználó (beengedő kell)</span>
        </div>
      </div>
    </div>
  );
}
