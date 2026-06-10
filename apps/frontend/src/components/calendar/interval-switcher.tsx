import { View } from './calendar';

interface IntervalSwitcherProps {
  setView: (view: View) => void;
}

export default function IntervalSwitcher(props: IntervalSwitcherProps) {
  return (
    <div>
      <button
        className='m-1 border-2 border-primary hover:bg-primary/10 dark:bg-primary/80 dark:text-primary-foreground dark:hover:bg-primary/90 font-bold py-1 px-2 rounded-lg'
        onClick={() => props.setView(View.Month)}
      >
        Month
      </button>
      <button
        className='m-1 border-2 border-primary hover:bg-primary/10 dark:bg-primary/80 dark:text-primary-foreground dark:hover:bg-primary/90 font-bold py-1 px-2 rounded-lg'
        onClick={() => props.setView(View.Week)}
      >
        Week
      </button>
      <button
        className='m-1 border-2 border-primary hover:bg-primary/10 dark:bg-primary/80 dark:text-primary-foreground dark:hover:bg-primary/90 font-bold py-1 px-2 rounded-lg'
        onClick={() => props.setView(View.Day)}
      >
        Day
      </button>
    </div>
  );
}
