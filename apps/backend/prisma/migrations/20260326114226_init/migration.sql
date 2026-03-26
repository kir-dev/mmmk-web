-- AlterTable
ALTER TABLE "SanctionRecord" ADD COLUMN     "reservationId" INTEGER;

-- AddForeignKey
ALTER TABLE "SanctionRecord" ADD CONSTRAINT "SanctionRecord_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
