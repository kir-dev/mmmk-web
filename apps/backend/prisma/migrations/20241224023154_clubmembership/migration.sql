/*
  Warnings:

  - The values [GATEKEEPER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `dormRoomNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isDormResident` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `roomAccess` on the `User` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClubMembershipStatus" AS ENUM ('NEWBIE', 'ACTIVE', 'SENIOR');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_gateKeeperId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "dormRoomNumber",
DROP COLUMN "isDormResident",
DROP COLUMN "name",
DROP COLUMN "roomAccess",
ADD COLUMN     "fullName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "DormResidency" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roomNumber" INTEGER NOT NULL,

    CONSTRAINT "DormResidency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubMembership" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "ClubMembershipStatus" NOT NULL,
    "titles" TEXT[],
    "hasRoomAccess" BOOLEAN NOT NULL,
    "isLeadershipMember" BOOLEAN NOT NULL,
    "isGateKeeper" BOOLEAN NOT NULL,

    CONSTRAINT "ClubMembership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DormResidency_userId_key" ON "DormResidency"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClubMembership_userId_key" ON "ClubMembership"("userId");

-- AddForeignKey
ALTER TABLE "DormResidency" ADD CONSTRAINT "DormResidency_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMembership" ADD CONSTRAINT "ClubMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_gateKeeperId_fkey" FOREIGN KEY ("gateKeeperId") REFERENCES "ClubMembership"("id") ON DELETE SET NULL ON UPDATE CASCADE;
