/*
  Warnings:

  - Made the column `date_of_service` on table `revenue_marketers_schema` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "revenue_marketers_schema" ALTER COLUMN "date_of_service" SET NOT NULL,
ALTER COLUMN "date_of_service" SET DATA TYPE DATE;
