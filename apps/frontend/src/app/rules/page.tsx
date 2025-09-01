import RulesCard from '@/components/ui/rules-card';

export default function Rules() {
  return (
    <div className='w-full overflow-y-auto'>
      <div className='flex items-center justify-between flex-row p-4 sticky top-0 bg-background z-10'>
        <h1 className='text-2xl font-semibold text-primary'>Próbaterem Szabályzat</h1>
      </div>
      {RulesCard()}
    </div>
  );
}
