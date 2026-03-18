/*
  Warnings:

  - You are about to drop the column `isAdminMade` on the `Reservation` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "ReservationStatus" ADD VALUE 'ADMINMADE';

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "isAdminMade";
