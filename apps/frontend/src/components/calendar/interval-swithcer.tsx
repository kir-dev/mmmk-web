import { View } from './calendar';

interface IntervalSwitcherProps {
  setView: (view: View) => void;
}

export default function IntervalSwitcher(props: IntervalSwitcherProps) {
  return (
    <div>
      <button
        className='m-1 border-2 border-orange-500 dark:bg-orange-600 dark:hover:bg-orange-500 dark:text-slate-50 font-bold py-1 px-2 rounded-lg'
        onClick={() => props.setView(View.Month)}
      >
        Month
      </button>
      <button
        className='m-1 border-2 border-orange-500 dark:bg-orange-600 dark:hover:bg-orange-500 dark:text-slate-50 font-bold py-1 px-2 rounded-lg'
        onClick={() => props.setView(View.Week)}
      >
        Week
      </button>
      <button
        className='m-1 border-2 border-orange-500 dark:bg-orange-600 dark:hover:bg-orange-500 dark:text-slate-50 font-bold py-1 px-2 rounded-lg'
        onClick={() => props.setView(View.Day)}
      >
        Day
      </button>
    </div>
  );
}
