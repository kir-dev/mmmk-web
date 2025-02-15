/*
  Warnings:

  - A unique constraint covering the columns `[authSchId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authSchId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_authSchId_key" ON "User"("authSchId");
