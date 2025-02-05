export default function AddComment() {
  return (
    <div>
      <div className='flex gap-2 p-2 bg-gray-100 rounded-lg'>
        <input type='text' placeholder='Komment' className='p-2 rounded-lg w-full' />
        <button className='p-2 bg-blue-400 text-white rounded-lg'>Hozzáadás</button>
      </div>
    </div>
  );
}
