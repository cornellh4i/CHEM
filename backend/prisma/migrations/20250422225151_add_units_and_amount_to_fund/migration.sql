/*
  Warnings:

  - Added the required column `amount` to the `Fund` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fund" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "units" DOUBLE PRECISION;
