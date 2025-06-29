import { AddPanel } from '@components/calendar/add-panel';
import { View } from '@components/calendar/calendar';
import IntervalSwitcher from '@components/calendar/interval-swithcer';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface DateSwitcherProps {
  handlePrevious: () => void;
  handleNext: () => void;
  currentDate: Date;
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  onGetData: () => void;
  setView: (view: View) => void;
}

export default function DateSwitcher(props: DateSwitcherProps) {
  return (
    <div>
      <button
        onClick={props.handlePrevious}
        className='p-2 rounded-full text-slate-800 dark:text-white hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground'
      >
        <ChevronLeftIcon className='w-5 h-5' />
      </button>
      <button
        onClick={props.handleNext}
        className='p-2 rounded-full text-slate-800 dark:text-white hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground'
      >
        <ChevronRightIcon className='w-5 h-5' />
      </button>
      <div className='text-lg font-medium text-slate-800 dark:text-white'>
        {props.currentDate.toLocaleString('hu', { month: 'long' })} {props.currentDate.getFullYear()}{' '}
      </div>
      <AddPanel onGetData={props.onGetData} currentDate={props.currentDate} reservations={[]} />
      <IntervalSwitcher setView={props.setView} />
    </div>
  );
}
