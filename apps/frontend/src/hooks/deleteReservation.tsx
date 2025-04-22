import axiosApi from '@/lib/apiSetup';

export default async function deleteReservation(id: number) {
  try {
    const res = await axiosApi.delete(`http://localhost:3030/reservations/${id}`);
    console.log('Sikeres törlés');
  } catch (err) {
    console.error(err);
  }
}
