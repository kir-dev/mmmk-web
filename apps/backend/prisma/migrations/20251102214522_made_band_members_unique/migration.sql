/*
  Warnings:

  - A unique constraint covering the columns `[bandId,userId]` on the table `BandMembership` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BandMembership_bandId_userId_key" ON "BandMembership"("bandId", "userId");
