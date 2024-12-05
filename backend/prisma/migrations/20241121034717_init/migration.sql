/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Contributor` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contributor" DROP CONSTRAINT "Contributor_organizationId_fkey";

-- DropIndex
DROP INDEX "Contributor_organizationId_idx";

-- AlterTable
ALTER TABLE "Contributor" DROP COLUMN "organizationId";

-- CreateTable
CREATE TABLE "OrganizationContributor" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "contributorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationContributor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationContributor_organizationId_contributorId_key" ON "OrganizationContributor"("organizationId", "contributorId");

-- AddForeignKey
ALTER TABLE "OrganizationContributor" ADD CONSTRAINT "OrganizationContributor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationContributor" ADD CONSTRAINT "OrganizationContributor_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "Contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
