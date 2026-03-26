/*
  Warnings:

  - You are about to drop the column `sanctionPoints` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "sanctionPoints";

-- CreateTable
CREATE TABLE "SanctionRecord" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "bandId" INTEGER,
    "points" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "awardedBy" INTEGER NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SanctionRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SanctionRecord" ADD CONSTRAINT "SanctionRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SanctionRecord" ADD CONSTRAINT "SanctionRecord_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "Band"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SanctionRecord" ADD CONSTRAINT "SanctionRecord_awardedBy_fkey" FOREIGN KEY ("awardedBy") REFERENCES "ClubMembership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
