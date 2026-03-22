-- CreateTable
CREATE TABLE "ReservationConfig" (
    "id" SERIAL NOT NULL,
    "userDailyHours" DOUBLE PRECISION NOT NULL DEFAULT 4,
    "userWeeklyHours" DOUBLE PRECISION NOT NULL DEFAULT 8,
    "bandDailyHours" DOUBLE PRECISION NOT NULL DEFAULT 6,
    "bandWeeklyHours" DOUBLE PRECISION NOT NULL DEFAULT 12,

    CONSTRAINT "ReservationConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SanctionTier" (
    "id" SERIAL NOT NULL,
    "configId" INTEGER NOT NULL,
    "minPoints" INTEGER NOT NULL,
    "userDailyHours" DOUBLE PRECISION NOT NULL,
    "userWeeklyHours" DOUBLE PRECISION NOT NULL,
    "bandDailyHours" DOUBLE PRECISION NOT NULL,
    "bandWeeklyHours" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SanctionTier_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SanctionTier" ADD CONSTRAINT "SanctionTier_configId_fkey" FOREIGN KEY ("configId") REFERENCES "ReservationConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
