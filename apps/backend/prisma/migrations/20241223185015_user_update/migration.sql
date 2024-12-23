/*
  Warnings:

  - You are about to drop the column `profileImage` on the `ProfilePicture` table. All the data in the column will be lost.
  - You are about to drop the column `roomNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CardRight` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image` to the `ProfilePicture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomAccess` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CardRight" DROP CONSTRAINT "CardRight_userId_fkey";

-- AlterTable
ALTER TABLE "ProfilePicture" DROP COLUMN "profileImage",
ADD COLUMN     "image" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roomNumber",
ADD COLUMN     "dormRoomNumber" INTEGER,
ADD COLUMN     "roomAccess" BOOLEAN NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "isDormResident" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'USER';

-- DropTable
DROP TABLE "CardRight";
