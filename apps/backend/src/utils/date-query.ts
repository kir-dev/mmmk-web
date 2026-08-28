import { BadRequestException } from '@nestjs/common';

/** A naptár szűrőjének dátum paramétere; hiányzó érték esetén nincs szűrés abba az irányba. */
export function parseDateQuery(value?: string): Date | undefined {
  if (!value) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new BadRequestException('Érvénytelen dátum a szűrőben.');

  return date;
}
