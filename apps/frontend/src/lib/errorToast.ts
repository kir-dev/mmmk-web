import axios from 'axios';
import { toast } from 'sonner';

const CONTACT = 'Ha a probléma fennáll, kérjük lépj kapcsolatba velünk: hello@kir-dev.hu';

function getErrorMessage(error: unknown): { message: string; isServerError: boolean } {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 401) {
      return { message: 'Nincs jogosultságod ehhez a művelethez.', isServerError: false };
    }
    if (status === 403) {
      return { message: 'Hozzáférés megtagadva.', isServerError: false };
    }
    if (status === 404) {
      return { message: 'A keresett tartalom nem található.', isServerError: false };
    }
    if (status === 409) {
      const serverMsg: string = error.response?.data?.message || 'Az erőforrás már létezik.';
      return { message: serverMsg, isServerError: false };
    }
    if (status === 400 || status === 422) {
      const raw = error.response?.data?.message;
      const serverMsg: string = Array.isArray(raw) ? raw[0] : raw ?? 'Érvénytelen kérés.';
      return { message: serverMsg, isServerError: false };
    }
    if (!error.response) {
      return { message: 'Nem sikerült kapcsolódni a szerverhez.', isServerError: true };
    }
    return { message: 'Szerver hiba történt.', isServerError: true };
  }

  if (error instanceof Error) {
    return { message: error.message, isServerError: false };
  }

  return { message: 'Ismeretlen hiba történt.', isServerError: true };
}

export function showErrorToast(error: unknown): void {
  const { message, isServerError } = getErrorMessage(error);
  const description = isServerError ? CONTACT : undefined;
  toast.error(message, { description });
}
