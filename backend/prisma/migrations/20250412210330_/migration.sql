/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Contributor` table. All the data in the column will be lost.
  - You are about to drop the column `restriction` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Organization` table. All the data in the column will be lost.
  - Added the required column `fundId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `contributorId` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "FundType" AS ENUM ('ENDOWMENT', 'DONATION');

-- DropForeignKey
ALTER TABLE "Contributor" DROP CONSTRAINT "Contributor_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_contributorId_fkey";

-- DropIndex
DROP INDEX "Contributor_organizationId_idx";

-- AlterTable
ALTER TABLE "Contributor" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "restriction",
DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "fundId" TEXT NOT NULL,
ALTER COLUMN "contributorId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Fund" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" "FundType" NOT NULL,
    "restriction" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContributorToOrganization" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ContributorToFund" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContributorToOrganization_AB_unique" ON "_ContributorToOrganization"("A", "B");

-- CreateIndex
CREATE INDEX "_ContributorToOrganization_B_index" ON "_ContributorToOrganization"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ContributorToFund_AB_unique" ON "_ContributorToFund"("A", "B");

-- CreateIndex
CREATE INDEX "_ContributorToFund_B_index" ON "_ContributorToFund"("B");

-- CreateIndex
CREATE INDEX "Transaction_fundId_idx" ON "Transaction"("fundId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "Contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fund" ADD CONSTRAINT "Fund_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContributorToOrganization" ADD CONSTRAINT "_ContributorToOrganization_A_fkey" FOREIGN KEY ("A") REFERENCES "Contributor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContributorToOrganization" ADD CONSTRAINT "_ContributorToOrganization_B_fkey" FOREIGN KEY ("B") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContributorToFund" ADD CONSTRAINT "_ContributorToFund_A_fkey" FOREIGN KEY ("A") REFERENCES "Contributor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContributorToFund" ADD CONSTRAINT "_ContributorToFund_B_fkey" FOREIGN KEY ("B") REFERENCES "Fund"("id") ON DELETE CASCADE ON UPDATE CASCADE;
