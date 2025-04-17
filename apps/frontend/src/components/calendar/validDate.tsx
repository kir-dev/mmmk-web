import { Reservation } from '@/types/reservation';

export default function validDate(
  start: Date,
  end: Date,
  reservation: Reservation | null,
  reservations: Reservation[]
): boolean {
  if (start > end || end.getHours() - start.getHours() > 3) {
    console.log('Csak simán szar vagy túl hosszú');
    return false;
  }
  if (reservation) {
    if (
      start.getDate() < new Date(reservation.startTime).getDate() - new Date(reservation.startTime).getDay() ||
      end.getDate() > new Date(reservation.endTime).getDate() + (7 - new Date(reservation.endTime).getDay())
    ) {
      console.log('Szerkesztési hiba');
      return false;
    }
  }

  reservations = reservations.filter((res) => res.startTime.getDate === start.getDate);

  for (const res of reservations) {
    const startHour = start.getHours();
    const endHour = end.getHours();
    const resStartHour = new Date(res.startTime).getHours();
    const resEndHour = new Date(res.endTime).getHours();

    const startMin = start.getMinutes();
    const endMin = end.getMinutes();
    const resStartMin = new Date(res.startTime).getMinutes();
    const resEndMin = new Date(res.endTime).getMinutes();

    if (
      (startHour > resStartHour && startHour < resEndHour) ||
      (startHour === resStartHour && startMin >= resStartMin) ||
      (endHour > resStartHour && endHour < resEndHour) ||
      (endHour === resEndHour && endMin <= resEndMin) ||
      (startHour <= resStartHour && endHour >= resEndHour) ||
      (startHour >= resStartHour && endHour <= resEndHour)
    ) {
      console.log('Ütközés');
      return false;
    }
  }
  return true;
}
