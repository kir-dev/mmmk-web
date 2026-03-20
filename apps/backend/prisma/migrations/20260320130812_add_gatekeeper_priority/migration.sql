-- CreateEnum
CREATE TYPE "GateKeeperPriority" AS ENUM ('PRIMARY', 'SECONDARY');

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "gateKeeperPriority" "GateKeeperPriority";
