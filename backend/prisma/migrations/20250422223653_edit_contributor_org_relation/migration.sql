/*
  Warnings:

  - You are about to drop the `_ContributorToOrganization` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `organizationId` to the `Contributor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ContributorToOrganization" DROP CONSTRAINT "_ContributorToOrganization_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContributorToOrganization" DROP CONSTRAINT "_ContributorToOrganization_B_fkey";

-- AlterTable
ALTER TABLE "Contributor" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ContributorToOrganization";

-- AddForeignKey
ALTER TABLE "Contributor" ADD CONSTRAINT "Contributor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
