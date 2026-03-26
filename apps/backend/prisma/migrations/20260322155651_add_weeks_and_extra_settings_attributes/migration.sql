-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "banSanctionPointThreshold" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "maxTotalHoursPerWeek" DOUBLE PRECISION NOT NULL DEFAULT 12.0,
ADD COLUMN     "sanctionTotalHourPenaltyPerPoint" DOUBLE PRECISION NOT NULL DEFAULT 2.0;

-- CreateTable
CREATE TABLE "OpenedWeek" (
    "id" SERIAL NOT NULL,
    "monday" TIMESTAMP(3) NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OpenedWeek_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OpenedWeek_monday_key" ON "OpenedWeek"("monday");
