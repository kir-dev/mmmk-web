-- AlterEnum
ALTER TYPE "ReservationStatus" ADD VALUE 'SANCTIONED';

-- AlterTable
ALTER TABLE "Period" ADD COLUMN     "isOpen" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sanctionPoints" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "maxHoursPerWeek" DOUBLE PRECISION NOT NULL DEFAULT 8.0,
    "maxHoursPerDay" DOUBLE PRECISION NOT NULL DEFAULT 4.0,
    "minReservationMinutes" INTEGER NOT NULL DEFAULT 30,
    "maxReservationMinutes" INTEGER NOT NULL DEFAULT 180,
    "sanctionHourPenaltyPerPoint" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
