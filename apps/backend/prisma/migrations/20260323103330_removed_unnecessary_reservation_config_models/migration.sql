/*
  Warnings:

  - You are about to drop the `ReservationConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SanctionTier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SanctionTier" DROP CONSTRAINT "SanctionTier_configId_fkey";

-- DropTable
DROP TABLE "ReservationConfig";

-- DropTable
DROP TABLE "SanctionTier";
