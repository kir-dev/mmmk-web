/*
  Warnings:

  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BandToGenre` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `isReservable` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_BandToGenre" DROP CONSTRAINT "_BandToGenre_A_fkey";

-- DropForeignKey
ALTER TABLE "_BandToGenre" DROP CONSTRAINT "_BandToGenre_B_fkey";

-- AlterTable
ALTER TABLE "Band" ADD COLUMN     "genres" TEXT;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "isReservable" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "Genre";

-- DropTable
DROP TABLE "_BandToGenre";

-- CreateTable
CREATE TABLE "ProfilePicture" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "profileImage" BYTEA NOT NULL,

    CONSTRAINT "ProfilePicture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardRight" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CardRight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Period" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Period_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePicture_userId_key" ON "ProfilePicture"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CardRight_userId_key" ON "CardRight"("userId");

-- AddForeignKey
ALTER TABLE "ProfilePicture" ADD CONSTRAINT "ProfilePicture_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardRight" ADD CONSTRAINT "CardRight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
