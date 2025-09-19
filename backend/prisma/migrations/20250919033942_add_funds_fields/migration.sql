/*
  Warnings:

  - Added the required column `description` to the `Fund` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Fund` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purpose` to the `Fund` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fund" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "purpose" TEXT NOT NULL;
