/*
  Warnings:

  - The primary key for the `Metric` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Metric` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Metric" DROP CONSTRAINT "Metric_pkey";
ALTER TABLE "Metric" RENAME COLUMN "id" TO "metric_id";
ALTER TABLE "Metric" ADD CONSTRAINT "Metric_pkey" PRIMARY KEY ("metric_id");
