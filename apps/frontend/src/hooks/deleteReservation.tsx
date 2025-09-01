import axiosApi from '@/lib/apiSetup';

export default async function deleteReservation(id: number) {
  try {
    await axiosApi.delete(`/reservations/${id}`);
  } catch (err) {
    console.error(err);
  }
}
