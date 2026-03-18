export default function Line() {
  const offset = (new Date().getHours() + new Date().getMinutes() / 60) * 40 * 2;
  return (
    <div
      className='absolute w-full h-1 self-start border-t-2 border-orange-600'
      style={{
        top: `${offset}px`,
      }}
    />
  );
}
